import React, { useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import ConditionRow from './ConditionRow';
import { Node } from 'react-flowy/lib';
import { Condition } from './Condition.interface';

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
}));

interface ConditionTableProps {
  node: Node;
}

const ConditionTable: React.FC<ConditionTableProps> = React.memo(({ node }) => {
  const classes = useStyles();
  const conditions: Condition[] = node.data && Array.isArray(node.data.conditions) ? node.data.conditions as Condition[] : [];

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

export interface ConditionNodeBodyProps extends ConditionTableProps {}

const ConditionNodeBody: React.FC<ConditionNodeBodyProps> = ({ node }) => {
  const classes = useStyles();

  return (
    <main className={classes.main}>
      <ConditionTable node={node} />
    </main>
  )
};

export default React.memo(ConditionNodeBody);
