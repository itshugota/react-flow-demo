import React, { useState, useRef, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import { exportAsPNG } from '../../../utils/export';

const useStyles = makeStyles(theme => ({
  backdrop: {
    background: '#000012',
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: -1,
  },
  inputContainer: {
    display: 'flex',
    alignItems: 'center',
    '& .MuiTypography-body1': {
      marginRight: theme.spacing(1),
    },
    '& .MuiTextField-root': {
      width: 64,
    },
  },
  qualityContainer: {
    marginTop: theme.spacing(1),
    '& .MuiTypography-body2': {
      color: theme.palette.grey[700],
    },
  },
  mL: {
    marginLeft: theme.spacing(2),
  },
}));

const ExportDialog = ({ isOpen, onClose, onExport }) => {
  const classes = useStyles();
  const [margin, setMargin] = useState('16');
  const [qualityLevel, setQualityLevel] = useState('1');
  const [exportDataURL, setExportDataURL] = useState('');
  const downloadAnchorRef = useRef();

  const handleSubmitForm = async event => {
    event.preventDefault();

    const dataURL = await exportAsPNG({ margin, qualityLevel });

    setExportDataURL(dataURL);
  };

  useEffect(() => {
    if (!exportDataURL) return;

    setExportDataURL('');

    downloadAnchorRef.current.click();
  }, [exportDataURL]);

  const validatePositiveIntegerInput = inputValue => {
    if (isNaN(inputValue)) return false;

    if (Number(inputValue) < 0) return false;

    return true;
  }

  const handleChangeMargin = event => {
    if (!validatePositiveIntegerInput(event.target.value)) return;

    setMargin(event.target.value);
  };

  const handleChangeQualityLevel = event => {
    if (!validatePositiveIntegerInput(event.target.value)) return;

    if (event.target.value === '0') return setQualityLevel(1);

    if (Number(event.target.value) > 10) return setQualityLevel(10);

    setQualityLevel(event.target.value);
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      aria-labelledby="export-dialog-title"
      aria-describedby="export-dialog-description"
    >
      <div className={classes.backdrop} />
      <form onSubmit={handleSubmitForm}>
        <DialogTitle id="export-dialog-title">
          Export as PNG
          <a ref={downloadAnchorRef} style={{ visibility: 'hidden' }} download="Workflow.png" href={exportDataURL}>.</a>
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="export-dialog-description">
            You can export the current workflow as a PNG image.
          </DialogContentText>
          <div className={classes.inputContainer}>
            <Typography variant="body1">Margin (px):</Typography>
            <TextField variant="outlined" size="small" onChange={handleChangeMargin} value={margin} />
            <Typography variant="body1" className={classes.mL}>Quality level:</Typography>
            <TextField variant="outlined" size="small" onChange={handleChangeQualityLevel} value={qualityLevel} />
          </div>
          <div className={classes.qualityContainer}>
            <Typography variant="body2">Quality level can range from 1 - 10, with 10 being the highest quality level.</Typography>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary">
            Cancel
          </Button>
          <Button type="submit" color="primary" variant="contained">
            Export
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ExportDialog;
