import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import ConditionNodeHeader from './ConditionNodeHeader';
import ConditionNodeBody from './ConditionNodeBody';
import ExtendedNodeContainer from '../NodeContainer/NodeContainer';
import { NodeComponentProps } from 'react-flowy/lib/components/Nodes/wrapNode';

const useStyles = makeStyles(() => ({
  container: {},
  selected: {
    boxShadow: '0px 0px 4px var(--selected-color)'
  }
}));

const ConditionNode: React.FC<NodeComponentProps> = ({ children, ...node }) => {
  const classes = useStyles();

  return (
    <ExtendedNodeContainer node={node}>
      <Paper className={classes.container} elevation={4}>
        <div className={node.isSelected ? classes.selected : ''}>
          <ConditionNodeHeader />
          <ConditionNodeBody conditions={node.data?.conditions || []} />
        </div>
      </Paper>
    </ExtendedNodeContainer>
  );
};

export default React.memo(ConditionNode);
