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

interface ConditionNodeHeaderProps {
  node?: Node;
}

const ConditionNodeHeader: React.FC<ConditionNodeHeaderProps> = ({ node }) => {
  const classes = useStyles();
  const deleteElementById = useReactFlowyStore(state => state.deleteElementById);
  const [anchorEl, setAnchorEl] = useState<Element | null>(null);

  const handleOpenMenu = (event: React.MouseEvent) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleDelete = () => {
    handleCloseMenu();

    if (node) deleteElementById(node.id);
  };

  return (
    <header className={classes.header}>
      <FilterAltIcon className={classes.leadingIcon} />
      <Typography className={classes.title} variant="h3">Condition</Typography>
      <IconButton className={classes.moreOptionsButton} aria-label="more options" onClick={handleOpenMenu}>
        <MoreHorizIcon />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
      >
        <MenuItem onClick={handleDelete}>
          Delete
        </MenuItem>
      </Menu>
    </header>
  )
};

export default React.memo(ConditionNodeHeader);
