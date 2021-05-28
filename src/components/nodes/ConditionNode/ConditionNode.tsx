import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import ConditionNodeHeader from './ConditionNodeHeader';
import ConditionNodeBody from './ConditionNodeBody';
import ExtendedNodeContainer from '../NodeContainer/NodeContainer';
import { NodeComponentProps } from 'react-flowy/lib/components/Nodes/wrapNode';
import ProblemPopover from '../../problemPopover/ProblemPopover';
import { useStatusStore } from '../../../store/status.store';

const useStyles = makeStyles(() => ({
  container: {},
  selected: {
    boxShadow: '0px 0px 4px var(--selected-color)'
  }
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
          <ConditionNodeBody conditions={node.data?.conditions || []} />
        </div>
        {(shouldShowInvalidNodes || shouldShowUnhandledConditions) && problematicNode && <ProblemPopover status={problematicNode.status} message={problematicNode.message} />}
      </Paper>
    </ExtendedNodeContainer>
  );
};

export default React.memo(ConditionNode);
