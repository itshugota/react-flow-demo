interface CreateIntentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateIntent: (intent: Record<string, unknown>) => void;
}

export default function CreateIntentDialog(props: CreateIntentDialogProps): JSX.Element;
