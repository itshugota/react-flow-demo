import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';

import premadeEntities from '../../../data/entities.json';
import operators from '../../../data/operators.json';
import Autocomplete from '../../ui/Autocomplete/Autocomplete';
import { useReactFlowyStore } from 'react-flowy/lib';
import CreateEntityDialog from '../../dialogs/CreateEntityDialog';

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
  createNewEntity: {
    cursor: 'pointer',
    fontSize: 14,
    padding: theme.spacing(1, 2, 1, 1.5),
    textAlign: 'left',
    display: 'flex',
    alignItems: 'center',
    '&:hover': {
      background: theme.palette.grey[100],
    }
  },
  addIcon: {
    marginRight: theme.spacing(0.5),
    width: 20,
    height: 20,
  },
}));

const useEntities = () => {
  const [entities, setEntities] = useState([]);

  useEffect(() => {
    const stringifiedStoredEntities = localStorage.getItem('entities');

    if (stringifiedStoredEntities) {
      return setEntities(JSON.parse(stringifiedStoredEntities));
    }

    setEntities(premadeEntities);
  }, []);

  const saveEntities = (entities) => {
    localStorage.setItem('entities', JSON.stringify(entities));

    setEntities(entities);
  };

  return { entities, saveEntities };
};

const ConditionRow = React.memo(({ node, condition, index, isLastRow }) => {
  const classes = useStyles();
  const { entities, saveEntities } = useEntities();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const upsertNode = useReactFlowyStore(state => state.upsertNode);
  const correspondingEntity = entities.find(entity => entity.id === condition.parameterId);
  const parameterValues = correspondingEntity ? correspondingEntity.values : [];

  const updateCondition = (key, value) => {
    const newConditions = node.data.conditions.map(c => {
      if (c.parameterId !== condition.parameterId) return c;

      return { ...c, [key]: value };
    });

    const updatedNode = { ...node, data: { ...node.data, conditions: newConditions }};

    upsertNode(updatedNode);
  }

  const handleParameterChange = newParameterId => {
    if (condition.parameterId === newParameterId) return;

    updateCondition('parameterId', newParameterId);
  };

  const handleOperatorChange = newOperator => {
    if (condition.operator === newOperator) return;

    updateCondition('operator', newOperator);
  };

  const handleParameterValueChange = newParameterValue => {
    if (condition.value === newParameterValue) return;

    updateCondition('value', newParameterValue);
  };

  const handleDeleteCondition = () => {
    const newConditions = node.data.conditions.filter(c => c.parameterId !== condition.parameterId);
    const updatedNode = { ...node, data: { ...node.data, conditions: newConditions }};

    upsertNode(updatedNode);
  };

  const handleCloseCreateDialog = () => {
    setIsCreateDialogOpen(false);
  };

  const openCreateDialog = () => {
    setIsCreateDialogOpen(true);
  };

  const handleCreateEntity = entity => {
    saveEntities([...entities, entity]);

    const updatedNode = {
      ...node,
      data:
        {
          ...node.data,
          conditions: 
            [...node.data.conditions,
              {
                parameterId: entity.id,
                parameter: entity.parameter,
                operator: '=',
                value: entity.values[0],
              }
            ] 
        }
    };

    upsertNode(updatedNode);
  };

  return (
    <>
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
          >
            <div className={classes.createNewEntity} onMouseDown={openCreateDialog}>
              <AddIcon className={classes.addIcon} />
              Create entity
            </div>
          </Autocomplete>
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
      <CreateEntityDialog isOpen={isCreateDialogOpen} onClose={handleCloseCreateDialog} onCreateEntity={handleCreateEntity} />
    </>
  );
});

export default React.memo(ConditionRow);
