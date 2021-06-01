import React, { useState } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';

import entities from '../../../data/entities.json';
import operators from '../../../data/operators.json';
import { Condition } from './Condition.interface';
import Autocomplete from '../../ui/Autocomplete/Autocomplete';
import { Node, useReactFlowyStore } from 'react-flowy/lib';

const useStyles = makeStyles(theme => ({
  tableRow: {
    position: 'relative',
  },
  lastRow: {
    '& > .MuiTableCell-root': {
      border: 'none'
    }
  },
  orderOrActionCell: {
    padding: '6px 8px 6px 8px !important',
    borderRadius: 4,
    
    '&:hover': {
      '& > span': {
        display: 'none',
      },
      '& .MuiButtonBase-root': {
        display: 'flex',
      },
    },

    '& > span': {
      width: 32,
      height: 32,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },

    '& .MuiButtonBase-root': {
      display: 'none',
    },

    '& .MuiIconButton-root': {
      width: 32,
      height: 32,

      '& .MuiSvgIcon-root': {
        width: 20,
        height: 20
      }
    }
  },
  actionCellHidden: {
    visibility: 'hidden',
    pointerEvents: 'none',
  },
}));

export interface ConditionRowProps {
  node: Node;
  condition: Condition;
  index: number;
  isLastRow: boolean;
}

const ConditionRow: React.FC<ConditionRowProps> = React.memo(({ node, condition, index, isLastRow }) => {
  const classes = useStyles();
  const upsertNode = useReactFlowyStore(state => state.upsertNode);
  const correspondingEntity = entities.find(entity => entity.id === condition.parameterId);
  const parameterValues = correspondingEntity ? correspondingEntity.values : [];

  const updateCondition = (key: 'parameterId' | 'operator' | 'value', value: string) => {
    const newConditions = (node.data.conditions as Condition[]).map(c => {
      if (c.parameterId !== condition.parameterId) return c;

      return { ...c, [key]: value };
    });

    const updatedNode = { ...node, data: { ...node.data, conditions: newConditions }};

    upsertNode(updatedNode);
  }

  const handleParameterChange = (newParameterId: string) => {
    if (condition.parameterId === newParameterId) return;

    updateCondition('parameterId', newParameterId);
  };

  const handleOperatorChange = (newOperator: string) => {
    if (condition.operator === newOperator) return;

    updateCondition('operator', newOperator);
  };

  const handleParameterValueChange = (newParameterValue: string) => {
    if (condition.value === newParameterValue) return;

    updateCondition('value', newParameterValue);
  };

  const handleDeleteCondition = () => {
    const newConditions = (node.data.conditions as Condition[]).filter(c => c.parameterId !== condition.parameterId);
    const updatedNode = { ...node, data: { ...node.data, conditions: newConditions }};

    upsertNode(updatedNode);
  }

  return (
    <TableRow
      key={condition.parameter}
      className={clsx(classes.tableRow, isLastRow ? classes.lastRow : '')}
    >
      <TableCell className={classes.orderOrActionCell}>
        <span>{index + 1}</span>
        <IconButton onClick={handleDeleteCondition}>
          <DeleteIcon />
        </IconButton>
      </TableCell>
      <TableCell>
        <Autocomplete
          options={entities}
          getOptionKey={option => option.id}
          getOptionLabel={option => option.parameter}
          value={condition.parameterId}
          onChange={handleParameterChange}
          placeholder="Parameter"
          fixedWidth={168}
        />
      </TableCell>
      <TableCell align="center">
        <Autocomplete
          options={operators}
          getOptionKey={option => option}
          getOptionLabel={option => option}
          value={condition.operator}
          onChange={handleOperatorChange}
          fixedWidth={64}
        />
      </TableCell>
      <TableCell>
        <Autocomplete
          options={parameterValues}
          getOptionKey={option => option}
          getOptionLabel={option => option}
          value={condition.value}
          onChange={handleParameterValueChange}
          fixedWidth={144}
        />
      </TableCell>
    </TableRow>
  );
});

export default React.memo(ConditionRow);
