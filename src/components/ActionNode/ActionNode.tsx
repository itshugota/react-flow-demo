import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import { Handle, Position } from 'react-flow-renderer';
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

const ActionNode: React.FC<IntentNodeProps> = ({ data }) => {
  const classes = useStyles();

  return (
    <Paper className={classes.container} elevation={4}>
      <Handle
        type="target"
        id="target-top"
        position={Position.Top}
        onConnect={(params) => console.log('handle onConnect', params)}
      />
      <Handle
        type="target"
        id="target-left"
        position={Position.Left}
        onConnect={(params) => console.log('handle onConnect', params)}
      />
      <Handle
        type="source"
        id="source-bottom"
        position={Position.Bottom}
      />
      <Handle
        type="source"
        id="source-right"
        position={Position.Right}
      />
      <ActionNodeHeader />
      <ActionNodeBody action={data.action} />
    </Paper>
  );
};

export default React.memo(ActionNode);
