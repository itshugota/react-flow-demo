import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Autocomplete from '../../ui/Autocomplete/Autocomplete';
import actions from '../../../data/actions.json';
import { Node, useReactFlowyStore } from 'react-flowy/lib';

const useStyles = makeStyles(theme => ({
  main: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(2)
  }
}));

export interface ActionNodeBodyProps {
  node: Node;
}

const ActionNodeBody: React.FC<ActionNodeBodyProps> = ({ node }) => {
  const classes = useStyles();
  const upsertNode = useReactFlowyStore(state => state.upsertNode);

  const handleActionChange = (newActionId: string) => {
    if (node.data.action === newActionId) return;

    const newNode = { ...node, data: { ...node.data, action: newActionId }};

    upsertNode(newNode);
  };

  return (
    <main className={classes.main}>
      <Autocomplete
        options={actions}
        getOptionKey={option => option.id}
        getOptionLabel={option => option.name}
        value={node.data.action}
        onChange={handleActionChange}
        placeholder="Action"
      />
    </main>
  )
};

export default React.memo(ActionNodeBody);
