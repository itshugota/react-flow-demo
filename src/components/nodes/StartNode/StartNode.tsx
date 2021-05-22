import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import CallSplitReverse from '../../icons/CallSplitReverse';
import ExtendedNodeContainer from '../NodeContainer/NodeContainer';
import { NodeComponentProps } from 'react-flowy/lib/components/Nodes/wrapNode';

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
  selected: {
    boxShadow: '0px 0px 4px var(--selected-color)',
    borderRadius: '50%',
  }
}));

const StartNode: React.FC<NodeComponentProps> = ({ children, ...node }) => {
  const classes = useStyles();

  return (
    <ExtendedNodeContainer node={node}>
      <div className={node.isSelected ? classes.selected : ''}>
        <Paper className={classes.container} elevation={4}>
          <CallSplitReverse />
        </Paper>
      </div>
    </ExtendedNodeContainer>
  );
};

export default React.memo(StartNode);
