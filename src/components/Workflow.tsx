import React, { useEffect, useRef } from 'react';

import IntentNode from './nodes/IntentNode/IntentNode';
import StartNode from './nodes/StartNode/StartNode';
import ConditionNode from './nodes/ConditionNode/ConditionNode';
import ActionNode from './nodes/ActionNode/ActionNode';
import TerminateNode from './nodes/TerminateNode/TerminateNode';

import ReactFlowy, {
  ReactFlowyProps,
  BackgroundVariant,
  Background,
  getRectangleByNodeId,
  getNodeById,
  repairConnection,
  StandardEdge,
  Elements,
  getSelectedElement,
  getOutEdges,
  useReactFlowyStore,
  nodesSelector,
  edgesSelector,
  Node,
  Edge,
} from 'react-flowy/lib';
import Toolbar from './toolbar/Toolbar';

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

const Workflow = () => {
  const nodes = useRef<Node[]>([]);
  const edges = useRef<Edge[]>([]);
  const unselectAllElements = useReactFlowyStore(state => state.unselectAllElements);
  const deleteElementById = useReactFlowyStore(state => state.deleteElementById);
  const registerNodeValidator = useReactFlowyStore(state => state.registerNodeValidator);
  const upsertEdge = useReactFlowyStore(state => state.upsertEdge);
  const setElements = useReactFlowyStore(state => state.setElements);

  useEffect(() => {
    useReactFlowyStore.subscribe(edgesFromStore => {
      edges.current = edgesFromStore;
    }, edgesSelector);

    useReactFlowyStore.subscribe(nodesFromStore => {
      nodes.current = nodesFromStore;
    }, nodesSelector);
  }, []);

  useEffect(() => {
    document.addEventListener('keyup', handleKeyUp);

    return () => document.removeEventListener('keyup', handleKeyUp);
  }, []);

  const handleKeyUp = (e: KeyboardEvent) => {
    if (e.key === 'Escape') return unselectAllElements();

    if (e.key === 'Delete') {
      const selectedElement = getSelectedElement();

      if (selectedElement) {
        deleteElementById(selectedElement.id);
      }
    }
  }

  const handleLoad: ReactFlowyProps['onLoad'] = (reactFlowInstance) => {
    console.log(reactFlowInstance.toObject());
    setElements(graphElements);

    registerNodeValidator('intentNode')((sourceNode, targetNode) => {
      if (targetNode.id === sourceNode.id || targetNode.type === 'terminateNode' || targetNode.type === 'startNode')
        return { isValid: false, reason: 'Invalid target node' };

      if (getOutEdges(sourceNode).length > 1)
        return { isValid: false, reason: 'There is already a connected edge' };

      return { isValid: true };
    });

    registerNodeValidator('conditionNode')((sourceNode, targetNode) => {
      if (targetNode.id === sourceNode.id || targetNode.type === 'terminateNode' || targetNode.type === 'startNode' || targetNode.type === 'intentNode')
        return { isValid: false, reason: 'Invalid target node' };

      return { isValid: true };
    });

    registerNodeValidator('actionNode')((sourceNode, targetNode) => {
      if (targetNode.id === sourceNode.id || targetNode.type === 'startNode' || targetNode.type === 'conditionNode')
        return { isValid: false, reason: 'Invalid target node' };

      if (getOutEdges(sourceNode).length > 1)
        return { isValid: false, reason: 'There is already a connected edge' };

      return { isValid: true };
    });

    registerNodeValidator('startNode')((sourceNode, targetNode) => {
      if (targetNode.id === sourceNode.id || targetNode.type === 'terminateNode' || targetNode.type === 'conditionNode')
        return { isValid: false, reason: 'Invalid target node' };

      if (getOutEdges(sourceNode).length > 1)
        return { isValid: false, reason: 'There is already a connected edge' };

      return { isValid: true };
    });
  };

  const handleNodeDrag: ReactFlowyProps['onNodeDrag'] = (event, node, dragDelta) => {
    const elements = [...nodes.current, ...edges.current];

    edges.current.forEach(edge => {
      if (edge.target !== node.id && edge.source !== node.id) return edge;

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

      upsertEdge({ ...edge, isDragging: true, waypoints: edge.source === node.id ?
        repairConnection(nodeRectangle, otherNodeRectangle, newStart, undefined, edge.waypoints, { connectionStart: true }) :
        repairConnection(otherNodeRectangle, nodeRectangle, undefined, newEnd, edge.waypoints, { connectionEnd: true })
      });
    });
  };

  const handleNodeDragStop: ReactFlowyProps['onNodeDragStop'] = (event, node) => {
    edges.current.forEach(edge => {
      if (edge.target !== node.id && edge.source !== node.id) return edge;

      if (edge.isDragging) upsertEdge({ ...edge, isDragging: false });
    });
  };

  const handleBackgroundClick = (e: React.MouseEvent) => {
    unselectAllElements();
  }

  return <ReactFlowy
    edgeTypes={edgeTypes}
    nodeTypes={nodeTypes}
    snapToGrid={true}
    snapGrid={[8, 8]}
    onLoad={handleLoad}
    onNodeDrag={handleNodeDrag}
    onNodeDragStop={handleNodeDragStop}
    onBackgroundClick={handleBackgroundClick}
  >
    <Toolbar />
    <Background color="#aaa" gap={32} variant={BackgroundVariant.Lines} />
  </ReactFlowy>;
}

export default Workflow;
