import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import { Handle, Position } from 'react-flow-renderer';
import IntentNodeHeader from './IntentNodeHeader';
import IntentNodeBody from './IntentNodeBody';

export interface IntentNodeProps {
  data: {
    intent: string;
  }
}

const useStyles = makeStyles(() => ({
  container: {},
}));

const IntentNode: React.FC<IntentNodeProps> = ({ data }) => {
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
      <IntentNodeHeader />
      <IntentNodeBody intent={data.intent} />
    </Paper>
  );
};

export default React.memo(IntentNode);
