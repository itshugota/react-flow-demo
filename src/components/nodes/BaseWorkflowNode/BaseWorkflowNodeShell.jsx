import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import BaseWorkflowNodeHeader from './BaseWorkflowNodeHeader';
import BaseWorkflowNodeBody from './BaseWorkflowNodeBody';

const useStyles = makeStyles(() => ({
  container: {
    border: '2px solid #434343',
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
    type: 'baseWorkflowNode',
  };

  return (
    <Paper className={classes.container} elevation={4}>
      <BaseWorkflowNodeHeader />
      <BaseWorkflowNodeBody node={shellNode} />
    </Paper>
  );
};

export default React.memo(BaseWorkflowNodeShell);
