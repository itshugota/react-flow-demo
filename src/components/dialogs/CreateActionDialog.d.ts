interface CreateActionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateAction: (action: Record<string, unknown>) => void;
}

export default function CreateActionDialog(props: CreateActionDialogProps): JSX.Element;
