import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import ActionNodeHeader from './ActionNodeHeader';
import ActionNodeBody from './ActionNodeBody';
import NodeWithFourSideHandles from '../FourSideHandles/NodeWithFourSideHandles';

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

const ActionNodeWithoutHandles: React.FC<IntentNodeProps> = ({ data, id, xPos, yPos }) => {
  const classes = useStyles();

  const node = {
    id,
    position: { x: xPos, y: yPos }
  };

  return (
    <NodeWithFourSideHandles node={node}>
      <Paper className={classes.container} elevation={4}>
        <ActionNodeHeader />
        <ActionNodeBody action={data.action} />
      </Paper>
    </NodeWithFourSideHandles>
  );
};

export default React.memo(ActionNodeWithoutHandles);
