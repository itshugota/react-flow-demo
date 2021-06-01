import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import ConditionNodeHeader from './ConditionNodeHeader';
import ConditionNodeBody from './ConditionNodeBody';
import { Node } from 'react-flowy/lib';

const useStyles = makeStyles(() => ({
  container: {},
}));

const ConditionNodeShell: React.FC = () => {
  const classes = useStyles();

  const shellNode: Node = {
    id: '?',
    position: { x: 0, y: 0 },
    data: {
      conditions: [],
    },
  };

  return (
    <Paper className={classes.container} elevation={4}>
      <ConditionNodeHeader />
      <ConditionNodeBody node={shellNode} />
    </Paper>
  );
};

export default React.memo(ConditionNodeShell);
