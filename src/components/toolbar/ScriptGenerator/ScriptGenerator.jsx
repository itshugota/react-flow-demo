import React, { useState } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import SmsIcon from '@material-ui/icons/Sms';
import { generateScripts } from '../../../state/script';
import ScriptDialog from './ScriptDialog';

const useStyles = makeStyles(theme => ({
  iconButton: {
    width: 32,
    height: 32,
  },
  mR: {
    marginRight: theme.spacing(2),
  },
}));

const ScriptGenerator = () => {
  const classes = useStyles();
  const [scripts, setScripts] = useState([]);
  const [shouldShowScriptDialog, setShouldShowScriptDialog] = useState(false);

  const handleGenerateScripts = () => {
    const generatedScripts = generateScripts();

    setScripts(generatedScripts);
    setShouldShowScriptDialog(true);
  };

  const handleCloseScriptDialog = () => {
    setShouldShowScriptDialog(false);
  };

  return (
    <>
      <Tooltip title="Generate scripts">
        <IconButton className={clsx(classes.iconButton, classes.mR)} onClick={handleGenerateScripts}>
          <SmsIcon />
        </IconButton>
      </Tooltip>
      <ScriptDialog onClose={handleCloseScriptDialog} isOpen={shouldShowScriptDialog} scripts={scripts} />
    </>
  );
};

export default React.memo(ScriptGenerator);
