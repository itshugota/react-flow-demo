import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import ActionNodeHeader from './ActionNodeHeader';
import ActionNodeBody from './ActionNodeBody';

const useStyles = makeStyles(() => ({
  container: {},
}));

const ActionNodeShell = () => {
  const classes = useStyles();

  const shellNode = {
    id: '?',
    position: { x: 0, y: 0 },
    data: {
      action: '',
    },
    shapeType: 'rectangle',
    type: 'acttionNode',
  };

  return (
    <Paper className={classes.container} elevation={4}>
      <ActionNodeHeader />
      <ActionNodeBody node={shellNode} />
    </Paper>
  );
};

export default React.memo(ActionNodeShell);
