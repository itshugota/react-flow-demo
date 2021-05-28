import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import CallMergeReverse from '../../icons/CallMergeReverse';
import { NodeComponentProps } from 'react-flowy/lib/components/Nodes/wrapNode';
import ExtendedNodeContainer from '../NodeContainer/NodeContainer';
import { useStatusStore } from '../../../store/status.store';
import ProblemPopover from '../../problemPopover/ProblemPopover';

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    background: '#434343',
    padding: theme.spacing(1),
    color: '#fff',
  },
  selected: {
    boxShadow: '0px 0px 4px var(--selected-color)',
    borderRadius: '50%',
  }
}));

const TerminateNode: React.FC<NodeComponentProps> = ({ children, ...node }) => {
  const classes = useStyles();
  const shouldShowInvalidNodes = useStatusStore(state => state.shouldShowInvalidNodes);
  const problematicNode = useStatusStore(state => state.problematicNodes.find(pN => pN.id === node.id));

  return (
    <ExtendedNodeContainer node={node} isHandleDisabled>
      <div className={node.isSelected ? classes.selected : ''}>
        <Paper className={classes.container} elevation={4}>
          <CallMergeReverse />
        </Paper>
        {shouldShowInvalidNodes && problematicNode && <ProblemPopover status={problematicNode.status} message={problematicNode.message} />}
      </div>
    </ExtendedNodeContainer>
  );
};

export default React.memo(TerminateNode);
