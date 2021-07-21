interface Intent {
  id: string;
  name: string;
}

interface UseIntentsObject {
  intents: Intent[];
  saveIntents: (intents: Intent[]) => void;
}

export default function useIntents(): UseIntentsObject;