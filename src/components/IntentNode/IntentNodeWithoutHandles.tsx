import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import IntentNodeHeader from './IntentNodeHeader';
import IntentNodeBody from './IntentNodeBody';
import NodeWithFourSideHandles from '../FourSideHandles/NodeWithFourSideHandles';

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

const IntentNodeWithoutHandles: React.FC<IntentNodeProps> = ({ data, id, xPos, yPos }) => {
  const classes = useStyles();

  const node = {
    id,
    position: { x: xPos, y: yPos }
  };

  return (
    <NodeWithFourSideHandles node={node}>
      <Paper className={classes.container} elevation={4}>
        <IntentNodeHeader />
        <IntentNodeBody intent={data.intent} />
      </Paper>
    </NodeWithFourSideHandles>
  );
};

export default React.memo(IntentNodeWithoutHandles);
