import React, { useState, useEffect, memo } from 'react';

import { EdgeProps, getMarkerEnd, useStoreState, useStoreActions } from 'react-flowy';
import { activateBendpointMove, Context, handleMouseMoveWithContext } from '../../lib/bendpoints/connectionSegmentMove';
import { getApproxIntersection } from '../../lib/utils/lineIntersection';
import { isPrimaryButton } from '../../lib/utils/mouse';
import Connection from '../../lib/types/Connection';
import { getRectangleByNodeId } from '../../utils/node';
import { eventPointToCanvasCoordinates } from '../../lib/utils/coordinates';
import Canvas from '../../lib/types/Canvas';
import ApproxIntersection from '../../lib/types/ApproxIntersection';
import Axis from '../../lib/types/Axis';

export interface EdgeWaypoint {
  x: number;
  y: number;
}

const getEdgeSegmentsFromWaypoints = (waypoints: EdgeWaypoint[]) => {
  const pair = [];

  for (let index = 0; index < waypoints.length - 1; index++) {
    pair.push({
      sourceX: waypoints[index].x,
      sourceY: waypoints[index].y,
      targetX: waypoints[index + 1].x,
      targetY: waypoints[index + 1].y
    });
  }

  return pair;
}

let mousemoveTimeout: number;
let eventDelta = { x: 0, y: 0 };

export default memo(
  ({
    id,
    data,
    style,
    arrowHeadType,
    source,
    target,
    markerEndId,
  }: EdgeProps) => {
    const markerEnd = getMarkerEnd(arrowHeadType, markerEndId);
    const segments = getEdgeSegmentsFromWaypoints(data.waypoints as EdgeWaypoint[]);
    const canvasTransform = useStoreState(state => state.transform);
    const nodes = useStoreState(state => state.nodes);
    const edges = useStoreState(state => state.edges);
    const setElements = useStoreActions(actions => actions.setElements);
    const [context, setContext] = useState<Context>();

    const handleMouseDown = (e: React.MouseEvent) => {
      if (!isPrimaryButton(e.nativeEvent)) return;

      const canvas: Canvas = {
        position: {
          x: canvasTransform[0],
          y: canvasTransform[1],
        },
        scale: canvasTransform[2],
      };
      const connection: Connection = {
        waypoints: data.waypoints,
        source: getRectangleByNodeId(nodes)(source),
        target: getRectangleByNodeId(nodes)(target),
      };
      const intersection = getApproxIntersection(data.waypoints, eventPointToCanvasCoordinates(e.nativeEvent)(canvas)) as ApproxIntersection;
      const newContext = activateBendpointMove(connection, intersection);
      eventDelta = { x: 0, y: 0 };
      console.log('newContext', newContext);
      setContext(newContext);
    }

    useEffect(() => {
      document.addEventListener('mouseup', handleMouseUp);

      return () => document.removeEventListener('mouseup', handleMouseUp);
    }, []);

    const handleMouseUp = () => {
      setContext(undefined);
    }

    useEffect(() => {
      document.addEventListener('mousemove', handleMouseMove);

      return () => document.removeEventListener('mousemove', handleMouseMove);
    }, [context, nodes, edges, canvasTransform]);

    const handleMouseMove = (event: MouseEvent) => {
      if (!context) return;

      if (mousemoveTimeout) clearTimeout(mousemoveTimeout);

      if (context.axis === Axis.X) {
        eventDelta.x += event.movementX / canvasTransform[2];
      } else if (context.axis === Axis.Y) {
        eventDelta.y += event.movementY / canvasTransform[2];
      }

      const modifiedEvent = { ...event };

      modifiedEvent.movementX = eventDelta.x;
      modifiedEvent.movementY = eventDelta.y;

      const newConnection = handleMouseMoveWithContext(modifiedEvent)(context as Context);

      const newEdges = edges.map(edge => {
        if (edge.id !== id) return edge;

        edge.data = { waypoints: newConnection.waypoints };

        return edge;
      });

      setElements([...nodes, ...newEdges]);
    }

    return (
      <>
        {segments.map((segment, index) => (
          <React.Fragment 
            key={JSON.stringify(segment)}
          >
            <path
              style={style}
              className="react-flow__edge-path"
              d={`M ${segment.sourceX},${segment.sourceY}L ${segment.targetX},${segment.targetY}`}
              markerEnd={index === segments.length - 1 ? markerEnd : undefined}
            />
            <path
              style={{ fill: 'none', strokeOpacity: 0, stroke: 'white', strokeWidth: 15, cursor: segment.sourceX === segment.targetX ? 'ew-resize' : 'ns-resize' }}
              d={`M ${segment.sourceX},${segment.sourceY}L ${segment.targetX},${segment.targetY}`}
              onMouseDown={handleMouseDown}
            />
          </React.Fragment>
        ))}
      </>
    );
  }
);
