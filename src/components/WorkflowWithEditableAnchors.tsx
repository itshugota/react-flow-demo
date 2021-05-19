// @ts-nocheck

import React, { useState, useEffect, useCallback } from 'react';
import ReactFlow, { addEdges, ReactFlowProps, Background, BackgroundVariant, useStoreState, useStoreActions } from 'react-flowy';

import EdgeWithWayPoints from './EdgeWithWaypoints/EdgeWithWayPoints';
import IntentNodeWithoutHandles from './IntentNode/IntentNodeWithoutHandles';
import StartNodeWithoutHandles from './StartNode/StartNodeWithoutHandles';
import ConditionNodeWithoutHandles from './ConditionNode/ConditionNodeWithoutHandles';
import ActionNodeWithoutHandles from './ActionNode/ActionNodeWithoutHandles';
import TerminateNodeWithoutHandles from './TerminateNode/TerminateNodeWithoutHandles';

import { connectPoints, connectRectangles, connectRectangleToPoint, repairConnection } from '../lib/layout/manhattanLayout';
import { getNodeById, getRectangleByNodeId } from '../utils/node';
import { eventPointToCanvasCoordinates } from '../lib/utils/coordinates';
import { getCanvasFromTransform } from '../utils/canvas';
import { getCroppedWaypoints, getDockingPoint } from '../lib/layout/croppingConnectionDocking';
import Rectangle from '../lib/types/Rectangle';

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
  const [isInitialized, setIsInitialized] = useState(false);
  const canvasTransform = useStoreState(state => state.transform);
  const nodes = useStoreState(state => state.nodes);
  const edges = useStoreState(state => state.edges);
  const setElements = useStoreActions(actions => actions.setElements);
  
  const handleLoad: ReactFlowProps['onLoad'] = (reactFlowInstance) => {
    console.log(reactFlowInstance.toObject());

    // if (isInitialized) return;

    // const initialElements = [
    //   ...nodes,
    //   ...edges,
    //   ...graphElements
    // ];

    // setIsInitialized(true);
    // setElements(initialElements);
  };

  useEffect(() => {
    // if (!edges.find(edge => edge.id === 'e1-2')) return;

    // const node1Rectangle = getRectangleByNodeId(elements)('1');
    // const node2Rectangle = getRectangleByNodeId(elements)('2');

    // const waypoints = connectRectangles(node1Rectangle, node2Rectangle);

    // const edgeParams = {
    //   id: 'e1-2',
    //   type: 'edgeWithWaypoints',
    //   source: '1',
    //   target: '2',
    //   arrowHeadType: 'arrowclosed',
    //   data: {
    //     waypoints,
    //   },
    // };

    // setElements(addEdges([edgeParams], elements));
  }, [nodes, edges]);

  // @ts-ignore
  const onConnect: ReactFlowProps['onConnect'] = (edgeParams) => setElements((els) => addEdge({ ...edgeParams, type: 'smoothstep' }, els));

  const handleNodeDrag: ReactFlowProps['onNodeDrag'] = useCallback((event, node, draggableData) => {
    const elements = [...nodes, ...edges];

    const newElements = elements.map(element => {
      if (element.target !== node.id && element.source !== node.id) return element;

      const edge = { ...element };

      const otherNode = edge.target === node.id ?
        getNodeById(elements)(edge.source) :
        getNodeById(elements)(edge.target);

      const nodeRectangle = getRectangleByNodeId(elements)(node.id, { x: draggableData.deltaX, y: draggableData.deltaY });
      const otherNodeRectangle = getRectangleByNodeId(elements)(otherNode!.id);

      console.log('nodeAferMove', JSON.stringify(node));

      const newStart = {
        x: edge.data.waypoints[0].x + draggableData.deltaX,
        y: edge.data.waypoints[0].y + draggableData.deltaY,
      }

      const newEnd = {
        x: edge.data.waypoints[edge.data.waypoints.length - 1].x + draggableData.deltaX,
        y: edge.data.waypoints[edge.data.waypoints.length - 1].y + draggableData.deltaY,
      }

      edge.data.waypoints = edge.source === node.id ?
        repairConnection(nodeRectangle, otherNodeRectangle, newStart, undefined, edge.data.waypoints, { connectionStart: true }) :
        repairConnection(otherNodeRectangle, nodeRectangle, undefined, newEnd, edge.data.waypoints, { connectionEnd: true });

      // edge.data.waypoints = getCroppedWaypoints({ waypoints: edge.data.waypoints, source: nodeRectangle, target: otherNodeRectangle }, nodeRectangle, otherNodeRectangle);

      return edge;
    });

    setElements(newElements);
  }, [nodes, edges]);

  function getConnectionDocking(point: Point, shape: Rectangle) {
    return point ? (point.original || point) : getMid(shape);
  }

  return <ReactFlow
    elements={graphElements}
    edgeTypes={edgeTypes}
    nodeTypes={nodeTypes}
    onConnect={onConnect}
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
