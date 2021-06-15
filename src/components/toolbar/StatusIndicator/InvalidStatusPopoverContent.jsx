import React from 'react';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';

import InvalidIndicator from '../../icons/InvalidIndicator';
import { useStatusStore } from '../../../store/status.store';

const useStyles = makeStyles(theme => ({
  container: {
    width: 280
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    background: 'rgba(250, 16, 62, 0.05)',
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

const InvalidStatusPopoverContent = () => {
  const classes = useStyles();
  const shouldShowInvalidNodes = useStatusStore(state => state.shouldShowInvalidNodes);
  const setShouldShowInvalidNodes = useStatusStore(state => state.setShouldShowInvalidNodes);

  const handleShowInvalidNodes = () => {
    setShouldShowInvalidNodes(true);
  };

  const handleHideInvalidNodes = () => {
    setShouldShowInvalidNodes(false);
  };

  return (
    <div className={classes.container}>
      <header className={classes.header}>
        <InvalidIndicator />
        <Typography className={classes.title} variant="h6">The workflow is invalid</Typography>
      </header>
      <section className={classes.body}>
        <Typography className={classes.bodyTitle} variant="body1"><strong>The workflow has not been saved</strong></Typography>
        <Typography className={classes.bodyDescription} variant="body1">Changes made to an invalid workflow will not be automatically saved. You can either fix the error(s) or force save the workflow.</Typography>
        {shouldShowInvalidNodes && <Button className={classes.showErrorsButton} variant="contained" color="primary" onClick={handleHideInvalidNodes}>Hide errors</Button>}
        {!shouldShowInvalidNodes && <Button className={classes.showErrorsButton} variant="contained" color="primary" onClick={handleShowInvalidNodes}>Show errors</Button>}
        <Button className={classes.forceSaveButton} color="primary">Force save</Button>
      </section>
    </div>
  )
};

export default React.memo(InvalidStatusPopoverContent);
