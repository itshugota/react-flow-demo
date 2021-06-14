import { getInEdges, getOutEdges } from 'react-flowy/lib';
import { useStatusStore } from './status.store';

export const detectInvalidStatus = nodes => {
  const nodesWithNoOutgoingEdges = nodes.filter(node => {
    const outgoingEdges = getOutEdges(node);

    return node.type !== 'terminateNode' && outgoingEdges.length === 0;
  });

  const nodesWithNoIncomingEdges = nodes.filter(node => {
    const incomingEdges = getInEdges(node);

    return node.type !== 'startNode' && incomingEdges.length === 0;
  });

  if (nodesWithNoOutgoingEdges.length > 0 || nodesWithNoIncomingEdges.length > 0) {
    const problematicNodes = 
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

    useStatusStore.getState().changeStatus(WorkflowStatus.INVALID);

    return true;
  }

  return false;
};

export const detectWarningStatus = nodes => {
  const conditionNodes = nodes.filter(node => node.type === 'conditionNode');
  const nodesWithWarning = [];

  conditionNodes.forEach(conditionNode => {
    const unfulfilledConditionMapping = {};

    conditionNode.data.conditions.forEach(condition => {
      const { parameter, value } = condition;

      unfulfilledConditionMapping[`${parameter}${value}`] = ['=', '!='];

      conditionNodes.forEach(cN => {
        const conditionWithSameParameterAndValue = cN.data.conditions
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

    useStatusStore.getState().changeStatus(WorkflowStatus.WARNING);

    return true;
  }

  return false;
};
