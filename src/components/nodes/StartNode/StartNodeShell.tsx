import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import CallSplitReverse from '../../icons/CallSplitReverse';

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    background: '#fa103e',
    padding: theme.spacing(1),
    color: '#fff',
  },
}));

const StartNodeShell: React.FC = () => {
  const classes = useStyles();

  return (
    <Paper className={classes.container} elevation={4}>
      <CallSplitReverse />
    </Paper>
  );
};

export default React.memo(StartNodeShell);
