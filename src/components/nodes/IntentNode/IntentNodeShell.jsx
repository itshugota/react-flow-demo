import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import IntentNodeHeader from './IntentNodeHeader';
import IntentNodeBody from './IntentNodeBody';

const useStyles = makeStyles(() => ({
  container: {
    position: 'relative'
  },
}));

const IntentNodeShell = () => {
  const classes = useStyles();

  const shellNode = {
    id: '?',
    position: { x: 0, y: 0 },
    data: {
      intent: '',
    },
    shapeType: 'rectangle',
    type: 'intentNode',
  };

  return (
    <Paper className={classes.container} elevation={4}>
      <IntentNodeHeader />
      <IntentNodeBody node={shellNode} />
    </Paper>
  );
};

export default React.memo(IntentNodeShell);
