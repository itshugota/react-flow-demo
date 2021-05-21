import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import ActionNodeHeader from './ActionNodeHeader';
import ActionNodeBody from './ActionNodeBody';
import NodeContainer from '../NodeContainer/NodeContainer';

export interface IntentNodeProps {
  data: {
    action: string;
  },
  id: string;
  xPos: number;
  yPos: number;
}

const useStyles = makeStyles(() => ({
  container: {},
}));

const ActionNode: React.FC<IntentNodeProps> = ({ data, id, xPos, yPos }) => {
  const classes = useStyles();

  const node = {
    id,
    position: { x: xPos, y: yPos }
  };

  return (
    <NodeContainer node={node}>
      <Paper className={classes.container} elevation={4}>
        <ActionNodeHeader />
        <ActionNodeBody action={data.action} />
      </Paper>
    </NodeContainer>
  );
};

export default React.memo(ActionNode);
