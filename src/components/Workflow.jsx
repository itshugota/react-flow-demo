import React, { useEffect, useRef } from 'react';

import IntentNode from './nodes/IntentNode/IntentNode';
import StartNode from './nodes/StartNode/StartNode';
import ConditionNode from './nodes/ConditionNode/ConditionNode';
import ActionNode from './nodes/ActionNode/ActionNode';
import TerminateNode from './nodes/TerminateNode/TerminateNode';
import elements from './elements.json';

import {
  DraggableReactFlowy,
  BackgroundVariant,
  Background,
  getSelectedElement,
  getOutgoingEdges,
  useReactFlowyStoreById,
  nodesSelector,
  edgesSelector,
  registerGetDockingPointFunction,
  registerIsPointInShapeFunction,
  registerShapeAsTRBLFunction,
  addMarkerDefinition
} from 'react-flowy/lib';
import StandardEdgeWithContextMenu from './edges/StandardEdgeWithContextMenu';
import { registerNodeDropValidator } from './sidebar/DraggableBlock';
import { getDockingPointForHexagon } from '../utils/docking';
import { isPointInHexagon } from '../utils/shape';
import { hexagonAsTRBL } from '../utils/trbl';
import ConditionEdgeWithContextMenu from './edges/ConditionEdgeWithContextMenu';
import EdgeWithStartIndicatorWithContextMenu from './edges/EdgeWithStartIndicatorWithContextMenu';
import BaseWorkflowNode from './nodes/BaseWorkflowNode/BaseWorkflowNode';
import { isNodeInLoop } from '../utils/nodes';
import '../state/ensureCorrectState';
import { trackStatus } from '../store/status.store';

const nodeTypes = {
  startNode: StartNode,
  intentNode: IntentNode,
  conditionNode: ConditionNode,
  actionNode: ActionNode,
  terminateNode: TerminateNode,
  baseWorkflowNode: BaseWorkflowNode,
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
  }
];

registerGetDockingPointFunction('hexagon')(getDockingPointForHexagon);
registerIsPointInShapeFunction('hexagon')(isPointInHexagon);
registerShapeAsTRBLFunction('hexagon')(hexagonAsTRBL);

const Workflow = ({ storeId }) => {
  const nodes = useRef([]);
  const edges = useRef([]);
  const useReactFlowyStore = useReactFlowyStoreById(storeId);
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
    trackStatus(storeId);
    document.addEventListener('keyup', handleKeyUp);

    return () => document.removeEventListener('keyup', handleKeyUp);
  }, []);

  const handleKeyUp = e => {
    if (e.key === 'Escape') return unselectAllElements();

    if (e.key === 'Delete') {
      const selectedElement = getSelectedElement([...nodes.current, ...edges.current]);

      if (selectedElement) {
        deleteElementById(selectedElement.id);
      }
    }
  }

  const handleLoad = () => {
    addMarkerDefinition('react-flowy__thinarrow',
      <polyline
        className="react-flowy__thinarrow"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1"
        points="-10,-4 0,0 -10,4 -10,-4"
      />
    );

    addMarkerDefinition('react-flowy__thinarrow--error',
      <polyline
        className="react-flowy__thinarrow--error"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1"
        points="-10,-4 0,0 -10,4 -10,-4"
      />
    );

    const savedElements = JSON.parse(localStorage.getItem('elements'));

    setElements(savedElements.length > 20 ? savedElements : elements);

    registerNodeValidator('intentNode')((sourceNode, targetNode) => {
      if (targetNode.id === sourceNode.id || targetNode.type === 'terminateNode' || targetNode.type === 'startNode')
        return { isValid: false, reason: 'Invalid target node' };

      return { isValid: true };
    });

    registerNodeValidator('conditionNode')((sourceNode, targetNode) => {
      if (targetNode.id === sourceNode.id || targetNode.type === 'terminateNode' || targetNode.type === 'startNode' || targetNode.type === 'intentNode')
        return { isValid: false, reason: 'Invalid target node' };

      const outcomingEdges = getOutgoingEdges(edges.current)(sourceNode);

      const isInLoop = isNodeInLoop(sourceNode);

      if (!isInLoop && outcomingEdges.length > 2) {
        return { isValid: false, reason: 'A condition node can only have two outcoming edges' };
      }

      if (isInLoop && outcomingEdges.length > 3) {
        return { isValid: false, reason: 'A condition node in a loop can only have three outcoming edges' };
      }

      return { isValid: true };
    });

    registerNodeValidator('actionNode')((sourceNode, targetNode) => {
      if (targetNode.id === sourceNode.id || targetNode.type === 'startNode')
        return { isValid: false, reason: 'Invalid target node' };

      return { isValid: true };
    });

    registerNodeValidator('startNode')((sourceNode, targetNode) => {
      if (targetNode.id === sourceNode.id || targetNode.type === 'terminateNode' || targetNode.type === 'conditionNode')
        return { isValid: false, reason: 'Invalid target node' };

      return { isValid: true };
    });

    registerNodeValidator('baseWorkflowNode')((sourceNode, targetNode) => {
      if (targetNode.id === sourceNode.id || targetNode.type === 'startNode')
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

  const handleBackgroundClick = () => {
    unselectAllElements();
  };

  return <DraggableReactFlowy
    edgeTypes={edgeTypes}
    nodeTypes={nodeTypes}
    snapToGrid={true}
    snapGrid={[8, 8]}
    onLoad={handleLoad}
    onBackgroundClick={handleBackgroundClick}
    storeId={storeId}
  >
    <Background color="#aaa" gap={32} variant={BackgroundVariant.Lines} storeId={storeId} />
  </DraggableReactFlowy>;
}

export default Workflow;
