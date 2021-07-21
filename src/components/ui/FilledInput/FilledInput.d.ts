interface FilledInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  width?: number | string;
}

export default function FilledInput(props: FilledInputProps): JSX.Element;