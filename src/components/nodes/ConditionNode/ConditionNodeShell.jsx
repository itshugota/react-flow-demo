import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import ConditionNodeHeader from './ConditionNodeHeader';
import ConditionNodeBody from './ConditionNodeBody';

const useStyles = makeStyles(theme => ({
  container: {
    boxShadow: '0px 2px 4px 1px rgb(0 0 0 / 20%)',
  },
}));

const ConditionNodeShell = () => {
  const classes = useStyles();

  const shellNode = {
    id: '?',
    position: { x: 0, y: 0 },
    data: {
      conditions: [],
    },
    shapeType: 'hexagon',
    type: 'conditionNode',
  };

  return (
    <Paper className={classes.container} elevation={0}>
      <svg style={{ position: 'absolute', top: -69, left: 0 }} width="518" height="70" viewBox="0 0 518 70" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M259 0L518 70H0 0Z" fill="#ffffff" fillOpacity="1"/>
        <path d="M259 0L518 70H0 0Z" fill="#0fe8ac" fillOpacity="0.05"/>
      </svg>
      <svg style={{ position: 'absolute', bottom: -69, left: 0, filter: 'drop-shadow(rgba(0, 0, 0, 0.2) 0px 4px 2px)' }} width="518" height="70" viewBox="0 0 518 70" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M259 70L0 0L518 0L259 70Z" fill="#ffffff" fillOpacity="1"/>
      </svg>
      <ConditionNodeHeader node={shellNode} />
      <ConditionNodeBody node={shellNode} />
    </Paper>
  );
};

export default React.memo(ConditionNodeShell);
