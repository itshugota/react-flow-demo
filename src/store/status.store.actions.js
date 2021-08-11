import { getIncomingEdges, getOutgoingEdges } from 'react-flowy/lib';
import { useStatusStore, WorkflowStatus } from './status.store';

export const detectInvalidStatus = (nodes, edges) => {
  const nodesWithNoOutgoingEdges = nodes.filter(node => {
    const outgoingEdges = getOutgoingEdges(edges)(node);

    return node.type !== 'terminateNode' && outgoingEdges.length === 0;
  });

  const nodesWithNoIncomingEdges = nodes.filter(node => {
    const incomingEdges = getIncomingEdges(edges)(node);

    return node.type !== 'startNode' && incomingEdges.length === 0;
  });

  if (nodesWithNoOutgoingEdges.length > 0 || nodesWithNoIncomingEdges.length > 0) {
    const problematicNodes = 
      [
        ...nodesWithNoOutgoingEdges.map(({ id }) => ({
          id,
          status: WorkflowStatus.INVALID,
          message: 'This node has no outgoing edge.',
        })),
        ...nodesWithNoIncomingEdges.map(({ id }) => ({
          id,
          status: WorkflowStatus.INVALID,
          message: 'This node has no incoming edge.',
        }))
      ];

    useStatusStore.getState().setProblematicNodes(problematicNodes);
    useStatusStore.getState().setShouldShowUnhandledConditions(false);

    useStatusStore.getState().changeStatus(WorkflowStatus.INVALID);

    return true;
  }

  return false;
};

export const detectWarningStatus = (nodes, edges) => {
  const conditionNodes = nodes.filter(node => node.type === 'conditionNode');
  const nodesWithWarning = [];

  conditionNodes.forEach(conditionNode => {
    const outcomingEdges = getOutgoingEdges(edges)(conditionNode);

    let doesTrueEdgeExist = false;
    let doesFalseEdgeExist = false;

    outcomingEdges.forEach(outcomingEdge => {
      if (outcomingEdge.label === 'TRUE') doesTrueEdgeExist = true;
      else if (outcomingEdge.label === 'FALSE') doesFalseEdgeExist = true;
    });

    if (!doesTrueEdgeExist || !doesFalseEdgeExist) {
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
