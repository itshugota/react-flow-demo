// @ts-nocheck

import React, { useState, useEffect } from 'react';
import ReactFlow, { addEdge, ReactFlowProps, Background, BackgroundVariant } from 'react-flowy';

import EdgeWithWayPoints from './EdgeWithWaypoints/EdgeWithWayPoints';
import IntentNodeWithoutHandles from './IntentNode/IntentNodeWithoutHandles';
import StartNodeWithoutHandles from './StartNode/StartNodeWithoutHandles';
import ConditionNodeWithoutHandles from './ConditionNode/ConditionNodeWithoutHandles';
import ActionNodeWithoutHandles from './ActionNode/ActionNodeWithoutHandles';
import TerminateNodeWithoutHandles from './TerminateNode/TerminateNodeWithoutHandles';

import { connectPoints, connectRectangles, repairConnection } from '../lib/layout/manhattanLayout';
import { getNodeById, getRectangleByNodeId } from '../utils/node';

const nodeTypes = {
  startNodeWithoutHandles: StartNodeWithoutHandles,
  intentNodeWithoutHandles: IntentNodeWithoutHandles,
  conditionNodeWithoutHandles: ConditionNodeWithoutHandles,
  actionNodeWithoutHandles: ActionNodeWithoutHandles,
  terminateNodeWithoutHandles: TerminateNodeWithoutHandles,
};

const edgeTypes = {
  edgeWithWaypoints: EdgeWithWayPoints,
};

const graphElements = [
  {
    id: '0',
    type: 'startNodeWithoutHandles',
    position: {
      x: 80,
      y: 80,
    },
  },
  {
    id: '1',
    type: 'intentNodeWithoutHandles',
    data: {
      intent: 'ATM Locations',
    },
    position: {
      x: 80,
      y: 400,
    },
  },
  {
    id: '2',
    type: 'conditionNodeWithoutHandles',
    data: {
      conditions: [
        {
          parameter: '@sys.geo_district',
          operator: '!=',
          value: 'NULL',
        }
      ],
    },
    position: {
      x: 480,
      y: 200,
    },
  },
  {
    id: '3',
    type: 'actionNodeWithoutHandles',
    data: {
      action: 'ATM Locations',
    },
    position: {
      x: 1120,
      y: 200,
    },
  },
  {
    id: '4',
    type: 'terminateNodeWithoutHandles',
    position: {
      x: 640,
      y: 600,
    },
  },
];

const WorkflowWithEditableAnchors = () => {
  const [elements, setElements] = useState(graphElements);
  // @ts-ignore
  
  const handleLoad: ReactFlowProps['onLoad'] = (reactFlowInstance) => {
    console.log(reactFlowInstance.toObject());

    const node1Rectangle = getRectangleByNodeId(elements)('1');
    const node2Rectangle = getRectangleByNodeId(elements)('2');

    const waypoints = connectRectangles(node1Rectangle, node2Rectangle);

    const edgeParams = {
      id: 'e1-2',
      type: 'edgeWithWaypoints',
      source: '1',
      target: '2',
      arrowHeadType: 'arrowclosed',
      data: {
        waypoints,
      },
    };

    // @ts-ignore
    setElements(els => addEdge(edgeParams, els));
  };

  // @ts-ignore
  const onConnect: ReactFlowProps['onConnect'] = (edgeParams) => setElements((els) => addEdge({ ...edgeParams, type: 'smoothstep' }, els));

  const handleNodeDrag: ReactFlowProps['onNodeDrag'] = (event, node, draggableData) => {
    setElements(els => {
      const newElements = els.map(element => {
        if (element.id === node.id) return node;

        if (element.target !== node.id && element.source !== node.id) return element;

        const edge = { ...element };

        const otherNode = edge.target === node.id ? getNodeById(els)(edge.source) : getNodeById(els)(edge.target);
  
        const nodeRectangle = getRectangleByNodeId(els)(node.id);
        const otherNodeRectangle = getRectangleByNodeId(els)(otherNode!.id);
  
        edge.data.waypoints = edge.source === node.id ? repairConnection(nodeRectangle, otherNodeRectangle) : repairConnection(otherNodeRectangle, nodeRectangle);
  
        return edge;
      });
  
      return newElements;
    });
  };


  const handleNodeDragStart: ReactFlowProps['onNodeDragStart'] = (event, node) => {
    (node as any).previousPosition = { x: node.position.x, y: node.position.y };
  }

  return <ReactFlow
    // @ts-ignore
    elements={elements}
    edgeTypes={edgeTypes}
    nodeTypes={nodeTypes}
    onConnect={onConnect}
    onLoad={handleLoad}
    snapToGrid={true}
    snapGrid={[8, 8]}
    onlyRenderVisibleElements={false}
    onNodeDrag={handleNodeDrag}
    onNodeDragStart={handleNodeDragStart}
  >
    <Background color="#aaa" gap={32} variant={BackgroundVariant.Lines} />
  </ReactFlow>;
}

export default WorkflowWithEditableAnchors;
