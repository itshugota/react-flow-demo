import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import Autocomplete from '../../ui/Autocomplete/Autocomplete';
import workflows from '../../../data/workflows.json';
import { useReactFlowyStoreById } from 'react-flowy/lib';

const useStyles = makeStyles(theme => ({
  main: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(2),
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
    },
  },
  addIcon: {
    marginRight: theme.spacing(0.5),
    width: 20,
    height: 20,
  },
}));

const BaseWorkflowNodeBody = ({ node, storeId }) => {
  const classes = useStyles();
  const useReactFlowyStore = useReactFlowyStoreById(storeId);
  const upsertNode = useReactFlowyStore(state => state.upsertNode);

  const handleActionChange = (newActionId) => {
    if (node.data.action === newActionId) return;

    const newNode = { ...node, data: { ...node.data, action: newActionId }};

    upsertNode(newNode);
  };

  return (
    <main className={classes.main}>
      <Autocomplete
        options={workflows}
        getOptionKey={option => option.id}
        getOptionLabel={option => option.name}
        value={node.data.workflow}
        onChange={handleActionChange}
        placeholder="Workflow"
      />
    </main>
  )
};

export default React.memo(BaseWorkflowNodeBody);
