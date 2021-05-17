import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import { Handle, Position } from 'react-flowy';
import ActionNodeHeader from './ActionNodeHeader';
import ActionNodeBody from './ActionNodeBody';

export interface IntentNodeProps {
  data: {
    action: string;
  }
}

const useStyles = makeStyles(() => ({
  container: {},
}));

const ActionNodeWithoutHandles: React.FC<IntentNodeProps> = ({ data }) => {
  const classes = useStyles();

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
      <ActionNodeHeader />
      <ActionNodeBody action={data.action} />
    </Paper>
  );
};

export default React.memo(ActionNodeWithoutHandles);
