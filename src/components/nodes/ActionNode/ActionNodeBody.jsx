import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';

import Autocomplete from '../../ui/Autocomplete/Autocomplete';
import premadeActions from '../../../data/actions.json';
import { useReactFlowyStore } from 'react-flowy/lib';
import CreateActionDialog from '../../dialogs/CreateActionDialog';

const useStyles = makeStyles(theme => ({
  main: {
    display: 'flex',
    alignItems: 'center',
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

const useActions = () => {
  const [actions, setActions] = useState([]);

  useEffect(() => {
    const stringifiedStoredActions = localStorage.getItem('actions');

    if (stringifiedStoredActions) {
      return setActions(JSON.parse(stringifiedStoredActions));
    }

    setActions(premadeActions);
  }, []);

  const saveActions = (actions) => {
    localStorage.setItem('actions', JSON.stringify(actions));

    setActions(actions);
  };

  return { actions, saveActions };
};

const ActionNodeBody = ({ node }) => {
  const classes = useStyles();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const upsertNode = useReactFlowyStore(state => state.upsertNode);
  const { actions, saveActions } = useActions();

  const handleActionChange = (newActionId) => {
    if (node.data.action === newActionId) return;

    const newNode = { ...node, data: { ...node.data, action: newActionId }};

    upsertNode(newNode);
  };

  const openCreateDialog = () => {
    setIsCreateDialogOpen(true);
  };

  const handleCloseCreateDialog = () => {
    setIsCreateDialogOpen(false);
  };

  const handleCreateAction = action => {
    saveActions([...actions, action]);

    const updatedNode = { ...node, data: { ...node.data, action: action.id }};

    upsertNode(updatedNode);
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
      >
        <div className={classes.createNewAction} onMouseDown={openCreateDialog}>
          <AddIcon className={classes.addIcon} />
          Create a new action
        </div>
      </Autocomplete>
      <CreateActionDialog isOpen={isCreateDialogOpen} onClose={handleCloseCreateDialog} onCreateAction={handleCreateAction} />
    </main>
  )
};

export default React.memo(ActionNodeBody);
