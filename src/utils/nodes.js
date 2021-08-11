import {
  getIncomingEdges,
  getOutgoingEdges,
  getSourceNode,
  getTargetNode
} from 'react-flowy/lib';

export const isNodeInLoop = (nodes, edges) => (firstNode, node) => {
  if (!node) {
    /* eslint-disable no-param-reassign */
    node = { ...firstNode };
  } else if (node.id === firstNode.id) {
    return true;
  }

  const outgoingEdges = getOutgoingEdges(edges)(node).filter(edge => !edge.isForming);

  if (!outgoingEdges.length) return false;

  return outgoingEdges.some(outcomingEdge => {
    const targetNode = getTargetNode(nodes)(outcomingEdge);

    return isNodeInLoop(nodes, edges)(firstNode, targetNode);
  });
};

export const getParentsOfNode = (nodes, edges) => node => {
  const incomingEdges = getIncomingEdges(edges)(node);

  return incomingEdges.map(incomingEdge => getSourceNode(nodes)(incomingEdge));
};
