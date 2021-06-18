import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '2px solid #434343',
    borderRadius: '50%',
    padding: theme.spacing(1),
    background:  'transparent',
    color: '#fff',
    width: 40,
    height: 40,
    position: 'relative',
  },
  child: {
    position: 'absolute',
    width: 28,
    height: 28,
    borderRadius: '50%',
    background: '#434343',
  },
  selected: {
    boxShadow: '0px 0px 4px var(--selected-color)',
    borderRadius: '50%',
  }
}));

const TerminateNodeShell = () => {
  const classes = useStyles();

  return (
    <Paper className={classes.container} elevation={4}>
      <Paper className={classes.child} elevation={0} />
    </Paper>
  );
};

export default React.memo(TerminateNodeShell);
