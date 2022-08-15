import React, { useState } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import PhotoIcon from '@material-ui/icons/Photo';
import ExportDialog from './ExportDialog';

const useStyles = makeStyles(theme => ({
  iconButton: {
    width: 32,
    height: 32,
  },
  mR: {
    marginRight: theme.spacing(2),
  },
}));

const ExportAsPNG = () => {
  const classes = useStyles();
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);

  const handleExportAsPNG = () => {
    setIsExportDialogOpen(true);
  };

  const handleCloseExportDialog = () => {
    setIsExportDialogOpen(false);
  };

  return (
    <>
      <IconButton className={clsx(classes.iconButton, classes.mR)} onClick={handleExportAsPNG}>
        <PhotoIcon />
      </IconButton>
      <ExportDialog isOpen={isExportDialogOpen} onClose={handleCloseExportDialog} />
    </>
  );
};

export default React.memo(ExportAsPNG);
