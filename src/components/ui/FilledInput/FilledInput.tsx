import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

export interface FilledInputProps {
  placeholder?: string;
  value: string;
}

const useStyles = makeStyles(theme => ({
  input: {
    border: 'none',
    background: '#f1f3f4',
    borderRadius: '4px 4px 0 0',
    padding: theme.spacing(1.5, 1.5, 1.5, 2),
    outline: 'none',
    fontSize: 14,
    width: 188,
  },
}));

const FilledInput: React.FC<FilledInputProps> = ({ placeholder = '', value }) => {
  const classes = useStyles();

  return (
    <input className={classes.input} placeholder={placeholder} value={value} readOnly />
  );
};

export default FilledInput;
