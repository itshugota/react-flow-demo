import React, { ChangeEvent } from 'react';
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

const useStyles = makeStyles(theme => ({
  container: {},
}));

const IntentNodeWithoutHandles: React.FC<IntentNodeProps> = ({ data }) => {
  const classes = useStyles();

  console.log('WHY IS IT UPDATED', data);

  return (
    <Paper className={classes.container} elevation={4}>
      <Handle
        type="source"
        position={Position.Left}
        style={{ display: 'none' }}
      />
      <Handle
        type="target"
        position={Position.Right}
        style={{ display: 'none' }}
      />
      <IntentNodeHeader />
      <IntentNodeBody intent={data.intent} />
    </Paper>
  );
};

export default React.memo(IntentNodeWithoutHandles);
