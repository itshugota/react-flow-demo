import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';

import useDialogBackdrop from './useDialogBackdrop';

const useStyles = makeStyles(theme => ({
  entityValueTitle: {
    fontSize: 16,
    marginTop: theme.spacing(3),
  },
  valueAndSynonyms: {
    marginTop: theme.spacing(2),
    display: 'flex',
    alignItems: 'center',
  },
  valueInput: {
    marginRight: theme.spacing(1),
  },
  synonymInput: {
    marginRight: theme.spacing(1),
    flexGrow: 1,
  },
  table: {
    marginBottom: theme.spacing(2),
  },
  actionCell: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
  }
}));

const CreateEntityDialog = ({ isOpen, onClose, onCreateEntity }) => {
  const classes = useStyles();
  const [entityInput, setEntityInput] = useState('');
  const [valueAndSynonyms, setValueAndSynonyms] = useState([]);
  const [valueInput, setValueInput] = useState('');
  const [synonymInput, setSynonymInput] = useState('');
  const { setDialogRef } = useDialogBackdrop({ onClose });

  const handleChangeEntityInput = event => {
    setEntityInput(event.target.value);
  };

  const createEntity = () => {
    console.log('valueAndSynonyms', valueAndSynonyms);
    const entity = { id: uuidv4(), parameter: entityInput.trim(), values: valueAndSynonyms.map(vAS => vAS.value) };

    typeof onCreateEntity === 'function' && onCreateEntity(entity);

    typeof onClose === 'function' && onClose();

    setEntityInput('');
    setValueInput('');
    setSynonymInput('');
    setValueAndSynonyms([]);
  };

  const handleSubmitForm = event => {
    event.preventDefault();

    createEntity();
  };

  const handleChangeValueInput = event => {
    setValueInput(event.target.value);
  };

  const handleChangeSynonymInput = event => {
    setSynonymInput(event.target.value);
  };

  const createValueAndSynonyms = event => {
    setValueAndSynonyms(vAS => [...vAS, { value: valueInput, synonyms: synonymInput }]);

    setValueInput('');
    setSynonymInput('');
  };

  const handleDeleteVAS = vASToDelete => () => {
    const updatedValueAndSynonyms = valueAndSynonyms.filter(vAS => vAS !== vASToDelete);

    setValueAndSynonyms(updatedValueAndSynonyms);
  };

  return (
    <Dialog
      ref={setDialogRef}
      open={isOpen}
      onClose={onClose}
      aria-labelledby="create-entity-dialog-title"
      aria-describedby="create-entity-dialog-description"
    >
      <form onSubmit={handleSubmitForm}>
        <DialogTitle id="create-entity-dialog-title">Create a new entity</DialogTitle>
        <DialogContent>
          <DialogContentText id="create-entity-dialog-description">
            You can quickly create a new entity inside the Workflow screen and then go into its details later.
          </DialogContentText>
          <TextField label="Entity" variant="filled" fullWidth value={entityInput} onChange={handleChangeEntityInput} autoFocus />
          <Typography className={classes.entityValueTitle} variant="h6">Entity's values</Typography>
          <div className={classes.valueAndSynonyms}>
            <TextField className={classes.valueInput} label="Value" variant="filled" value={valueInput} onChange={handleChangeValueInput} />
            <TextField className={classes.synonymInput} label="Synonyms" variant="filled" value={synonymInput} onChange={handleChangeSynonymInput} />
            <Button color="primary" onClick={createValueAndSynonyms}>
              <AddIcon />
              Add
            </Button>
          </div>
          <TableContainer>
            <Table className={classes.table} aria-label="entity's value and synonyms table">
              <TableHead>
                <TableRow>
                  <TableCell>Value</TableCell>
                  <TableCell>Synonyms</TableCell>
                  <TableCell>&nbsp;</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
              {valueAndSynonyms.map(vAS =>
                <TableRow key={vAS.value}>
                  <TableCell component="th" scope="row">
                    {vAS.value}
                  </TableCell>
                  <TableCell>{vAS.synonyms}</TableCell>
                  <TableCell className={classes.actionCell}>
                    <IconButton onClick={handleDeleteVAS(vAS)} size="small">
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              )}
              </TableBody>
            </Table>
          </TableContainer>
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

export default CreateEntityDialog;
