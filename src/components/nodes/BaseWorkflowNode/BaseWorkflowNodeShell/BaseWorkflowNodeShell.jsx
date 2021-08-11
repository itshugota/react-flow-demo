import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import BaseWorkflowNodeShellHeader from './BaseWorkflowNodeShellHeader';
import BaseWorkflowNodeShellBody from './BaseWorkflowNodeShellBody';

const useStyles = makeStyles(() => ({
  container: {
    border: '2px solid #434343',
    borderRadius: 4,
  },
}));

const BaseWorkflowNodeShell = () => {
  const classes = useStyles();

  const shellNode = {
    id: '?',
    position: { x: 0, y: 0 },
    data: {
      workflow: '',
    },
    shapeType: 'rectangle',
    type: 'subWorkflowNode',
  };

  return (
    <Paper className={classes.container} elevation={4}>
      <BaseWorkflowNodeShellHeader />
      <BaseWorkflowNodeShellBody node={shellNode} />
    </Paper>
  );
};

export default React.memo(BaseWorkflowNodeShell);
