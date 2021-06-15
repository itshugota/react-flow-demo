import create from 'zustand';
import { isNode, subscribeToFinalElementChanges } from 'react-flowy/lib';
import { detectInvalidStatus, detectWarningStatus } from './status.store.actions';

export const WorkflowStatus = {
  VALID: 'valid',
  INVALID: 'invalid',
  WARNING: 'warning',
  SAVING: 'saving',
};

export const useStatusStore = create(set => ({
  // ========== STATE ==========
  
  status: WorkflowStatus.VALID,
  problematicNodes: [],
  shouldShowInvalidNodes: false,
  shouldShowUnhandledConditions: false,

  // ========== ACTIONS ==========

  changeStatus: newStatus => {
    set(state => ({ ...state, status: newStatus }));
  },

  setProblematicNodes: problematicNodes => {
    set(state => ({ ...state, problematicNodes }));
  },

  setShouldShowInvalidNodes: shouldShowInvalidNodes => {
    set(state => ({ ...state, shouldShowInvalidNodes }));
  },

  setShouldShowUnhandledConditions: shouldShowUnhandledConditions => {
    set(state => ({ ...state, shouldShowUnhandledConditions }));
  }
}));

let batchUpdateTimeout;

subscribeToFinalElementChanges(elements => {
  if (batchUpdateTimeout) clearTimeout(batchUpdateTimeout);

  batchUpdateTimeout = window.setTimeout(() => {
    localStorage.setItem('elements', JSON.stringify(elements));

    const nodes = elements.filter(element => isNode(element));

    const isInvalidStatusDetected = detectInvalidStatus(nodes);

    if (isInvalidStatusDetected) return;

    const isWarningStatusDetected = detectWarningStatus(nodes);

    if (isWarningStatusDetected) return;

    useStatusStore.getState().setProblematicNodes([]);
    useStatusStore.getState().changeStatus(WorkflowStatus.VALID);
  }, 100);
});
