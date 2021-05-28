import { getInEdges, getOutEdges, isNode, subscribeToFinalElementChanges } from 'react-flowy/lib';
import create from 'zustand';

export enum WorkflowStatus {
  VALID = 'valid',
  INVALID = 'invalid',
  WARNING = 'warning',
  SAVING = 'saving'
}

export interface ProblematicNode {
  id: string;
  status: WorkflowStatus;
  message: string;
}

export interface WorkflowStatusState {
  status: WorkflowStatus;
  problematicNodes: ProblematicNode[];
  shouldShowInvalidNodes: boolean;
  shouldShowUnhandledCases: boolean;
}

export interface WorkflowStatusActions {
  changeStatus: (newStatus: WorkflowStatus) => void;
  setProblematicNodes: (problematicNodes: ProblematicNode[]) => void;
  setShouldShowInvalidNodes: (shouldShowInvalidNodes: boolean) => void;
  setShouldShowUnhandledCases: (shouldShowUnhandledCases: boolean) => void;
}

export const useStatusStore = create<WorkflowStatusState & WorkflowStatusActions>(set => ({
  // ========== STATE ==========
  
  status: WorkflowStatus.VALID,
  problematicNodes: [],
  shouldShowInvalidNodes: false,
  shouldShowUnhandledCases: false,

  // ========== ACTIONS ==========

  changeStatus: (newStatus: WorkflowStatus) => {
    set(state => ({ ...state, status: newStatus }));
  },

  setProblematicNodes: (problematicNodes: ProblematicNode[]) => {
    set(state => ({ ...state, problematicNodes }));
  },

  setShouldShowInvalidNodes: (shouldShowInvalidNodes: boolean) => {
    set(state => ({ ...state, shouldShowInvalidNodes }));
  },

  setShouldShowUnhandledCases: (shouldShowUnhandledCases: boolean) => {
    set(state => ({ ...state, shouldShowUnhandledCases }));
  }
}));

let batchUpdateTimeout: number;

subscribeToFinalElementChanges(elements => {
  if (batchUpdateTimeout) clearTimeout(batchUpdateTimeout);

  batchUpdateTimeout = window.setTimeout(() => {
    const nodesWithNoOutgoingEdges = elements.filter(node => {
      if (!isNode(node)) return false;

      const outgoingEdges = getOutEdges(node);

      return node.type !== 'terminateNode' && outgoingEdges.length === 0;
    });

    const nodesWithNoIncomingEdges = elements.filter(node => {
      if (!isNode(node)) return false;

      const incomingEdges = getInEdges(node);

      return node.type !== 'startNode' && incomingEdges.length === 0;
    });

    if (nodesWithNoOutgoingEdges.length > 0 || nodesWithNoIncomingEdges.length > 0) {
      const problematicNodes: ProblematicNode[] = 
        [
          ...nodesWithNoOutgoingEdges.map(({ id }) => ({
            id,
            status: WorkflowStatus.INVALID,
            message: 'This node has no outgoing edge.'
          })),
          ...nodesWithNoIncomingEdges.map(({ id }) => ({
            id,
            status: WorkflowStatus.INVALID,
            message: 'This node has no incoming edge.'
          })),
        ];

      useStatusStore.getState().setProblematicNodes(problematicNodes);

      return useStatusStore.getState().changeStatus(WorkflowStatus.INVALID);
    }

    useStatusStore.getState().setShouldShowInvalidNodes(false);
    useStatusStore.getState().setProblematicNodes([]);
    useStatusStore.getState().changeStatus(WorkflowStatus.VALID);
  }, 100);
});
