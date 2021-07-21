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
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { exportAsPNG } from '../../../utils/export';
import useIntents from '../../../hooks/useIntents';
import useActions from '../../../hooks/useActions';
import useEntities from '../../../hooks/useEntities';
import { getInEdges } from 'react-flowy/lib';

const useStyles = makeStyles(theme => ({
}));

const ScriptDialog = ({ isOpen, onClose, scripts = [] }) => {
  const classes = useStyles();
  const [parsedScripts, setParsedScripts] = useState([]);
  const [shownScriptIndex, setShownScriptIndex] = useState(-1);
  const { intents } = useIntents();
  const { actions } = useActions();
  const { entities } = useEntities();

  useEffect(() => {
    if (!scripts.length) return;

    const parsed = scripts.map(script => {
      return script.map((node, index) => {
        if (node.type === 'intentNode') {
          return {
            type: 'intent',
            value: intents.find(intent => intent.id === node.data.intent).name
          };
        }
  
        if (node.type === 'actionNode') {
          return {
            type: 'action',
            value: actions.find(action => action.id === node.data.action).name
          };
        }
  
        if (node.type === 'conditionNode') {
          const conditions = [];
  
          node.data.conditions.forEach(cond => {
            const entity = entities.find(e => e.id === cond.parameterId);
  
            conditions.push(`${entity.parameter} ${cond.operator} ${cond.value}`);
          });
  
          return {
            type: 'conditions',
            conditions,
            conditionValue: getInEdges(script[index + 1])[0].label,
          };
        }
      }).filter(Boolean);
    });

    setParsedScripts(parsed);
    console.log('parsed')
  }, [scripts]);

  const showScriptIndex = index => () => {
    setShownScriptIndex(index);
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      aria-labelledby="script-dialog-title"
      aria-describedby="script-dialog-description"
    >
      <DialogTitle id="script-dialog-title">
        Generated scripts
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="script-dialog-description">
          {shownScriptIndex === -1 ?
            <>
              There are {parsedScripts.length} scripts in total. You can click on a script link to view its details.
              <ol>
                {parsedScripts.map((parsedScript, index) => (
                  <li key={JSON.stringify(parsedScript)}><a href='#' onClick={showScriptIndex(index)}>Script #{index + 1}</a></li>
                ))}
              </ol>
            </> :
            <>
              <Button onClick={() => setShownScriptIndex(-1)}>
                <ArrowBackIcon />
                Back
              </Button>
              <h3>Following is the details for Script #{shownScriptIndex + 1}</h3>
              <ol>
                {parsedScripts[shownScriptIndex].map(something => {
                  if (something.type === 'intent') {
                    return <li key={JSON.stringify(something)}>
                      <span style={{ color: 'blue' }}>User:</span> (intent: {something.value})
                    </li>
                  }

                  if (something.type === 'action') {
                    return <li key={JSON.stringify(something)}>
                      <span style={{ color: 'red' }}>Bot:</span> (action: {something.value})
                    </li>
                  }

                  if (something.type === 'conditions') {
                    return <li key={JSON.stringify(something)}>
                      <table>
                        <thead>
                          <tr>
                            <th>Condition</th>
                            <th>Value</th>
                          </tr>
                        </thead>
                        <tbody>
                          {something.conditions.map(condition => (
                            <tr key={JSON.stringify(condition)}>
                              <td style={{ paddingRight: 24 }}>{condition}</td>
                              <td>{something.conditionValue.includes('LOOP') ? 'TRUE' : something.conditionValue}</td>
                            </tr>
                          ))}
                          
                        </tbody>
                      </table>
                    </li>
                  }
                })}
              </ol>
            </>
          }
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ScriptDialog;
