import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import FilledInput from '../FilledInput/FilledInput';

const useStyles = makeStyles(theme => ({
  main: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(2),
  },
}));

export interface IntentNodeBodyProps {
  intent: string;
}

const IntentNodeBody: React.FC<IntentNodeBodyProps> = ({ intent }) => {
  const classes = useStyles();

  return (
    <main className={classes.main}>
      <form>
        <FilledInput placeholder="Intent" value={intent} />
      </form>
    </main>
  )
};

export default React.memo(IntentNodeBody);
