import { getOutEdges, getTargetNode } from 'react-flowy/lib';

export const isNodeInLoop = (firstNode, node) => {
  if (!node) {
    node = { ...firstNode };
  } else if (node.id === firstNode.id) {
    return true;
  }

  const outcomingEdges = getOutEdges(node).filter(edge => !edge.isForming);

  if (!outcomingEdges.length) return false;

  return outcomingEdges.some(outcomingEdge => {
    const targetNode = getTargetNode(outcomingEdge);

    return isNodeInLoop(firstNode, targetNode);
  });
};
