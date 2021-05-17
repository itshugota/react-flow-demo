import React, { useState } from 'react';
import ReactFlow, { addEdge, ReactFlowProps, Background } from 'react-flowy';

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
        { x: 140, y: 100 },
        { x: 140, y: 400 },
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
        { x: 1050, y: 240 },
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

interface Waypoint {
  x: number;
  y: number;
}

// TODO: Embed this inside the library
const getNodeElementById = (id: string) => {
  return document.querySelector(`.react-flow__node[data-id="${id}"`);
}

const getNodeById = (elements: typeof graphElements) => (id: string) => {
  return elements.find(element => element.id === id);
}

const WorkflowWithWaypoints = () => {
  const [elements, setElements] = useState(graphElements);
  // @ts-ignore
  const onConnect: ReactFlowProps['onConnect'] = (edgeParams) => setElements((els) => addEdge({ ...edgeParams, type: 'smoothstep' }, els));

  const handleNodeDrag: ReactFlowProps['onNodeDrag'] = (event, node, draggableData) => {
    const newElements = elements.map(element => {
      if (element.target !== node.id && element.source !== node.id) return element;

      const nodeElement = getNodeElementById(node.id) as HTMLElement;
      const otherNode = element.target === node.id ? getNodeById(elements)(element.source) : getNodeById(elements)(element.target);
      const otherNodeElement = getNodeElementById(otherNode!.id) as HTMLElement;

      const edge = { ...element };
      const numOfWaypoints = edge.data?.waypoints?.length as number;

      let firstWaypointIndex: number;
      let secondWaypointIndex: number;
      let lastWaypointIndex: number;
      let secondLastWaypointIndex: number;
      let thirdLastWaypointIndex: number;

      if (element.target === node.id) {
        firstWaypointIndex = 0;
        secondWaypointIndex = 1;
        lastWaypointIndex = numOfWaypoints - 1;
        secondLastWaypointIndex = numOfWaypoints - 2;
        thirdLastWaypointIndex = numOfWaypoints - 3;
      } else {
        firstWaypointIndex = numOfWaypoints - 1;
        secondWaypointIndex = numOfWaypoints - 2;
        lastWaypointIndex = 0;
        secondLastWaypointIndex = 1;
        thirdLastWaypointIndex = 2;
      }

      const firstWaypoint = { ...edge.data?.waypoints![firstWaypointIndex] } as Waypoint;
      const secondWaypoint = { ...edge.data?.waypoints![secondWaypointIndex] } as Waypoint;
      const lastWaypoint = { ...edge.data?.waypoints![lastWaypointIndex] } as Waypoint;
      const secondLastWaypoint = { ...edge.data?.waypoints![secondLastWaypointIndex] } as Waypoint;
      const thirdLastWaypoint = { ...edge.data?.waypoints![thirdLastWaypointIndex] } as Waypoint;
      const waypointIndicesToDelete: number[] = [];
      const waypointsToAdd = [];

      if (lastWaypoint.y === secondLastWaypoint.y) {
        lastWaypoint.x += draggableData.deltaX;
        lastWaypoint.y += draggableData.deltaY;
        secondLastWaypoint.y += draggableData.deltaY;

        if (numOfWaypoints === 3) {
          thirdLastWaypoint.y += draggableData.deltaY;
        }

        if (numOfWaypoints > 3 && Math.abs(secondLastWaypoint.x - lastWaypoint.x) <= 8 && Math.abs(secondLastWaypoint.y - lastWaypoint.y) <= 8) {
          waypointIndicesToDelete.push(secondLastWaypointIndex);

          const nodeWidth = nodeElement.offsetWidth;

          lastWaypoint.x = node.position.x + nodeWidth / 2;
          lastWaypoint.y = node.position.y;
          
          if (thirdLastWaypoint) {
            thirdLastWaypoint.x = lastWaypoint.x;
          }
        }

        console.log('otherNode', otherNode);
        console.log('firstWaypoint.x', firstWaypoint.x);
        console.log('firstWaypoint.y', firstWaypoint.y);

        if (Math.abs(otherNode!.position!.x - firstWaypoint.x) <= 8 && Math.abs(otherNode!.position!.y - firstWaypoint.y) <= 8) {
          console.log('hihi?')
          if (numOfWaypoints > 3) {
            // firstWaypoint.x = otherNode!.position!.x;
            // firstWaypoint.y = otherNode!.position!.y + Math.floor(otherNodeElement.offsetHeight / 2);

            // waypointsToAdd.push({
            //   waypoint: { x: secondWaypoint.x, y: firstWaypoint.y },
            //   index: firstWaypointIndex,
            // });
          } else {
            thirdLastWaypoint.x = otherNode!.position!.x;
            thirdLastWaypoint.y = otherNode!.position!.y + Math.floor(otherNodeElement.offsetHeight / 2);

            waypointsToAdd.push({
              waypoint: { x: secondLastWaypoint.x, y: thirdLastWaypoint.y },
              index: thirdLastWaypointIndex,
            });
          }

          // secondLastWaypoint.y = otherNode!.position!.y + Math.floor(otherNodeElement.offsetHeight / 2);
        }
      } else if (lastWaypoint.x === secondLastWaypoint.x) {
        lastWaypoint.x += draggableData.deltaX;
        lastWaypoint.y += draggableData.deltaY;
        secondLastWaypoint.x += draggableData.deltaX;

        if (numOfWaypoints > 3 && Math.abs(secondLastWaypoint.x - lastWaypoint.x) <= 8 && Math.abs(secondLastWaypoint.y - lastWaypoint.y) <= 8) {
          waypointIndicesToDelete.push(secondLastWaypointIndex);

          const nodeHeight = nodeElement.offsetHeight;

          lastWaypoint.x = node.position.x;
          lastWaypoint.y = node.position.y + nodeHeight / 2;

          if (thirdLastWaypoint) {
            thirdLastWaypoint.y = lastWaypoint.y;
          }
        }
      }

      console.log('firstWaypointIndex', firstWaypointIndex);
      console.log('lastWaypointIndex', lastWaypointIndex);
      console.log('secondLastWaypointIndex', secondLastWaypointIndex);
      console.log('thirdLastWaypointIndex', thirdLastWaypointIndex);

      edge.data.waypoints = edge.data.waypoints.map((waypoint, index) => {
        if (waypointIndicesToDelete.includes(index)) return;

        console.log('index', index);

        if (index === lastWaypointIndex) return lastWaypoint;

        if (index === secondLastWaypointIndex) return secondLastWaypoint;

        if (index === thirdLastWaypointIndex) return thirdLastWaypoint;

        if (index === firstWaypointIndex) return firstWaypoint;

        return waypoint;
      }).filter(Boolean);

      waypointsToAdd.forEach(waypointToAdd => {
        edge.data.waypoints.splice(waypointToAdd.index, 0, waypointToAdd.waypoint);
      });

      return edge;
    });

    setElements(newElements);
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
    snapToGrid={true}
    snapGrid={[8, 8]}
    onlyRenderVisibleElements={false}
    onNodeDrag={handleNodeDrag}
    onNodeDragStart={handleNodeDragStart}
  >
    <Background color="#aaa" gap={16} />
  </ReactFlow>;
}

export default WorkflowWithWaypoints;
