import React, { useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import DragIndicatorIcon from '@material-ui/icons/DragIndicator';

import { useReactFlowyStore, eventPointToCanvasCoordinates, getCanvas, getReactFlowyElement, isPointInRect, Node, transformSelector, snapPointToGrid, snapGridSelector, nodesSelector } from 'react-flowy/lib';
import { useRef } from 'react';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    marginBottom: theme.spacing(3),
    cursor: 'grabbing',
    userSelect: 'none',
  },
  iconGroup: {
    display: 'flex',
    alignItems: 'center',
    height: 'fit-content',
    color: '#e9e9ef',
  },
  blockTypeIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#e9e9ef',
    width: 36,
    height: 36,
    color: 'rgba(0, 0, 0, 0.6)',
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    borderRadius: 2,
  },
  textContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    margin: 0
  },
  name: {
    color: 'var(--black)',
    fontSize: 16,
    lineHeight: '18.75px'
  },
  description: {
    marginTop: theme.spacing(0.5),
    color: '#828282',
    fontSize: 14,
    lineHeight: '16px',
  }
}));

export interface DraggableBlockProps {
  Icon: React.FC;
  DragShell: React.FC;
  name: string;
  description: string;
  nodeType: string;
}

export type NodeDropValidator = (nodes: Node[], droppableNode: Node) => boolean; 

export const nodeDropValidators: Record<string, NodeDropValidator> = {};

export const registerNodeDropValidator = (nodeType: string) => (nodeDropValidator: NodeDropValidator) => {
  nodeDropValidators[nodeType] = nodeDropValidator;
};

const DraggableBlock: React.FC<DraggableBlockProps> = ({ Icon, DragShell, name, description, nodeType }) => {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const nodes = useRef<Node[]>([]);
  const transform = useReactFlowyStore(transformSelector);
  const snapGrid = useReactFlowyStore(snapGridSelector);
  const upsertNode = useReactFlowyStore(state => state.upsertNode);
  const [isGrabbing, setIsGrabbing] = useState(false);
  const [dragX, setDragX] = useState(0);
  const [dragY, setDragY] = useState(0);

  useEffect(() => {
    useReactFlowyStore.subscribe(nodesFromStore => {
      nodes.current = nodesFromStore;
    }, nodesSelector);
  }, []);

  useEffect(() => {
    if (!isGrabbing) return;

    document.addEventListener('mousemove', handleDrag);
    document.addEventListener('mouseup', handleDragStop);
    document.body.style.cursor = 'grabbing';

    return () => {
      document.removeEventListener('mousemove', handleDrag);
      document.removeEventListener('mouseup', handleDragStop);
      document.body.style.cursor = 'auto';
    };
  }, [isGrabbing, transform]);

  const handleDrag = (e: MouseEvent) => {
    setDragX(e.clientX);
    setDragY(e.clientY);
  };

  const handleDragStop = (e: MouseEvent) => {
    setIsGrabbing(false);

    const reactFlowyElement = getReactFlowyElement();
    const reactFlowyElementBoundingRect = reactFlowyElement!.getBoundingClientRect();
    const cursorPosition = { x: e.clientX, y: e.clientY };

    if (!isPointInRect(cursorPosition, reactFlowyElementBoundingRect)) return;

    const canvas = getCanvas(transform);

    const cursorCoordinates = snapPointToGrid(eventPointToCanvasCoordinates(e)(canvas), snapGrid);

    const newNode: Node = {
      id: `x${cursorPosition.x}y${cursorPosition.y}`,
      type: nodeType,
      position: cursorCoordinates,
    };

    if (nodeType === 'actionNode') {
      newNode.data = { action: '' };
    } else if (nodeType === 'intentNode') {
      newNode.data = { intent: '' };
    } else if (nodeType === 'conditionNode') {
      newNode.data = { conditions: [] };
    }

    if (typeof nodeDropValidators[nodeType] === 'function' && !nodeDropValidators[nodeType](nodes.current, newNode)) {
      return enqueueSnackbar('Failed to insert node', { variant: 'error' });
    }

    upsertNode(newNode);
  };

  const handleDragStart = (e: React.MouseEvent) => {
    setIsGrabbing(true);
    setDragX(e.clientX);
    setDragY(e.clientY);
  };

  return (
    <div className={classes.root} onMouseDown={handleDragStart}>
      <span className={classes.iconGroup}>
        <DragIndicatorIcon />
        <span className={classes.blockTypeIcon}>
          <Icon />
        </span>
      </span>
      <div className={classes.textContainer}>
        <Typography className={classes.name} variant="h6" align="left">{name}</Typography>
        <Typography className={classes.description} variant="body2" align="left">{description}</Typography>
      </div>
      {isGrabbing &&
        <div style={{
          position: 'fixed',
          top: dragY,
          left: dragX,
          opacity: 0.7,
          transform: `scale(${transform[2]})`,
          transformOrigin: 'top left'
        }}>
          <DragShell />
        </div>
      }
    </div>
  )
}

export default React.memo(DraggableBlock);
