import React, { useState } from 'react';
import ReactFlow, { addEdge, ReactFlowProps, Background } from 'react-flow-renderer';

import EdgeWithWayPoints from './EdgeWithWaypoints/EdgeWithWayPoints';
import IntentNodeWithoutHandles from './IntentNode/IntentNodeWithoutHandles';
import StartNodeWithoutHandles from './StartNode/StartNodeWithoutHandles';
import ConditionNodeWithoutHandles from './ConditionNode/ConditionNodeWithoutHandles';
import ActionNodeWithoutHandles from './ActionNode/ActionNodeWithoutHandles';
import TerminateNodeWithoutHandles from './TerminateNode/TerminateNodeWithoutHandles';

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
    id: 'e0-1',
    type: 'edgeWithWaypoints',
    source: '0',
    target: '1',
    arrowHeadType: 'arrowclosed',
    data: {
      waypoints: [
        { x: 120, y: 100 },
        { x: 200, y: 100 },
        { x: 200, y: 400 },
      ],
    }
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
    id: 'e1-2',
    type: 'edgeWithWaypoints',
    source: '1',
    target: '2',
    arrowHeadType: 'arrowclosed',
    data: {
      waypoints: [
        { x: 325, y: 420 },
        { x: 400, y: 420 },
        { x: 400, y: 120 },
        { x: 560, y: 120 },
        { x: 560, y: 200 },
      ],
    }
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
    id: 'e2-3',
    type: 'edgeWithWaypoints',
    source: '2',
    target: '3',
    arrowHeadType: 'arrowclosed',
    data: {
      waypoints: [
        { x: 980, y: 240 },
        { x: 1120, y: 240 },
      ],
    }
  },
  {
    id: '4',
    type: 'terminateNodeWithoutHandles',
    position: {
      x: 640,
      y: 600,
    },
  },
  {
    id: 'e3-4',
    type: 'edgeWithWaypoints',
    source: '3',
    target: '4',
    arrowHeadType: 'arrowclosed',
    data: {
      waypoints: [
        { x: 1200, y: 320 },
        { x: 1200, y: 500 },
        { x: 660, y: 500 },
        { x: 660, y: 600 },
      ],
    }
  },
];

const WorkflowWithWaypoints = () => {
  const [elements, setElements] = useState(graphElements);
  // @ts-ignore
  const onConnect: ReactFlowProps['onConnect'] = (edgeParams) => setElements((els) => addEdge({ ...edgeParams, type: 'smoothstep' }, els));

  return <ReactFlow
    // @ts-ignore
    elements={elements}
    edgeTypes={edgeTypes}
    nodeTypes={nodeTypes}
    onConnect={onConnect}
    snapToGrid={true}
    snapGrid={[8, 8]}
    onlyRenderVisibleElements={false}
    nodesDraggable={false}
  >
    <Background color="#aaa" gap={16} />
  </ReactFlow>;
}

export default WorkflowWithWaypoints;
