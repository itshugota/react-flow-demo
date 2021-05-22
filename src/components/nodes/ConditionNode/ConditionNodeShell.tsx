import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import ConditionNodeHeader from './ConditionNodeHeader';
import ConditionNodeBody from './ConditionNodeBody';

const useStyles = makeStyles(() => ({
  container: {},
}));

const ConditionNodeShell: React.FC = () => {
  const classes = useStyles();

  return (
      <Paper className={classes.container} elevation={4}>
        <ConditionNodeHeader />
        <ConditionNodeBody conditions={[]} />
      </Paper>
  );
};

export default React.memo(ConditionNodeShell);
