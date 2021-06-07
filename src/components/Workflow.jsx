import React, { useEffect, useRef } from 'react';

import IntentNode from './nodes/IntentNode/IntentNode';
import StartNode from './nodes/StartNode/StartNode';
import ConditionNode from './nodes/ConditionNode/ConditionNode';
import ActionNode from './nodes/ActionNode/ActionNode';
import TerminateNode from './nodes/TerminateNode/TerminateNode';

import {
  DraggableReactFlowy,
  BackgroundVariant,
  Background,
  getSelectedElement,
  getOutEdges,
  useReactFlowyStore,
  nodesSelector,
  edgesSelector,
  registerGetDockingPointFunction,
  registerIsPointInShapeFunction,
  registerShapeAsTRBLFunction,
  addMarkerDefinition,
} from 'react-flowy/lib';
import Toolbar from './toolbar/Toolbar';
import StandardEdgeWithContextMenu from './edges/StandardEdgeWithContextMenu';
import { registerNodeDropValidator } from './sidebar/DraggableBlock';
import { getDockingPointForHexagon } from '../utils/docking';
import { isPointInHexagon } from '../utils/shape';
import { hexagonAsTRBL } from '../utils/trbl';
import ConditionEdgeWithContextMenu from './edges/ConditionEdgeWithContextMenu';
import EdgeWithStartIndicatorWithContextMenu from './edges/EdgeWithStartIndicatorWithContextMenu';

const nodeTypes = {
  startNode: StartNode,
  intentNode: IntentNode,
  conditionNode: ConditionNode,
  actionNode: ActionNode,
  terminateNode: TerminateNode,
};

const edgeTypes = {
  standardEdge: StandardEdgeWithContextMenu,
  conditionEdge: ConditionEdgeWithContextMenu,
  edgeWithStartIndicator: EdgeWithStartIndicatorWithContextMenu,
};

const graphElements = [
  {
    id: '0',
    type: 'startNode',
    position: {
      x: 80,
      y: 80,
    },
    shapeType: 'circle',
  },
  {
    id: '1',
    type: 'intentNode',
    data: {
      intent: 'intent-0',
    },
    position: {
      x: 80,
      y: 400,
    },
    shapeType: 'rectangle',
  },
  {
    id: '2',
    type: 'conditionNode',
    data: {
      conditions: [
        {
          parameterId: 'entity-0',
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
    shapeType: 'hexagon',
    shapeData: {
      topPeakHeight: 69,
      bottomPeakHeight: 69,
    },
  },
  {
    id: '3',
    type: 'actionNode',
    data: {
      action: 'action-0',
    },
    position: {
      x: 1120,
      y: 200,
    },
    shapeType: 'rectangle',
  },
  {
    id: '4',
    type: 'terminateNode',
    position: {
      x: 640,
      y: 600,
    },
    shapeType: 'circle',
  },
];

registerGetDockingPointFunction('hexagon')(getDockingPointForHexagon);
registerIsPointInShapeFunction('hexagon')(isPointInHexagon);
registerShapeAsTRBLFunction('hexagon')(hexagonAsTRBL);

const Workflow = () => {
  const nodes = useRef([]);
  const edges = useRef([]);
  const unselectAllElements = useReactFlowyStore(state => state.unselectAllElements);
  const deleteElementById = useReactFlowyStore(state => state.deleteElementById);
  const registerNodeValidator = useReactFlowyStore(state => state.registerNodeValidator);
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

  const handleKeyUp = e => {
    if (e.key === 'Escape') return unselectAllElements();

    if (e.key === 'Delete') {
      const selectedElement = getSelectedElement();

      if (selectedElement) {
        deleteElementById(selectedElement.id);
      }
    }
  }

  const handleLoad = (reactFlowInstance) => {
    addMarkerDefinition('react-flowy__thinarrow',
      <polyline
        className="react-flowy__thinarrow"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1"
        points="-10,-4 0,0 -10,4 -10,-4"
      />,
    );

    const savedElements = JSON.parse(localStorage.getItem('elements') || '[]');

    setElements(savedElements.length > 0 ? savedElements : graphElements);

    registerNodeValidator('intentNode')((sourceNode, targetNode) => {
      if (targetNode.id === sourceNode.id || targetNode.type === 'terminateNode' || targetNode.type === 'startNode')
        return { isValid: false, reason: 'Invalid target node' };

      const outcomingEdges = getOutEdges(sourceNode).filter(edge => edge.target !== targetNode.id);
      const firstConnectedNode = outcomingEdges.length > 0 ? nodes.current.find(node => node.id === outcomingEdges[0]?.target) : null;

      if (firstConnectedNode && (firstConnectedNode?.type === 'conditionNode' && targetNode.type !== 'conditionNode') ||
        (firstConnectedNode?.type === 'actionNode')
      )
        return { isValid: false, reason: 'There is already a connected edge' };

      return { isValid: true };
    });

    registerNodeValidator('conditionNode')((sourceNode, targetNode) => {
      if (targetNode.id === sourceNode.id || targetNode.type === 'terminateNode' || targetNode.type === 'startNode' || targetNode.type === 'intentNode')
        return { isValid: false, reason: 'Invalid target node' };

      const outcomingEdges = getOutEdges(sourceNode);

      if (outcomingEdges.length > 2) {
        return { isValid: false, reason: 'A condition node can only have two outcoming edges' };
      }

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

      return { isValid: true };
    });

    registerNodeDropValidator('startNode')((nodes, droppableNode) => {
      if (nodes.find(node => node.type === 'startNode')) return false;

      return true;
    });

    registerNodeDropValidator('terminateNode')((nodes, droppableNode) => {
      if (nodes.find(node => node.type === 'terminateNode')) return false;

      return true;
    });
  };

  const handleBackgroundClick = e => {
    unselectAllElements();
  };

  return <DraggableReactFlowy
    edgeTypes={edgeTypes}
    nodeTypes={nodeTypes}
    snapToGrid={true}
    snapGrid={[8, 8]}
    onLoad={handleLoad}
    onBackgroundClick={handleBackgroundClick}
  >
    <Toolbar />
    <Background color="#aaa" gap={32} variant={BackgroundVariant.Lines} />
  </DraggableReactFlowy>;
}

export default Workflow;
