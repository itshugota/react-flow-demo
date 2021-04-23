import React, { useState } from 'react';
import ReactFlow, {
  removeElements,
  addEdge,
  isNode,
  Controls,
  Background
} from 'react-flow-renderer';

export function getElements(xElements = 10, yElements = 10) {
  const initialElements = [];
  let nodeId = 1;
  let recentNodeId = null;

  for (let y = 0; y < yElements; y++) {
    for (let x = 0; x < xElements; x++) {
      const position = { x: x * 100, y: y * 50 };
      const data = { label: `Node ${nodeId}` };
      const node = {
        id: `stress-${nodeId.toString()}`,
        style: { width: 50, fontSize: 11 },
        data,
        position,
      };
      initialElements.push(node);

      if (recentNodeId && nodeId <= xElements * yElements) {
        initialElements.push({
          id: `${x}-${y}`,
          source: `stress-${recentNodeId.toString()}`,
          target: `stress-${nodeId.toString()}`,
        });
      }

      recentNodeId = nodeId;
      nodeId++;
    }
  }

  return initialElements;
}

const initialElements = getElements(10, 20);

const StressFlow = () => {
  const [elements, setElements] = useState(initialElements);
  // @ts-ignore
  const onElementsRemove = (elementsToRemove) =>
  // @ts-ignore
    setElements((els) => removeElements(elementsToRemove, els));
  // @ts-ignore
  const onConnect = (params) => setElements((els) => addEdge(params, els));

  const updatePos = () => {
    setElements((elms) => {
      return elms.map((el) => {
        if (isNode(el)) {
          return {
            ...el,
            position: {
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            },
          };
        }

        return el;
      });
    });
  };

  return (
    <ReactFlow
      elements={elements}
      onElementsRemove={onElementsRemove}
      onConnect={onConnect}
    >
      <Controls />
      <Background />

      <button
        onClick={updatePos}
        style={{ position: 'absolute', right: 10, top: 30, zIndex: 4 }}
      >
        change pos
      </button>
    </ReactFlow>
  );
};

export default StressFlow;