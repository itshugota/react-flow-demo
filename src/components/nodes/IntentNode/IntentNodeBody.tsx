import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Autocomplete from '../../ui/Autocomplete/Autocomplete';
import intents from '../../../data/intents.json';
import { Node, useReactFlowyStore } from 'react-flowy/lib';

const useStyles = makeStyles(theme => ({
  main: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(2),
  },
}));

export interface IntentNodeBodyProps {
  node: Node;
}

const IntentNodeBody: React.FC<IntentNodeBodyProps> = ({ node }) => {
  const classes = useStyles();
  const upsertNode = useReactFlowyStore(state => state.upsertNode);

  const handleActionChange = (newIntentId: string) => {
    if (node.data.intent === newIntentId) return;

    const newNode = { ...node, data: { ...node.data, intent: newIntentId }};

    upsertNode(newNode);
  };

  return (
    <main className={classes.main}>
      <Autocomplete
        options={intents}
        getOptionKey={option => option.id}
        getOptionLabel={option => option.name}
        value={node.data.intent}
        onChange={handleActionChange}
        placeholder="Intent"
      />
    </main>
  )
};

export default React.memo(IntentNodeBody);
