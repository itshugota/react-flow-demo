import { useEffect, useRef } from 'react';
import {
  connectShapes,
  getInEdges,
  getOutEdges,
  getRectangleFromNode,
  getSourceNode,
  getTargetNode,
  useReactFlowyStore
} from 'react-flowy/lib';

const useEnsureEdgePositions = node => {
  const previousNodeHeight = useRef(node.height);
  const upsertEdge = useReactFlowyStore(state => state.upsertEdge);

  useEffect(() => {
    if (!previousNodeHeight.current) {
      previousNodeHeight.current = node.height;

      return;
    }

    if (node.height < previousNodeHeight.current) {
      getOutEdges(node).forEach(outcomingEdge => {
        if (outcomingEdge.waypoints[0].y <= node.position.y + node.height) return;

        const targetNode = getTargetNode(outcomingEdge);
        const newWaypoints = connectShapes({ ...getRectangleFromNode(node), ...node.shapeData }, { ...getRectangleFromNode(targetNode), ...targetNode.shapeData }, node.shapeType, targetNode.shapeType);

        upsertEdge({ ...outcomingEdge, waypoints: newWaypoints });
      });

      getInEdges(node).forEach(incomingEdge => {
        if (incomingEdge.waypoints[incomingEdge.waypoints.length - 1].y <= node.position.y + node.height) return;

        const sourceNode = getSourceNode(incomingEdge);
        const newWaypoints = connectShapes({ ...getRectangleFromNode(sourceNode), ...sourceNode.shapeData }, { ...getRectangleFromNode(node), ...node.shapeData }, sourceNode.shapeType, node.shapeType);

        upsertEdge({ ...incomingEdge, waypoints: newWaypoints });
      });
    } else {
      getOutEdges(node).forEach(outcomingEdge => {
        if (outcomingEdge.waypoints[0].y < node.position.y + previousNodeHeight.current) return;
        const targetNode = getTargetNode(outcomingEdge);
        const newWaypoints = connectShapes({ ...getRectangleFromNode(node), ...node.shapeData }, { ...getRectangleFromNode(targetNode), ...targetNode.shapeData }, node.shapeType, targetNode.shapeType);

        upsertEdge({ ...outcomingEdge, waypoints: newWaypoints });
      });

      getInEdges(node).forEach(incomingEdge => {
        if (incomingEdge.waypoints[incomingEdge.waypoints.length - 1].y < node.position.y + previousNodeHeight.current) return;

        const sourceNode = getSourceNode(incomingEdge);
        const newWaypoints = connectShapes({ ...getRectangleFromNode(sourceNode), ...sourceNode.shapeData }, { ...getRectangleFromNode(node), ...node.shapeData }, sourceNode.shapeType, node.shapeType);

        upsertEdge({ ...incomingEdge, waypoints: newWaypoints });
      });
    }

    previousNodeHeight.current = node.height;
  }, [node.height]);
};

export default useEnsureEdgePositions;
