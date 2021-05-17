import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import { Handle, Position } from 'react-flowy';
import CallSplitReverse from '../icons/CallSplitReverse';

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

const StartNodeWithoutHandles: React.FC = () => {
  const classes = useStyles();

  return (
    <Paper className={classes.container} elevation={4}>
      <Handle
        type="source"
        position={Position.Left}
        style={{ display: 'none' }}
      />
      <CallSplitReverse />
    </Paper>
  );
};

export default React.memo(StartNodeWithoutHandles);
