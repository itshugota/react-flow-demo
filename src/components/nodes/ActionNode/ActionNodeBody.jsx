import React, { useState, useEffect, useMemo } from 'react';
import { makeStyles } from '@material-ui/core/styles';

import ActionAutocomplete from './ActionAutocomplete';
import { useReactFlowyStore } from 'react-flowy/lib';

const useStyles = makeStyles(theme => ({
  main: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center',
    flexDirection: 'column',
    padding: theme.spacing(2)
  },
  createNewAction: {
    cursor: 'pointer',
    fontSize: 14,
    padding: theme.spacing(1, 2, 1, 1.5),
    textAlign: 'left',
    display: 'flex',
    alignItems: 'center',
    '&:hover': {
      background: theme.palette.grey[100],
    }
  },
  addIcon: {
    marginRight: theme.spacing(0.5),
    width: 20,
    height: 20,
  },
}));

const ActionNodeBody = ({ node }) => {
  const classes = useStyles();
  const upsertNode = useReactFlowyStore(state => state.upsertNode);

  const handleActionChange = (newActionId) => {
    if (node.data.action === newActionId) return;

    const newNode = { ...node, data: { ...node.data, action: newActionId }};

    upsertNode(newNode);
  };

  return (
    <>
      <main className={classes.main}>
        <ActionAutocomplete node={node} value={node.data.action} onChange={handleActionChange} />
      </main>
    </>
  )
};

export default React.memo(ActionNodeBody);
