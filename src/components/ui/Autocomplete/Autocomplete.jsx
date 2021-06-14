import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
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
    maxHeight: 244,
    overflowY: 'auto',
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
    onSelectChildren,
    shouldShowFullOptions = false,
    children,
  }) => {
    const classes = useStyles({ fixedWidth });
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const [inputValue, setInputValue] = useState('');
    const [shouldShowDropdown, setShouldShowDropdown] = useState(false);
    const dropdownRef = useRef();

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

    const handleSelectItem = useCallback(option => () => {
      if (typeof onChange === 'function') onChange(getOptionKey(option));
    }, [onChange, getOptionKey]);

    const handleMouseDown = event => {
      event.stopPropagation();
    };

    const handleMouseMove = event => {
      event.stopPropagation();
    };

    const filteredOptions = useMemo(() => {
      if (shouldShowFullOptions) return options;

      return options.filter(option => {
        const optionLabel = getOptionLabel(option);

        return optionLabel.includes(inputValue);
      });
    }, [options, inputValue, shouldShowFullOptions]);

    useEffect(() => {
      const selectedIndex = filteredOptions.findIndex(filteredOption => getOptionKey(filteredOption) === value);

      if (selectedIndex > -1) setSelectedIndex(selectedIndex);
    }, [filteredOptions, value]);

    const selectableLength = children ? filteredOptions.length + 1 : filteredOptions.length;

    const dropdownItems = useMemo(() =>
      filteredOptions.map(option => {
        const key = getOptionKey(option);
        const optionLabel = getOptionLabel(option);
        const selectedOption = filteredOptions[selectedIndex] || {};
        const selectedKey = getOptionKey(selectedOption);

        return <div key={key} className={clsx(classes.dropdownItem, selectedKey === key ? classes.dropdownItemSelected : '')} onMouseDown={handleSelectItem(option)}>{optionLabel}</div>
      }),
      [filteredOptions, getOptionKey, inputValue, getOptionLabel, selectedIndex]
    );

    const closeDropdown = () => {
      setShouldShowDropdown(false);
      setSelectedIndex(-1);

      if (children && selectedIndex === selectableLength - 1) {
        typeof onSelectChildren === 'function' && onSelectChildren();
      }

      const selectedOption = filteredOptions[selectedIndex] || {};
      const selectedKey = getOptionKey(selectedOption);

      const finalOption = options.find(option => getOptionKey(option) === value || getOptionKey(option) === selectedKey);

      if (finalOption) {
        setInputValue(getOptionLabel(finalOption));

        if (getOptionKey(finalOption) !== value) {
          typeof onChange === 'function' && onChange(getOptionKey(finalOption));
        }
      } else {
        setInputValue('');
      }
    };

    const handleInputKeyDown = event => {
      if (!shouldShowDropdown) return;

      if (event.key === 'ArrowDown') {
        event.preventDefault();

        return setSelectedIndex(sI => {
          if (sI + 1 === selectableLength) return selectableLength - 1;

          return sI + 1;
        });
      }

      if (event.key === 'ArrowUp') {
        event.preventDefault();

        return setSelectedIndex(sI => {
          if (sI === 0) return 0;

          return sI - 1;
        });
      }

      if (event.key === 'Enter') {
        event.preventDefault();

        event.target.blur();
      }
    };

    const handleWheelDropdown = event => {
      event.stopPropagation();
    };

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
          <div ref={dropdownRef} className={classes.dropdown} onWheelCapture={handleWheelDropdown}>
            {dropdownItems.length > 0 ? dropdownItems : (
              <div className={classes.noMatchingOption}>No matching option found</div>
            )}
            {!!children && <div className={selectedIndex === selectableLength - 1 ? classes.dropdownItemSelected : '' }>
              {children}
            </div>}
          </div>
        }
      </div>
    )
  };

export default Autocomplete;
