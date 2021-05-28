import { Node, getInEdges, getOutEdges, isNode, subscribeToFinalElementChanges } from 'react-flowy/lib';
import create from 'zustand';
import { Condition, Operator } from '../components/nodes/ConditionNode/Condition.interface';

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
  shouldShowUnhandledConditions: boolean;
}

export interface WorkflowStatusActions {
  changeStatus: (newStatus: WorkflowStatus) => void;
  setProblematicNodes: (problematicNodes: ProblematicNode[]) => void;
  setShouldShowInvalidNodes: (shouldShowInvalidNodes: boolean) => void;
  setShouldShowUnhandledConditions: (shouldShowUnhandledConditions: boolean) => void;
}

export const useStatusStore = create<WorkflowStatusState & WorkflowStatusActions>(set => ({
  // ========== STATE ==========
  
  status: WorkflowStatus.VALID,
  problematicNodes: [],
  shouldShowInvalidNodes: false,
  shouldShowUnhandledConditions: false,

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

  setShouldShowUnhandledConditions: (shouldShowUnhandledConditions: boolean) => {
    set(state => ({ ...state, shouldShowUnhandledConditions }));
  }
}));

let batchUpdateTimeout: number;

subscribeToFinalElementChanges(elements => {
  if (batchUpdateTimeout) clearTimeout(batchUpdateTimeout);

  batchUpdateTimeout = window.setTimeout(() => {
    const nodes = elements.filter(element => isNode(element)) as Node[];

    const nodesWithNoOutgoingEdges = nodes.filter(node => {
      const outgoingEdges = getOutEdges(node);

      return node.type !== 'terminateNode' && outgoingEdges.length === 0;
    });

    const nodesWithNoIncomingEdges = nodes.filter(node => {
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
      useStatusStore.getState().setShouldShowUnhandledConditions(false);

      return useStatusStore.getState().changeStatus(WorkflowStatus.INVALID);
    }

    const conditionNodes = nodes.filter(node => node.type === 'conditionNode');
    const nodesWithWarning: ProblematicNode[] = [];

    conditionNodes.forEach(conditionNode => {
      const unfulfilledConditionMapping: Record<string, Operator[]> = {};

      (conditionNode.data.conditions as Condition[]).forEach(condition => {
        const { parameter, value } = condition;

        unfulfilledConditionMapping[`${parameter}${value}`] = Object.values(Operator);

        conditionNodes.forEach(cN => {
          const conditionWithSameParameterAndValue = (cN.data.conditions as Condition[])
            .find(({ parameter: param, value: val }) => param === parameter && val === value);

          if (!conditionWithSameParameterAndValue) return;

          const { operator } = conditionWithSameParameterAndValue;

          unfulfilledConditionMapping[`${parameter}${value}`] = unfulfilledConditionMapping[`${parameter}${value}`].filter(o => o !== operator);
        });
      });

      if (Object.values(unfulfilledConditionMapping).find(unfulfilledOperators => unfulfilledOperators.length > 0)) {
        nodesWithWarning.push({
          id: conditionNode.id,
          status: WorkflowStatus.WARNING,
          message: 'There are unhandled conditions.',
        });
      }
    });

    if (nodesWithWarning.length > 0) {
      useStatusStore.getState().setShouldShowInvalidNodes(false);
      useStatusStore.getState().setProblematicNodes(nodesWithWarning);

      return useStatusStore.getState().changeStatus(WorkflowStatus.WARNING);
    }

    useStatusStore.getState().setProblematicNodes([]);
    useStatusStore.getState().changeStatus(WorkflowStatus.VALID);
  }, 100);
});
