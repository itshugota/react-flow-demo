import { getOutEdges, getTargetNode, useReactFlowyStore } from 'react-flowy/lib';
import { useStatusStore, WorkflowStatus } from '../store/status.store';
import { isNodeInLoop } from '../utils/nodes';

export const generateScripts = () => {
  const recursiveScripts = generateScriptsRecursive();
  
  return joinRecursiveScripts(recursiveScripts);
};

const joinRecursiveScripts = recursiveScripts => {
  const actualScripts = [];

  const join = recursiveScript => {
    if (!Array.isArray(recursiveScript[0])) {
      actualScripts.push(recursiveScript);

      return;
    }
  
    return recursiveScript.map(rs => join(rs));
  };

  join(recursiveScripts);

  return actualScripts;
};

const generateScriptsRecursive = (currentNode, currentScript, scripts) => {
  const status = useStatusStore.getState().status;

  if (status === WorkflowStatus.INVALID) return [];

  const nodes = useReactFlowyStore.getState().nodes;

  if (!currentNode) currentNode = nodes.find(node => node.type === 'startNode');

  if (!currentScript) currentScript = [currentNode];
  else {
    currentScript = [...currentScript, currentNode];
  }

  if (currentNode.type === 'terminateNode') {
    return currentScript;
  }

  if (currentNode.type !== 'conditionNode') {
    return getOutEdges(currentNode).map(outcomingEdge => {
      const targetNode = getTargetNode(outcomingEdge);

      return generateScriptsRecursive(targetNode, currentScript, scripts);
    });
  }

  const loopTimes = joinRecursiveScripts(currentScript)[0].filter(node => node.id === currentNode.id).length - 1;

  if (currentNode.data.loopCount && loopTimes >= currentNode.data.loopCount) {
    const outcomingEdges = getOutEdges(currentNode);
    const loopEndEdge = outcomingEdges.find(outcomingEdge => outcomingEdge.label === 'LOOP END');
    const loopEndTargetNode = getTargetNode(loopEndEdge);
    
    let otherEscapeNode;
    
    outcomingEdges.forEach(outcomingEdge => {
      const targetNode = getTargetNode(outcomingEdge);

      if (outcomingEdge.label === 'LOOP END' || isNodeInLoop(targetNode)) return;

      otherEscapeNode = targetNode;
    });

    if (otherEscapeNode) {
      return [
        generateScriptsRecursive(otherEscapeNode, currentScript, scripts),
        generateScriptsRecursive(loopEndTargetNode, currentScript, scripts),
      ];
    }

    return generateScriptsRecursive(loopEndTargetNode, currentScript, scripts);
  }

  return getOutEdges(currentNode)
    .filter(outcomingEdge => outcomingEdge.label !== 'LOOP END')
    .map(outcomingEdge => {
      const targetNode = getTargetNode(outcomingEdge);

      return generateScriptsRecursive(targetNode, currentScript, scripts);
    });
};
