import React, { useMemo, useState, useLayoutEffect } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import ConditionRow from './ConditionRow';
import { isNodeInLoop } from '../../../utils/nodes';
import FilledInput from '../../ui/FilledInput/FilledInput';
import Autocomplete from '../../ui/Autocomplete/Autocomplete';
import { useReactFlowyStore } from 'react-flowy/lib';

const useStyles = makeStyles(theme => ({
  main: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(2),
    flexDirection: 'column'
  },
  table: {
    borderCollapse: 'inherit',
    border: '1px solid #e9e9ef',
    borderRadius: 4,
    '& > .MuiTableCell-root': {
      color: '#253134'
    },
    '& .MuiTableCell-root': {
      padding: theme.spacing(0.75, 1.5, 0.75, 1),
    }
  },
  header: {
    marginBottom: theme.spacing(1),
    display: 'flex',
    alignItems: 'center',
    width: '100%',
  },
  centerInput: {
    '& input': {
      textAlign: 'center',
    },
  },
  spaceBetween: {
    justifyContent: 'space-between',
  },
  flexEnd: {
    justifyContent: 'flex-end',
  },
  headerText: {
    marginRight: theme.spacing(0.5),
    fontWeight: 500,
  },
  headerItemContainer: {
    display: 'flex',
    alignItems: 'center',
  }
}));

const ConditionTable = React.memo(({ node }) => {
  const classes = useStyles();
  const conditions = node.data && Array.isArray(node.data.conditions) ? node.data.conditions : [];

  return (
    <TableContainer>
      <Table className={classes.table} aria-label="condition table">
        <TableHead>
          <TableRow>
            <TableCell style={{ textAlign: 'center' }}>#</TableCell>
            <TableCell>Parameter</TableCell>
            <TableCell align="center">Operator</TableCell>
            <TableCell>Value</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {conditions.length > 0 ?
            conditions.map((condition, index) => (
              <ConditionRow key={condition.parameter} node={node} condition={condition} index={index} isLastRow={index === conditions.length - 1} />
            )) :
            <TableRow>
              <TableCell colSpan={4} style={{ textAlign: 'center', width: 484 }}>There is no condition</TableCell>
            </TableRow>
          }
        </TableBody>
      </Table>
    </TableContainer>
  );
});

const conditionModes = ['AND', 'OR'];

const ConditionNodeBody = ({ node }) => {
  const classes = useStyles();
  const isInLoop = useMemo(() => isNodeInLoop(node), [node]);
  const upsertNode = useReactFlowyStore(state => state.upsertNode);

  const handleLoopCountChange = event => {
    if (isNaN(event.target.value)) return;

    if (Number(event.target.value) < 0) return;

    let loopCount;

    if (event.target.value === '0') loopCount = 1;

    if (Number(event.target.value) > 10) loopCount = 10;

    if (!loopCount) {
      loopCount = Number(event.target.value);
    }

    const newNode = { ...node, data: { ...node.data, loopCount } };

    upsertNode(newNode);
  };

  const handleConditionModeChange = newConditionMode => {
    const newNode = { ...node, data: { ...node.data, conditionMode: newConditionMode } };

    upsertNode(newNode);
  };

  useLayoutEffect(() => {
    if (!isInLoop) return;

    if (node.data.loopCount) return;

    const newNode = { ...node, data: { ...node.data, loopCount: 1 } };

    upsertNode(newNode);
  }, [isInLoop]);

  return (
    <main className={classes.main}>
      {(isInLoop || node.data.conditions.length > 1) &&
        <header className={clsx(classes.header, isInLoop ? classes.spaceBetween : classes.flexEnd)}>
          {isInLoop &&
            <div className={clsx(classes.headerItemContainer, classes.centerInput)}>
              <Typography variant="body1" className={classes.headerText}>Loop count:</Typography>
              <FilledInput value={node.data.loopCount} onChange={handleLoopCountChange} width={48} />
            </div>
          }
          {node.data.conditions.length > 1 &&
            <div className={classes.headerItemContainer}>
              <Typography variant="body1" className={classes.headerText}>Condition mode:</Typography>
              <Autocomplete
                options={conditionModes}
                getOptionKey={option => option}
                getOptionLabel={option => option}
                value={node.data.conditionMode}
                onChange={handleConditionModeChange}
                shouldShowFullOptions
                fixedWidth={76}
              />
            </div>
          }
        </header>
      }
      <ConditionTable node={node} />
    </main>
  )
};

export default React.memo(ConditionNodeBody);
