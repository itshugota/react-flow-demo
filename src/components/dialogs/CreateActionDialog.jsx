import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import useDialogBackdrop from './useDialogBackdrop';

const CreateActionDialog = ({ isOpen, onClose, onCreateAction }) => {
  const [actionInput, setActionInput] = useState('');
  const { setDialogRef } = useDialogBackdrop({ onClose });

  const handleChangeActionInput = event => {
    setActionInput(event.target.value);
  };

  const createAction = () => {
    const action = { id: uuidv4(), name: actionInput.trim() };

    typeof onCreateAction === 'function' && onCreateAction(action);

    typeof onClose === 'function' && onClose();

    setActionInput('');
  };

  const handleSubmitForm = event => {
    event.preventDefault();

    createAction();
  };

  return (
    <Dialog
      ref={setDialogRef}
      open={isOpen}
      onClose={onClose}
      aria-labelledby="create-action-dialog-title"
      aria-describedby="create-action-dialog-description"
    >
      <form onSubmit={handleSubmitForm}>
        <DialogTitle id="create-action-dialog-title">Create a new action</DialogTitle>
        <DialogContent>
          <DialogContentText id="create-action-dialog-description">
            You can quickly create a new action inside the Workflow screen and then go into its details later.
          </DialogContentText>
          <TextField label="Action" variant="filled" fullWidth value={actionInput} onChange={handleChangeActionInput} autoFocus />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary">
            Cancel
          </Button>
          <Button type="submit" color="primary" variant="contained">
            Create
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CreateActionDialog;
