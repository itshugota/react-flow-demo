import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import IntentNodeHeader from './IntentNodeHeader';
import IntentNodeBody from './IntentNodeBody';
import NodeContainer from '../NodeContainer/NodeContainer';

export interface IntentNodeProps {
  data: {
    intent: string;
  },
  id: string;
  xPos: number;
  yPos: number;
}

const useStyles = makeStyles(() => ({
  container: {
    position: 'relative'
  },
}));

const IntentNode: React.FC<IntentNodeProps> = ({ data, id, xPos, yPos }) => {
  const classes = useStyles();

  const node = {
    id,
    position: { x: xPos, y: yPos }
  };

  return (
    <NodeContainer node={node}>
      <Paper className={classes.container} elevation={4}>
        <IntentNodeHeader />
        <IntentNodeBody intent={data.intent} />
      </Paper>
    </NodeContainer>
  );
};

export default React.memo(IntentNode);
