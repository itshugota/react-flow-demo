import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';

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
    }
  },
  lastRow: {
    '& > .MuiTableCell-root': {
      border: 'none'
    }
  },
  actionCell: {
    position: 'relative',

    '& .MuiIconButton-root': {
      width: 32,
      height: 32,

      '& .MuiSvgIcon-root': {
        width: 20,
        height: 20
      }
    }
  },
  tableActions: {
    marginTop: theme.spacing(2),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    width: '100%'
  },
  addParameterButton: {
    '& .MuiSvgIcon-root': {
      marginRight: theme.spacing(0.75)
    }
  }
}));

export interface ConditionTableProps {
  conditions: Condition[]
}

const ConditionTable: React.FC<ConditionTableProps> = React.memo(({ conditions }) => {
  const classes = useStyles();

  return (
    <TableContainer>
      <Table className={classes.table} aria-label="simple table" size="small">
        <TableHead>
          <TableRow>
            <TableCell>#</TableCell>
            <TableCell>Parameter</TableCell>
            <TableCell align="center">Operator</TableCell>
            <TableCell>Value</TableCell>
            <TableCell>&nbsp;</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {conditions.map((condition, index) => (
            <TableRow key={condition.parameter} className={index === conditions.length - 1 ? classes.lastRow : ''}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{condition.parameter}</TableCell>
              <TableCell align="center">{condition.operator}</TableCell>
              <TableCell>{condition.value}</TableCell>
              <TableCell className={classes.actionCell}>
                <IconButton aria-label="edit">
                  <EditIcon />
                </IconButton>
                <IconButton aria-label="delete">
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
});

export interface ConditionNodeBodyProps extends ConditionTableProps {}

const ConditionNodeBody: React.FC<ConditionTableProps> = ({ conditions }) => {
  const classes = useStyles();

  return (
    <main className={classes.main}>
      <ConditionTable conditions={conditions} />
      <div className={classes.tableActions}>
      <Button className={classes.addParameterButton} aria-label="add parameter">
        <AddIcon />
        Add parameter
      </Button>
      </div>
    </main>
  )
};

export default React.memo(ConditionNodeBody);
