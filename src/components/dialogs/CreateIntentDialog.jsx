import React, { useState, useLayoutEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import useDialogBackdrop from './useDialogBackdrop';

const CreateIntentDialog = ({ isOpen, onClose, onCreateIntent }) => {
  const [intentInput, setIntentInput] = useState('');
  const { setDialogRef } = useDialogBackdrop({ onClose });

  const handleChangeIntentInput = event => {
    setIntentInput(event.target.value);
  };

  const createIntent = () => {
    const intent = { id: uuidv4(), name: intentInput.trim() };

    typeof onCreateIntent === 'function' && onCreateIntent(intent);

    typeof onClose === 'function' && onClose();

    setIntentInput('');
  };

  const handleSubmitForm = event => {
    event.preventDefault();

    createIntent();
  };

  return (
    <Dialog
      ref={setDialogRef}
      open={isOpen}
      onClose={onClose}
      aria-labelledby="create-intent-dialog-title"
      aria-describedby="create-intent-dialog-description"
    >
      <form onSubmit={handleSubmitForm}>
        <DialogTitle id="create-intent-dialog-title">Create a new intent</DialogTitle>
        <DialogContent>
          <DialogContentText id="create-intent-dialog-description">
            You can quickly create a new intent inside the Workflow screen and then go into its details later.
          </DialogContentText>
          <TextField label="Intent" variant="filled" fullWidth value={intentInput} onChange={handleChangeIntentInput} autoFocus />
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

export default CreateIntentDialog;
