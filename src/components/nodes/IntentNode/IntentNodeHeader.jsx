import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import InputIcon from '@material-ui/icons/Input';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import { useReactFlowyStoreById } from 'react-flowy/lib';

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

const IntentNodeHeader = ({ node, storeId }) => {
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
      <InputIcon className={classes.leadingIcon} />
      <Typography className={classes.title} variant="h3">Intent</Typography>
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

export default React.memo(IntentNodeHeader);
