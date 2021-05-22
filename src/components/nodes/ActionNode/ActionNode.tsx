import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import ActionNodeHeader from './ActionNodeHeader';
import ActionNodeBody from './ActionNodeBody';
import ExtendedNodeContainer from '../NodeContainer/NodeContainer';
import { NodeComponentProps } from 'react-flowy/lib/components/Nodes/wrapNode';

const useStyles = makeStyles(() => ({
  container: {},
  selected: {
    boxShadow: '0px 0px 4px var(--selected-color)'
  }
}));

const ActionNode: React.FC<NodeComponentProps> = ({ children, ...node }) => {
  const classes = useStyles();

  return (
    <ExtendedNodeContainer node={node}>
      <Paper className={classes.container} elevation={4}>
        <div className={node.isSelected ? classes.selected : ''}>
          <ActionNodeHeader />
          <ActionNodeBody action={node.data?.action || ''} />
        </div>
      </Paper>
    </ExtendedNodeContainer>
  );
};

export default React.memo(ActionNode);
