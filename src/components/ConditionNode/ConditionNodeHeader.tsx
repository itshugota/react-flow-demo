import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import FilterAltIcon from '../icons/FilterAlt';

const useStyles = makeStyles(theme => ({
  header: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(1.5, 2),
    background: 'rgba(15, 232, 172, 0.05)'
  },
  leadingIcon: {
    color: '#0fe8ac;',
    marginRight: theme.spacing(1)
  },
  title: {
    color: '#253134',
    fontSize: 16,
    fontWeight: 500,
    flexGrow: 1,
    textAlign: 'left'
  },
  moreOptionsButton: {
    width: 36,
    height: 36,
    position: 'absolute',
    right: 8
  }
}));

const ConditionNodeHeader = () => {
  const classes = useStyles();

  return (
    <header className={classes.header}>
      <FilterAltIcon className={classes.leadingIcon} />
      <Typography className={classes.title} variant="h3">Condition</Typography>
      <IconButton className={classes.moreOptionsButton} aria-label="more options">
        <MoreHorizIcon />
      </IconButton>
    </header>
  )
};

export default React.memo(ConditionNodeHeader);
