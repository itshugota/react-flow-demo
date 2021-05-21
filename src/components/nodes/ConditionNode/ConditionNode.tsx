import React, { ChangeEvent } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import ConditionNodeHeader from './ConditionNodeHeader';
import ConditionNodeBody from './ConditionNodeBody';
import { Condition } from './Condition.interface';
import NodeContainer from '../NodeContainer/NodeContainer';

export interface ConditionNodeProrps {
  data: {
    color: string;
    onChange: (event: ChangeEvent) => void;
    conditions: Condition[];
  },
  id: string;
  xPos: number;
  yPos: number;
}

const useStyles = makeStyles(() => ({
  container: {},
}));

const ConditionNode: React.FC<ConditionNodeProrps> = ({ data, id, xPos, yPos }) => {
  const classes = useStyles();

  const node = {
    id,
    position: { x: xPos, y: yPos }
  };

  return (
    <NodeContainer node={node}>
      <Paper className={classes.container} elevation={4}>
        <ConditionNodeHeader />
        <ConditionNodeBody conditions={data.conditions} />
      </Paper>
    </NodeContainer>
  );
};

export default React.memo(ConditionNode);
