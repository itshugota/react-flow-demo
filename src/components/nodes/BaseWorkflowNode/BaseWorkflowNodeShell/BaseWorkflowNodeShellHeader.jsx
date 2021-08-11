import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import ForumIcon from '@material-ui/icons/Forum';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';

const useStyles = makeStyles(theme => ({
  header: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(1.5, 2),
    background: 'rgba(65, 45, 235, 0.07)',
  },
  leadingIcon: {
    color: '#412deb',
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

const BaseWorkflowNodeHeader = () => {
  const classes = useStyles();

  return (
    <header className={classes.header}>
      <ForumIcon className={classes.leadingIcon} />
      <Typography className={classes.title} variant="h3">
        Workflow
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

export default React.memo(BaseWorkflowNodeHeader);
