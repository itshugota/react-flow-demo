import React from 'react';

import IntentNode from './nodes/IntentNode/IntentNode';
import StartNode from './nodes/StartNode/StartNode';
import ConditionNode from './nodes/ConditionNode/ConditionNode';
import ActionNode from './nodes/ActionNode/ActionNode';
import TerminateNode from './nodes/TerminateNode/TerminateNode';

import ReactFlow, {
  ReactFlowProps,
  BackgroundVariant,
  Background,
  reactFlowyState,
  getRectangleByNodeId,
  getNodeById,
  repairConnection,
  StandardEdge,
  Elements,
} from 'react-flowy/lib';

const nodeTypes = {
  startNode: StartNode,
  intentNode: IntentNode,
  conditionNode: ConditionNode,
  actionNode: ActionNode,
  terminateNode: TerminateNode,
};

const edgeTypes = {
  standardEdge: StandardEdge,
};

const graphElements: Elements = [
  {
    id: '0',
    type: 'startNode',
    position: {
      x: 80,
      y: 80,
    },
  },
  {
    id: '1',
    type: 'intentNode',
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
    type: 'conditionNode',
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
    type: 'actionNode',
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
    type: 'terminateNode',
    position: {
      x: 640,
      y: 600,
    },
  },
];

const WorkflowWithEditableAnchors = () => {
  const handleLoad: ReactFlowProps['onLoad'] = (reactFlowInstance) => {
    console.log(reactFlowInstance.toObject());
  };

  const handleNodeDrag: ReactFlowProps['onNodeDrag'] = (event, node, dragDelta) => {
    const elements = [...reactFlowyState.nodes, ...reactFlowyState.edges];

    reactFlowyState.edges.forEach(edge => {
      if (edge.target !== node.id && edge.source !== node.id) return;

      const otherNode = edge.target === node.id ?
        getNodeById(elements)(edge.source) :
        getNodeById(elements)(edge.target);

      const nodeRectangle = getRectangleByNodeId(elements)(node.id);
      nodeRectangle.x += dragDelta.deltaX;
      nodeRectangle.y += dragDelta.deltaY;

      const otherNodeRectangle = getRectangleByNodeId(elements)(otherNode!.id);

      const newStart = {
        x: edge.waypoints[0].x + dragDelta.deltaX,
        y: edge.waypoints[0].y + dragDelta.deltaY,
      }

      const newEnd = {
        x: edge.waypoints[edge.waypoints.length - 1].x + dragDelta.deltaX,
        y: edge.waypoints[edge.waypoints.length - 1].y + dragDelta.deltaY,
      }

      edge.waypoints = edge.source === node.id ?
        repairConnection(nodeRectangle, otherNodeRectangle, newStart, undefined, edge.waypoints, { connectionStart: true }) :
        repairConnection(otherNodeRectangle, nodeRectangle, undefined, newEnd, edge.waypoints, { connectionEnd: true });
    });
  };

  return <ReactFlow
    elements={graphElements}
    edgeTypes={edgeTypes}
    nodeTypes={nodeTypes}
    onLoad={handleLoad}
    snapToGrid={true}
    snapGrid={[8, 8]}
    onlyRenderVisibleElements={false}
    onNodeDrag={handleNodeDrag}
  >
    <Background color="#aaa" gap={32} variant={BackgroundVariant.Lines} />
  </ReactFlow>;
}

export default WorkflowWithEditableAnchors;
