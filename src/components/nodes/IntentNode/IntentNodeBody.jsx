import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import AddIcon from '@material-ui/icons/Add';
import QuoteIcon from '@material-ui/icons/FormatQuote';

import Autocomplete from '../../ui/Autocomplete/Autocomplete';
import { useReactFlowyStore } from 'react-flowy/lib';
import CreateIntentDialog from '../../dialogs/CreateIntentDialog';
import useIntents from '../../../hooks/useIntents';

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
  },
  popover: {
    position: 'relative',
    padding: theme.spacing(2),
    marginLeft: 8,
    '& .MuiTypography-h5': {
      fontSize: 16,
      fontWeight: 500,
    },
    '& .MuiTypography-h6': {
      fontSize: 16,
      fontWeight: 400,
      marginBottom: theme.spacing(0.5),
    },
    '& hr': {
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(1),
    },
    '& .MuiTypography-body1': {
      fontSize: 14,
    }
  },
  popoverArrow: {
    position: 'absolute',
    width: 0,
    height: 0,
    left: -8,
    top: 8,
    borderTop: '8px solid transparent',
    borderBottom: '10px solid transparent',
    borderRight: '8px solid white',
  },
  trainingPhrase: {
    display: 'flex',
    alignItems: 'center',
    fontSize: 14,
    '& span': {
      marginLeft: theme.spacing(0.5),
    },
  },
}));

const IntentDescriptionPopover = ({ id }) => {
  const classes = useStyles();
  const { intents } = useIntents();
  const intent = intents.find(({ id: intentId }) => intentId === id);

  if (!intent) return null;

  return (
    <Paper className={classes.popover} elevation={8}>
      <div className={classes.popoverArrow} />
      <Typography variant="h5">{intent.name}</Typography>
      <hr />
      <Typography variant="h6">Training phrases</Typography>
      {Array.isArray(intent.trainingPhrases) && intent.trainingPhrases.length > 0 ?
        intent.trainingPhrases.map(trainingPhrase => (
          <div className={classes.trainingPhrase}>
            <QuoteIcon fontSize="small" color="action" />
            <span>{trainingPhrase}</span>
          </div>
        )) :
        <Typography variant="body1">There are no training phrases.</Typography>
      }
    </Paper>
  );
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
        PopoverContentComponent={IntentDescriptionPopover}
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
