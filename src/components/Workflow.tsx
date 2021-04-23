import React, { useState } from 'react';
import ReactFlow, { addEdge, ReactFlowProps, Background } from 'react-flow-renderer';

import StartNode from './StartNode/StartNode';
import TerminateNode from './TerminateNode/TerminateNode';
import IntentNode from './IntentNode/IntentNode';
import ConditionNode from './ConditionNode/ConditionNode';
import ActionNode from './ActionNode/ActionNode';

const nodeTypes = {
  startNode: StartNode,
  terminateNode: TerminateNode,
  intentNode: IntentNode,
  conditionNode: ConditionNode,
  actionNode: ActionNode,
};

const initialElements = [
  {
    id: '0',
    type: 'startNode',
    position: {
      x: 400,
      y: 96,
    },
  },
  {
    id: '1',
    type: 'terminateNode',
    position: {
      x: 400,
      y: 912,
    },
  },
  {
    id: '3',
    type: 'intentNode',
    data: {
      intent: 'ATM Locations',
    },
    position: {
      x: 296,
      y: 192,
    },
  },
  {
    id: '4',
    type: 'conditionNode',
    data: {
      'conditions': [
        {
          parameter: '@sys.geo_district',
          operator: '!=',
          value: 'NULL',
        }
      ],
    },
    position: {
      x: 168,
      y: 416.5,
    },
  },
  {
    id: '5',
    type: 'actionNode',
    data: {
      action: 'ATM Locations',
    },
    position: {
      x: 296,
      y: 728,
    },
  },
  {
    id: '6',
    type: 'conditionNode',
    data: {
      conditions: [
        {
          parameter: '@sys.geo_district',
          operator: '=',
          value: 'NULL',
        }
      ],
    },
    position: {
      x: 1112,
      y: 144.5,
    },
  },
  {
    id: '7',
    type: 'actionNode',
    data: {
      action: 'Determine location',
    },
    position: {
      x: 1240,
      y: 464,
    },
  },
  {
    id: '8',
    type: 'intentNode',
    data: {
      intent: 'Location',
    },
    position: {
      x: 848,
      y: 464,
    },
  },
  {
    id: 'e0-3',
    source: '0',
    target: '3',
    type: 'smoothstep',
    sourceHandle: null,
    targetHandle: null,
    arrowHeadType: 'arrowclosed',
  },
  {
    source: '3',
    sourceHandle: 'source-bottom',
    target: '4',
    targetHandle: 'target-top',
    type: 'smoothstep',
    id: 'reactflow__edge-3source-bottom-4target-top',
    arrowHeadType: 'arrowclosed',
  },
  {
    source: '3',
    sourceHandle: 'source-right',
    target: '6',
    targetHandle: 'target-left',
    type: 'smoothstep',
    id: 'reactflow__edge-3source-right-6target-left',
    arrowHeadType: 'arrowclosed',
  },
  {
    source: '6',
    sourceHandle: 'source-bottom',
    target: '7',
    targetHandle: 'target-top',
    type: 'smoothstep',
    id: 'reactflow__edge-6source-bottom-7target-top',
    arrowHeadType: 'arrowclosed',
  },
  {
    source: '8',
    sourceHandle: 'source-right',
    target: '7',
    targetHandle: 'target-left',
    type: 'smoothstep',
    id: 'reactflow__edge-8source-right-7target-left',
  },
  {
    source: '4',
    sourceHandle: 'source-right',
    target: '8',
    targetHandle: 'target-left',
    type: 'smoothstep',
    id: 'reactflow__edge-4source-right-8target-left',
  },
  {
    source: '4',
    sourceHandle: 'source-bottom',
    target: '5',
    targetHandle: 'target-top',
    type: 'smoothstep',
    id: 'reactflow__edge-4source-bottom-5target-top',
    arrowHeadType: 'arrowclosed',
  },
  {
    source: '5',
    sourceHandle: 'source-bottom',
    target: '1',
    targetHandle: null,
    type: 'smoothstep',
    id: 'reactflow__edge-5source-bottom-1null',
    arrowHeadType: 'arrowclosed',
  }
];

const Workflow = () => {
  const [elements, setElements] = useState(initialElements);
  // @ts-ignore
  const onConnect: ReactFlowProps['onConnect'] = (edgeParams) => setElements((els) => addEdge({ ...edgeParams, type: 'smoothstep' }, els));

  return <ReactFlow
    // @ts-ignore
    elements={elements}
    nodeTypes={nodeTypes}
    onConnect={onConnect}
    snapToGrid={true}
    snapGrid={[8, 8]}
  >
    <Background color="#aaa" gap={16} />
  </ReactFlow>;
}

export default Workflow;
