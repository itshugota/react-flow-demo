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

const IntentNodeShell: React.FC = () => {
  const classes = useStyles();

  return (
    <Paper className={classes.container} elevation={4}>
      <IntentNodeHeader />
      <IntentNodeBody intent="" />
    </Paper>
  );
};

export default React.memo(IntentNodeShell);
