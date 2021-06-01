import React, { useState, useMemo, useCallback, useEffect } from 'react';
import clsx from 'clsx';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  container: {
    position: 'relative',
  },
  input: {
    border: 'none',
    background: '#f1f3f4',
    borderRadius: '4px 4px 0 0',
    padding: theme.spacing(1.5, 4, 1.5, 2),
    outline: 'none',
    fontSize: 14,
    width: ({ fixedWidth }) => fixedWidth,
  },
  dropdown: {
    position: 'fixed',
    width: ({ fixedWidth }) => fixedWidth,
    background: theme.palette.common.white,
    boxShadow: theme.shadows[4],
    padding: theme.spacing(1, 0),
    zIndex: 1,
  },
  hidden: {
    opacity: 0,
    pointerEvents: 'none',
    userSelect: 'none',
    '-webkit-tap-highlight-color': 'transparent',
  },
  dropdownItem: {
    padding: theme.spacing(1, 2),
    cursor: 'pointer',
    textAlign: 'left',
    fontSize: 14,
    '&:hover': {
      background: theme.palette.grey[100],
    },
    wordBreak: 'break-all',
  },
  dropdownItemSelected: {
    background: theme.palette.grey[100],
  },
  noMatchingOption: {
    fontSize: 14,
    padding: theme.spacing(1, 2),
    textAlign: 'left',
  },
  dropdownIcon: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.action.active,
    pointerEvents: 'none',
  }
}));

const Autocomplete =
  ({
    options,
    getOptionKey,
    getOptionLabel,
    value,
    onChange,
    placeholder = '',
    fixedWidth = 244,
  }) => {
    const classes = useStyles({ fixedWidth });
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const [inputValue, setInputValue] = useState('');
    const [shouldShowDropdown, setShouldShowDropdown] = useState(false);

    useEffect(() => {
      if (value === '') return setInputValue('');

      const selectedOption = options.find(option => String(getOptionKey(option)) === String(value));

      if (!selectedOption) return;

      setInputValue(getOptionLabel(selectedOption));
    }, [options, value, getOptionKey, getOptionLabel]);

    const handleInputChange = event => {
      setInputValue(event.target.value);

      if (event.target.value === '') {
        if (typeof onChange === 'function') onChange('');
      }
    };

    const handleInputFocus = () => {
      setShouldShowDropdown(true);
    };

    const handleInputBlur = () => {
      closeDropdown();
    };

    const closeDropdown = () => {
      setShouldShowDropdown(false);

      const selectedOption = options.find(option => String(getOptionKey(option)) === value);

      if (selectedOption) {
        setInputValue(getOptionLabel(selectedOption));
      } else {
        setInputValue('');
      }
    };

    const handleSelectItem = useCallback(option => () => {
      if (typeof onChange === 'function') onChange(getOptionKey(option));
    }, [onChange, getOptionKey]);

    const handleMouseDown = event => {
      event.stopPropagation();
    };

    const handleMouseMove = event => {
      event.stopPropagation();
    };

    useEffect(() => {
      const selectedOption = options[selectedIndex];

      if (!selectedOption) return;

      if (typeof onChange === 'function') onChange(getOptionKey(selectedOption));
    }, [options, selectedIndex]);

    const handleInputKeyDown = event => {
      if (!shouldShowDropdown) return;

      event.preventDefault();

      if (event.key === 'ArrowDown') {
        return setSelectedIndex(sI => {
          if (sI + 1 === options.length) return options.length - 1;

          return sI + 1;
        });
      }

      if (event.key === 'ArrowUp') {
        return setSelectedIndex(sI => {
          if (sI === 0) return 0;

          return sI - 1;
        });
      }

      if (event.key === 'Enter') {
        event.target.blur();
      }
    };

    const dropdownItems = useMemo(() =>
      options.map(option => {
        const key = getOptionKey(option);

        return <div key={key} className={clsx(classes.dropdownItem, String(value) === String(key) ? classes.dropdownItemSelected : '')} onMouseDown={handleSelectItem(option)}>{getOptionLabel(option)}</div>
      }).filter(Boolean),
      [options, getOptionKey, inputValue, getOptionLabel]
    );

    return (
      <div className={classes.container} onMouseDown={handleMouseDown} onMouseMove={handleMouseMove}>
        <input
          className={classes.input}
          placeholder={placeholder}
          value={inputValue}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          onKeyDown={handleInputKeyDown}
        />
        <ArrowDropDownIcon className={classes.dropdownIcon} />
        {shouldShowDropdown &&
          <div className={classes.dropdown}>
            {dropdownItems.length > 0 ? dropdownItems : (
              <div className={classes.noMatchingOption}>No matching option found</div>
            )}
          </div>
        }
      </div>
    )
  };

export default Autocomplete;
