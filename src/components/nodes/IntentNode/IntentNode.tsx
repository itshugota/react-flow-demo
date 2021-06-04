import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import IntentNodeHeader from './IntentNodeHeader';
import IntentNodeBody from './IntentNodeBody';
import ExtendedNodeContainer from '../NodeContainer/ExtendedNodeContainer';
import { NodeComponentProps } from 'react-flowy/lib/components/Nodes/wrapNode';
import ProblemPopover from '../../problemPopover/ProblemPopover';
import { useStatusStore } from '../../../store/status.store';

const useStyles = makeStyles(() => ({
  container: {
    position: 'relative'
  },
  selected: {
    boxShadow: '0px 0px 4px var(--selected-color)'
  }
}));

const IntentNode: React.FC<NodeComponentProps> = ({ children, ...node }) => {
  const classes = useStyles();
  const shouldShowInvalidNodes = useStatusStore(state => state.shouldShowInvalidNodes);
  const problematicNode = useStatusStore(state => state.problematicNodes.find(pN => pN.id === node.id));

  return (
    <ExtendedNodeContainer node={node}>
      <Paper className={classes.container} elevation={4}>
        <div className={node.isSelected ? classes.selected : ''}>
          <IntentNodeHeader node={node} />
          <IntentNodeBody node={node} />
        </div>
        {shouldShowInvalidNodes && problematicNode && <ProblemPopover status={problematicNode.status} message={problematicNode.message} />}
      </Paper>
    </ExtendedNodeContainer>
  );
};

export default React.memo(IntentNode);
