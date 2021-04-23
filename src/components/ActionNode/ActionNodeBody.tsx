import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import FilledInput from '../FilledInput/FilledInput';

const useStyles = makeStyles(theme => ({
  main: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(2)
  }
}));

export interface ActionNodeBodyProps {
  action: string;
}

const ActionNodeBody: React.FC<ActionNodeBodyProps> = ({ action }) => {
  const classes = useStyles();

  return (
    <main className={classes.main}>
      <form>
        <FilledInput placeholder="Action" value={action} />
      </form>
    </main>
  )
};

export default React.memo(ActionNodeBody);
