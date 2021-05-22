import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import IntentNodeHeader from './IntentNodeHeader';
import IntentNodeBody from './IntentNodeBody';
import ExtendedNodeContainer from '../NodeContainer/NodeContainer';
import { NodeComponentProps } from 'react-flowy/lib/components/Nodes/wrapNode';

const useStyles = makeStyles(() => ({
  container: {
    position: 'relative'
  },
  selected: {
    boxShadow: '0px 0px 4px var(--selected-color)'
  }
}));

const IntentNode: React.FC<NodeComponentProps> = ({ children, ...node }) => {
  const classes = useStyles();

  return (
    <ExtendedNodeContainer node={node}>
      <Paper className={classes.container} elevation={4}>
        <div className={node.isSelected ? classes.selected : ''}>
          <IntentNodeHeader />
          <IntentNodeBody intent={node.data?.intent || ''} />
        </div>
      </Paper>
    </ExtendedNodeContainer>
  );
};

export default React.memo(IntentNode);
