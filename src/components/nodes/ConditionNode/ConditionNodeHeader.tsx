import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import FilterAltIcon from '../../icons/FilterAlt';
import { Node, useReactFlowyStore } from 'react-flowy/lib';

const useStyles = makeStyles(theme => ({
  header: {
    position: 'absolute',
    top: -64,
    left: 0,
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(1.5, 2),
    zIndex: 1,
    pointerEvents: 'none',
  },
  leadingIcon: {
    color: '#0fe8ac;',
    marginRight: theme.spacing(1)
  },
  title: {
    color: '#253134',
    fontSize: 16,
    fontWeight: 500,
    textAlign: 'left'
  },
  moreOptionsButton: {
    width: 36,
    height: 36,
    position: 'absolute',
    right: 8
  }
}));

interface ConditionNodeHeaderProps {
  node?: Node;
}

const ConditionNodeHeader: React.FC<ConditionNodeHeaderProps> = ({ node }) => {
  const classes = useStyles();

  return (
    <header className={classes.header}>
      <FilterAltIcon className={classes.leadingIcon} />
      <Typography className={classes.title} variant="h3">Condition</Typography>
    </header>
  )
};

export default React.memo(ConditionNodeHeader);
