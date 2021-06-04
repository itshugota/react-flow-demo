import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import IntentNodeHeader from './IntentNodeHeader';
import IntentNodeBody from './IntentNodeBody';
import { Node } from 'react-flowy/lib';

const useStyles = makeStyles(() => ({
  container: {
    position: 'relative'
  },
}));

const IntentNodeShell: React.FC = () => {
  const classes = useStyles();

  const shellNode: Node = {
    id: '?',
    position: { x: 0, y: 0 },
    data: {
      intent: '',
    },
    shapeType: 'rectangle',
  };

  return (
    <Paper className={classes.container} elevation={4}>
      <IntentNodeHeader />
      <IntentNodeBody node={shellNode} />
    </Paper>
  );
};

export default React.memo(IntentNodeShell);
