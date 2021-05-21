import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import CallSplitReverse from '../../icons/CallSplitReverse';
import NodeContainer from '../NodeContainer/NodeContainer';

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    background: '#fa103e',
    padding: theme.spacing(1),
    color: '#fff',
  },
}));

export interface StartNodeProps {
  id: string;
  xPos: number;
  yPos: number;
}

const StartNode: React.FC<StartNodeProps> = ({ id, xPos, yPos }) => {
  const classes = useStyles();

  const node = {
    id,
    position: { x: xPos, y: yPos }
  };

  return (
    <NodeContainer node={node}>
      <Paper className={classes.container} elevation={4}>
        <CallSplitReverse />
      </Paper>
    </NodeContainer>
  );
};

export default React.memo(StartNode);
