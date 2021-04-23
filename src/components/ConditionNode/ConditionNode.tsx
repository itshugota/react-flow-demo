import React, { ChangeEvent } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import { Handle, Position } from 'react-flow-renderer';
import ConditionNodeHeader from './ConditionNodeHeader';
import ConditionNodeBody from './ConditionNodeBody';
import { Condition } from './Condition.interface';

export interface IntentNodeProps {
  data: {
    color: string;
    onChange: (event: ChangeEvent) => void;
    conditions: Condition[];
  }
}

const useStyles = makeStyles(theme => ({
  container: {},
}));

const ConditionNode: React.FC<IntentNodeProps> = ({ data }) => {
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
      <ConditionNodeHeader />
      <ConditionNodeBody conditions={data.conditions} />
    </Paper>
  );
};

export default React.memo(ConditionNode);
