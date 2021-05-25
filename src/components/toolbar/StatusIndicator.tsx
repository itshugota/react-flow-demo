import React, { useState } from 'react';
import IconButton from '@material-ui/core/IconButton';
import Popover from '@material-ui/core/Popover';
import { makeStyles } from '@material-ui/core/styles';

import { useStatusStore, WorkflowStatus } from '../../store/status.store';
import ValidIndicator from '../icons/ValidIndicator';
import InvalidIndicator from '../icons/InvalidIndicator';

const useStyles = makeStyles(theme => ({
  statusIndicatorButton: {
    width: 32,
    height: 32,
    '& .MuiIconButton-label': {
      display: 'grid',
    }
  },
}));

const StatusIndicator = () => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState<Element | null>(null);
  const status = useStatusStore(state => state.status);

  const handleOpenPopover = (event: React.MouseEvent) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton className={classes.statusIndicatorButton} onClick={handleOpenPopover}>
        {status === WorkflowStatus.VALID && <ValidIndicator />}
        {status === WorkflowStatus.INVALID && <InvalidIndicator />}
      </IconButton>
      <Popover
        open={!!anchorEl}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      />
    </>
  );
};

export default React.memo(StatusIndicator);