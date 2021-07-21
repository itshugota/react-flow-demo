interface Action {
  id: string;
  name: string;
}

interface UseActionsObject {
  actions: Action[];
  saveActions: (actions: Action[]) => void;
}

export default function useActions(): UseActionsObject;