import { getInEdges, getOutEdges, isNode, subscribeToFinalElementChanges } from 'react-flowy/lib';
import create from 'zustand';

export enum WorkflowStatus {
  VALID = 'valid',
  INVALID = 'invalid',
  WARNING = 'warning',
  SAVING = 'saving'
}

export interface WorkflowStatusState {
  status: WorkflowStatus;
}

export interface WorkflowStatusActions {
  changeStatus: (newStatus: WorkflowStatus) => void;
}

export const useStatusStore = create<WorkflowStatusState & WorkflowStatusActions>(set => ({
  // ========== STATE ==========
  
  status: WorkflowStatus.VALID,

  // ========== ACTIONS ==========

  changeStatus: (newStatus: WorkflowStatus) => {
    set(state => ({ ...state, status: newStatus }));
  },
}));

let batchUpdateTimeout: number;

subscribeToFinalElementChanges(elements => {
  if (batchUpdateTimeout) clearTimeout(batchUpdateTimeout);

  batchUpdateTimeout = window.setTimeout(() => {
    const isThereUnconnectedNode = elements.some(node => {
      if (!isNode(node)) return false;

      const connectedEdges = [...getInEdges(node), ...getOutEdges(node)];

      return connectedEdges.length === 0;
    });

    if (isThereUnconnectedNode) {
      return useStatusStore.getState().changeStatus(WorkflowStatus.INVALID);
    }

    useStatusStore.getState().changeStatus(WorkflowStatus.VALID);
  }, 100);
});
