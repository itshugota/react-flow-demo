interface AutocompleteProps<T> {
  options: ReadonlyArray<T>;
  getOptionLabel: (option: T) => string;
  getOptionKey: (option: T) => string;
  value?: string;
  onChange?: (newValue: string) => void;
  placeholder?: string;
  fixedWidth?: number;
}

export default function Autocomplete<T>(props: AutocompleteProps<T>): JSX.Element;
