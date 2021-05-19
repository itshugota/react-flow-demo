import React, { useState, useEffect, memo } from 'react';

import { EdgeProps, getMarkerEnd, useStoreState, useStoreActions } from 'react-flowy';
import { activateBendpointMove, Context, handleMouseMoveEndWithContext, handleMouseMoveWithContext } from '../../lib/bendpoints/connectionSegmentMove';
import { getApproxIntersection } from '../../lib/utils/lineIntersection';
import { isPrimaryButton } from '../../lib/utils/mouse';
import Connection from '../../lib/types/Connection';
import { getRectangleByNodeId } from '../../utils/node';
import { eventPointToCanvasCoordinates } from '../../lib/utils/coordinates';
import ApproxIntersection from '../../lib/types/ApproxIntersection';
import Axis from '../../lib/types/Axis';
import { getConnectionPath } from '../../lib/layout/utils';
import { getCanvasFromTransform } from '../../utils/canvas';

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
    const [isBendpointMoveActive, setIsBendpointMoveActive] = useState(false);

    useEffect(() => {
      if (!isBendpointMoveActive) return;

      document.addEventListener('mouseup', handleMouseUp);

      return () => document.removeEventListener('mouseup', handleMouseUp);
    }, [context, isBendpointMoveActive]);

    useEffect(() => {
      if (!isBendpointMoveActive) return;

      document.addEventListener('mousemove', handleMouseMove);

      return () => document.removeEventListener('mousemove', handleMouseMove);
    }, [context, nodes, edges, canvasTransform, isBendpointMoveActive]);

    const handleMouseDown = (e: React.MouseEvent) => {
      if (!isPrimaryButton(e.nativeEvent)) return;

      const canvas = getCanvasFromTransform(canvasTransform);
      const connection: Connection = {
        waypoints: data.waypoints,
        source: getRectangleByNodeId(nodes)(source),
        target: getRectangleByNodeId(nodes)(target),
      };
      const intersection = getApproxIntersection(data.waypoints, eventPointToCanvasCoordinates(e.nativeEvent)(canvas)) as ApproxIntersection;
      const newContext = activateBendpointMove(connection, intersection);

      eventDelta = { x: 0, y: 0 };

      setContext(newContext);
      setIsBendpointMoveActive(true);
    }

    const updateElementsAndContext = (newConnection: Connection, newContext: Context) => {
      const newEdges = edges.map(edge => {
        if (edge.id !== id) return edge;

        edge.data = { waypoints: newConnection.waypoints };

        return edge;
      });

      setElements([...nodes, ...newEdges]);
      setContext(newContext);
    }

    const handleMouseUp = () => {
      if (!isBendpointMoveActive) return;

      setIsBendpointMoveActive(false);

      const { newConnection, newContext } = handleMouseMoveEndWithContext(context!);

      updateElementsAndContext(newConnection, newContext);
    }

    const handleMouseMove = (event: MouseEvent) => {
      if (!context || !isBendpointMoveActive) return;

      if (mousemoveTimeout) clearTimeout(mousemoveTimeout);

      if (context.axis === Axis.X) {
        eventDelta.x += Math.round(event.movementX / canvasTransform[2]);
      } else if (context.axis === Axis.Y) {
        eventDelta.y += Math.round(event.movementY / canvasTransform[2]);
      }

      const modifiedEvent = { ...event };

      modifiedEvent.movementX = eventDelta.x;
      modifiedEvent.movementY = eventDelta.y;

      const { newConnection, newContext } = handleMouseMoveWithContext(modifiedEvent)(context as Context);

      updateElementsAndContext(newConnection, newContext);
    }

    return (
      <>
        <path
          style={style}
          className="react-flow__edge-path"
          d={getConnectionPath({ waypoints: data.waypoints }) as string}
          markerEnd={markerEnd}
        />
        {segments.map(segment => (
          <polyline
            key={JSON.stringify(segment)}
            style={{ fill: 'none', strokeOpacity: 0, stroke: 'white', strokeWidth: 15, cursor: segment.sourceX === segment.targetX ? 'ew-resize' : 'ns-resize' }}
            points={`${segment.sourceX} ${segment.sourceY}, ${segment.targetX} ${segment.targetY}`}
            onMouseDown={handleMouseDown}
          />
        ))}
      </>
    );
  }
);
