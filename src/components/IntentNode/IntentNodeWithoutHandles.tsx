import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import { Handle, Position } from 'react-flowy';
import IntentNodeHeader from './IntentNodeHeader';
import IntentNodeBody from './IntentNodeBody';

export interface IntentNodeProps {
  data: {
    intent: string;
  }
}

const useStyles = makeStyles(() => ({
  container: {
    position: 'relative'
  },
}));

const IntentNodeWithoutHandles: React.FC<IntentNodeProps> = ({ data }) => {
  const classes = useStyles();

  return (
    <Paper className={classes.container} elevation={4}>
      <IntentNodeHeader />
      <IntentNodeBody intent={data.intent} />
    </Paper>
  );
};

export default React.memo(IntentNodeWithoutHandles);
