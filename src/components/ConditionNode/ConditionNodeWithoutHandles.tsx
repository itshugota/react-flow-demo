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

const ConditionNodeWithoutHandles: React.FC<IntentNodeProps> = ({ data }) => {
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
      <ConditionNodeHeader />
      <ConditionNodeBody conditions={data.conditions} />
    </Paper>
  );
};

export default React.memo(ConditionNodeWithoutHandles);
