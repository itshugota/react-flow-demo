import React, { useRef, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';

import ConditionNodeHeader from './ConditionNodeHeader';
import ConditionNodeBody from './ConditionNodeBody';
import ConditionNodeContainer from '../NodeContainer/ConditionNodeContainer';
import ProblemPopover from '../../problemPopover/ProblemPopover';
import { useStatusStore } from '../../../store/status.store';
import { connectShapes, eventPointToCanvasCoordinates, getCanvas, getInEdges, getOutEdges, getRectangleFromNode, getSourceNode, getTargetNode, isPointInShape, transformSelector, useReactFlowyStore } from 'react-flowy/lib';

const useStyles = makeStyles(theme => ({
  container: {
    boxShadow: '0px 2px 4px 1px rgb(0 0 0 / 20%)',
  },
  selected: {
    boxShadow: '0px 0px 4px var(--selected-color)'
  },
  leftArrow: {
    position: 'relative',
    width: 100,
    height: 100,
    overflow: 'hidden',
    boxShadow: '0 16px 10px -17px rgba(0, 0, 0, 0.5)',
    '&:after': {
      content: '""',
      position: 'absolute',
      width: 50,
      height: 50,
      background: '#999',
      transform: 'rotate(45deg)',
      top: 75,
      left: 25,
      boxShadow: '-1px -1px 10px -2px rgba(0, 0, 0, 0.5)',
    }
  },
  footer: {
    position: 'absolute',
    left: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  addParameterButton: {
    '& .MuiSvgIcon-root': {
      marginRight: theme.spacing(0.75),
    },
  },
}));

const ConditionNode = ({ children, ...node }) => {
  const classes = useStyles();
  const previousNodeHeight = useRef(node.height);
  const shouldShowInvalidNodes = useStatusStore(state => state.shouldShowInvalidNodes);
  const shouldShowUnhandledConditions = useStatusStore(state => state.shouldShowUnhandledConditions);
  const problematicNode = useStatusStore(state => state.problematicNodes.find(pN => pN.id === node.id));
  const outcomingEdges = getOutEdges(node);
  const isThereOutcomigEdgeWithTrueLabel = outcomingEdges.find(edge => edge.label === 'TRUE');
  const upsertNode = useReactFlowyStore(state => state.upsertNode);
  const upsertEdge = useReactFlowyStore(state => state.upsertEdge);
  const transform = useReactFlowyStore(transformSelector);

  const addParameter = () => {
    let newConditions = [];
    const newCondition = {
      parameterId: '',
      parameter: '',
      operator: '',
      value: '',
    };

    if (node.data && Array.isArray(node.data.conditions)) {
      newConditions = [...node.data.conditions, newCondition];
    } else {
      newConditions = [newCondition];
    }

    const newNode = { ...node, data: { ...node.data, conditions: newConditions } };

    upsertNode(newNode);
  };

  const handleMouseDown = e => {
    const canvas = getCanvas(transform);

    const nodeShape = {
      x: node.position.x,
      y: node.position.y,
      width: node.width,
      height: node.height,
      ...node.shapeData,
    };

    if (!isPointInShape(node.shapeType)(eventPointToCanvasCoordinates(e)(canvas), nodeShape)) {
      return e.stopPropagation();
    }
  };

  useEffect(() => {
    if (!previousNodeHeight.current) previousNodeHeight.current = node.height;

    if (node.height < previousNodeHeight.current) {
      getOutEdges(node).forEach(outcomingEdge => {
        if (outcomingEdge.waypoints[0].y <= node.height) return outcomingEdges;

        const targetNode = getTargetNode(outcomingEdge);
        const newWaypoints = connectShapes({ ...getRectangleFromNode(node), ...node.shapeData }, { ...getRectangleFromNode(targetNode), ...targetNode.shapeData }, node.shapeType, targetNode.shapeType);

        upsertEdge({ ...outcomingEdge, waypoints: newWaypoints });
      });

      getInEdges(node).forEach(incomingEdge => {
        if (incomingEdge.waypoints[0].y <= node.height) return outcomingEdges;

        const sourceNode = getSourceNode(incomingEdge);
        const newWaypoints = connectShapes({ ...getRectangleFromNode(sourceNode), ...sourceNode.shapeData }, { ...getRectangleFromNode(node), ...node.shapeData }, sourceNode.shapeType, node.shapeType);

        upsertEdge({ ...incomingEdge, waypoints: newWaypoints });
      });
    }

    previousNodeHeight.current = node.height;
  }, [node.height]);

  return (
    <ConditionNodeContainer node={node} additionalEdgeProps={{ type: 'conditionEdge', label: isThereOutcomigEdgeWithTrueLabel ? 'FALSE' : 'TRUE' }}>
      <Paper className={classes.container} elevation={0}>
        <svg onMouseDown={handleMouseDown} style={{ position: 'absolute', top: -69, left: 0 }} width="518" height="70" viewBox="0 0 518 70" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M259 0L518 70H0 0Z" fill="#ffffff" fillOpacity="1"/>
          <path d="M259 0L518 70H0 0Z" fill="#0fe8ac" fillOpacity="0.05"/>
        </svg>
        <svg onMouseDown={handleMouseDown} style={{ position: 'absolute', bottom: -69, left: 0, filter: 'drop-shadow(rgba(0, 0, 0, 0.2) 0px 4px 2px)' }} width="518" height="70" viewBox="0 0 518 70" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M259 70L0 0L518 0L259 70Z" fill="#ffffff" fillOpacity="1"/>
        </svg>
        <ConditionNodeHeader node={node} />
        <ConditionNodeBody node={node} />
        <footer className={classes.footer}>
          <Button className={classes.addParameterButton} onClick={addParameter}>
            <AddIcon />
            Add parameter
          </Button>
        </footer>
        {(shouldShowInvalidNodes || shouldShowUnhandledConditions) && problematicNode && <ProblemPopover status={problematicNode.status} message={problematicNode.message} />}
      </Paper>
    </ConditionNodeContainer>
  );
};

export default React.memo(ConditionNode);
