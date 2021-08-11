import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';

import Autocomplete from '../../ui/Autocomplete/Autocomplete';
import CreateActionDialog from '../../dialogs/CreateActionDialog';
import { useReactFlowyStoreById } from 'react-flowy/lib';
import useActions from '../../../hooks/useActions';

const useStyles = makeStyles(theme => ({
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

const ActionAutocomplete = ({ node, value, onChange, storeId }) => {
  const classes = useStyles();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const useReactFlowyStore = useReactFlowyStoreById(storeId);
  const upsertNode = useReactFlowyStore(state => state.upsertNode);
  const { actions, saveActions } = useActions();

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
    <>
      <CreateActionDialog isOpen={isCreateDialogOpen} onClose={handleCloseCreateDialog} onCreateAction={handleCreateAction} />
      <Autocomplete
        options={actions}
        getOptionKey={option => option.id}
        getOptionLabel={option => option.name}
        value={value}
        onChange={onChange}
        onSelectChildren={openCreateDialog}
        placeholder="Action"
      >
        <div className={classes.createNewAction} onMouseDown={openCreateDialog}>
          <AddIcon className={classes.addIcon} />
          Create a new action
        </div>
      </Autocomplete>
    </>
  )
}

export default React.memo(ActionAutocomplete);
