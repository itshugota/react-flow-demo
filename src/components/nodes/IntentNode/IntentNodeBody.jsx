import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { makeStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';

import Autocomplete from '../../ui/Autocomplete/Autocomplete';
import premadeIntents from '../../../data/intents.json';
import { useReactFlowyStore } from 'react-flowy/lib';
import CreateIntentDialog from '../../dialogs/CreateIntentDialog';

const useStyles = makeStyles(theme => ({
  main: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(2),
  },
  createNewIntent: {
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
  }
}));

const useIntents = () => {
  const [intents, setIntents] = useState([]);

  useEffect(() => {
    const stringifiedStoredIntents = localStorage.getItem('intents');

    if (stringifiedStoredIntents) {
      return setIntents(JSON.parse(stringifiedStoredIntents));
    }

    setIntents(premadeIntents);
  }, []);

  const saveIntents = (intents) => {
    localStorage.setItem('intents', JSON.stringify(intents));

    setIntents(intents);
  };

  return { intents, saveIntents };
};

const IntentNodeBody = ({ node }) => {
  const classes = useStyles();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const upsertNode = useReactFlowyStore(state => state.upsertNode);
  const { intents, saveIntents } = useIntents();

  const handleActionChange = (newIntentId) => {
    if (node.data.intent === newIntentId) return;

    const updatedNode = { ...node, data: { ...node.data, intent: newIntentId }};

    upsertNode(updatedNode);
  };

  const openCreateDialog = () => {
    setIsCreateDialogOpen(true);
  };

  const handleCloseCreateDialog = () => {
    setIsCreateDialogOpen(false);
  };

  const handleCreateIntent = intent => {
    saveIntents([...intents, intent]);

    const updatedNode = { ...node, data: { ...node.data, intent: intent.id }};

    upsertNode(updatedNode);
  };

  return (
    <main className={classes.main}>
      <Autocomplete
        options={intents}
        getOptionKey={option => option.id}
        getOptionLabel={option => option.name}
        value={node.data.intent}
        onChange={handleActionChange}
        onSelectChildren={openCreateDialog}
        placeholder="Intent"
      >
        <div className={classes.createNewIntent} onMouseDown={openCreateDialog}>
          <AddIcon className={classes.addIcon} />
          Create a new intent
        </div>
      </Autocomplete>
      <CreateIntentDialog isOpen={isCreateDialogOpen} onClose={handleCloseCreateDialog} onCreateIntent={handleCreateIntent} />
    </main>
  )
};

export default React.memo(IntentNodeBody);
