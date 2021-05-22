import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import CallMergeReverse from '../../icons/CallMergeReverse';

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    background: '#434343',
    padding: theme.spacing(1),
    color: '#fff',
  },
}));

const TerminateNodeShell: React.FC = () => {
  const classes = useStyles();

  return (
    <Paper className={classes.container} elevation={4}>
      <CallMergeReverse />
    </Paper>
  );
};

export default React.memo(TerminateNodeShell);
