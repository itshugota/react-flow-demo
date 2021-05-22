import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import ActionNodeHeader from './ActionNodeHeader';
import ActionNodeBody from './ActionNodeBody';

const useStyles = makeStyles(() => ({
  container: {},
}));

const ActionNodeShell: React.FC = () => {
  const classes = useStyles();

  return (
    <Paper className={classes.container} elevation={4}>
      <ActionNodeHeader />
      <ActionNodeBody action="" />
    </Paper>
  );
};

export default React.memo(ActionNodeShell);
