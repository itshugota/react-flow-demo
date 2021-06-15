import React from 'react';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';

import WarningIndicator from '../../icons/WarningIndicator';
import { useStatusStore } from '../../../store/status.store';

const useStyles = makeStyles(theme => ({
  container: {
    width: 320
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    background: 'rgba(242, 153, 74, 0.05)',
    padding: theme.spacing(1.5, 2),
  },
  title: {
    fontSize: 14,
    marginLeft: theme.spacing(1)
  },
  body: {
    padding: theme.spacing(1.5, 2, 2, 2),
  },
  bodyTitle: {
    fontSize: 12,
    marginBottom: theme.spacing(1),
  },
  bodyDescription: {
    fontSize: 12,
    marginBottom: theme.spacing(1.5),
  },
  showErrorsButton: {
    marginRight: theme.spacing(1.5),
    fontSize: 12,
  },
  forceSaveButton: {
    fontSize: 12,
  }
}));

const WarningStatusPopoverContent = () => {
  const classes = useStyles();
  const shouldShowUnhandledConditions = useStatusStore(state => state.shouldShowUnhandledConditions);
  const setShouldShowUnhandledConditions = useStatusStore(state => state.setShouldShowUnhandledConditions);

  const handleShowUnhandledConditions = () => {
    setShouldShowUnhandledConditions(true);
  };

  const handleHideUnhandledConditions = () => {
    setShouldShowUnhandledConditions(false);
  };

  return (
    <div className={classes.container}>
      <header className={classes.header}>
        <WarningIndicator />
        <Typography className={classes.title} variant="h6">The workflow has unhandled conditions</Typography>
      </header>
      <section className={classes.body}>
        <Typography className={classes.bodyTitle} variant="body1"><strong>The workflow has been automatically saved</strong></Typography>
        <Typography className={classes.bodyDescription} variant="body1">A workflow with unhandled conditions will still be automatically saved. However, you should try to fix the unhandled conditions.</Typography>
        {shouldShowUnhandledConditions && <Button className={classes.showErrorsButton} variant="contained" color="primary" onClick={handleHideUnhandledConditions}>Hide unhandled conditions</Button>}
        {!shouldShowUnhandledConditions && <Button className={classes.showErrorsButton} variant="contained" color="primary" onClick={handleShowUnhandledConditions}>Show unhandled conditions</Button>}
      </section>
    </div>
  )
};

export default React.memo(WarningStatusPopoverContent);
