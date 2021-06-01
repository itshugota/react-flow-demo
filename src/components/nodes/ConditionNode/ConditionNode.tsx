import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import ConditionNodeHeader from './ConditionNodeHeader';
import ConditionNodeBody from './ConditionNodeBody';
import ExtendedNodeContainer from '../NodeContainer/NodeContainer';
import { NodeComponentProps } from 'react-flowy/lib/components/Nodes/wrapNode';
import ProblemPopover from '../../problemPopover/ProblemPopover';
import { useStatusStore } from '../../../store/status.store';

const useStyles = makeStyles(theme => ({
  container: {},
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
}));

const ConditionNode: React.FC<NodeComponentProps> = ({ children, ...node }) => {
  const classes = useStyles();
  const shouldShowInvalidNodes = useStatusStore(state => state.shouldShowInvalidNodes);
  const shouldShowUnhandledConditions = useStatusStore(state => state.shouldShowUnhandledConditions);
  const problematicNode = useStatusStore(state => state.problematicNodes.find(pN => pN.id === node.id));

  return (
    <ExtendedNodeContainer node={node}>
      <Paper className={classes.container} elevation={4}>
        <div className={node.isSelected ? classes.selected : ''}>
          <ConditionNodeHeader node={node} />
          <ConditionNodeBody node={node} />
        </div>
        {(shouldShowInvalidNodes || shouldShowUnhandledConditions) && problematicNode && <ProblemPopover status={problematicNode.status} message={problematicNode.message} />}
      </Paper>
    </ExtendedNodeContainer>
  );
};

export default React.memo(ConditionNode);
