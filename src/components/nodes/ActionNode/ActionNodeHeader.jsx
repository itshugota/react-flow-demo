import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import FlashOnIcon from '@material-ui/icons/FlashOn';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import { useReactFlowyStoreById } from 'react-flowy/lib';

const useStyles = makeStyles(theme => ({
  header: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(1.5, 2),
    background: 'rgba(255, 203, 17, 0.1)',
  },
  leadingIcon: {
    color: '#ffcb11',
    marginRight: theme.spacing(1),
  },
  title: {
    color: '#253134',
    fontSize: 16,
    fontWeight: 500,
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

const ActionNodeHeader = ({ node, storeId }) => {
  const classes = useStyles();
  const useReactFlowyStore = useReactFlowyStoreById(storeId);
  const deleteElementById = useReactFlowyStore(state => state.deleteElementById);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleOpenMenu = event => {
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
      <FlashOnIcon className={classes.leadingIcon} />
      <Typography className={classes.title} variant="h3">Action</Typography>
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

export default React.memo(ActionNodeHeader);
