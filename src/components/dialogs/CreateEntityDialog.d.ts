interface CreateEntityDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateEntity: (entity: Record<string, unknown>) => void;
}

export default function CreateEntityDialog(props: CreateEntityDialogProps): JSX.Element;
