import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import InputIcon from '@material-ui/icons/Input';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';

const useStyles = makeStyles(theme => ({
  header: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(1.5, 2),
    background: 'rgba(33, 124, 232, 0.07)',
  },
  leadingIcon: {
    color: '#217ce8',
    marginRight: theme.spacing(1),
  },
  title: {
    color: '#253134',
    fontSize: 16,
    fontWeight: 600,
    flexGrow: 1,
    textAlign: 'left',
  },
  moreOptionsButton: {
    width: 36,
    height: 36,
    position: 'absolute',
    right: 8,
  },
}));

const IntentNodeShellHeader = () => {
  const classes = useStyles();

  return (
    <header className={classes.header}>
      <InputIcon className={classes.leadingIcon} />
      <Typography className={classes.title} variant="h3">
        Intent
      </Typography>
      <IconButton
        className={classes.moreOptionsButton}
        aria-label="more options"
      >
        <MoreHorizIcon />
      </IconButton>
    </header>
  );
};

export default React.memo(IntentNodeShellHeader);
