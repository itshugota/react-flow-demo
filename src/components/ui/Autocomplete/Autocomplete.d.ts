import React from 'react';

interface PopoverContentComponentProps {
  id: string;
}

interface AutocompleteProps<T> {
  options: ReadonlyArray<T>;
  getOptionLabel: (option: T) => string;
  getOptionKey: (option: T) => string;
  value?: string;
  onChange?: (newValue: string) => void;
  placeholder?: string;
  fixedWidth?: number;
  onSelectChildren?: () => void;
  shouldShowFullOptions?: boolean;
  children?: React.ReactNode;
  PopoverContentComponent: React.FC<PopoverContentComponentProps>;
}

export default function Autocomplete<T>(props: AutocompleteProps<T>): JSX.Element;
