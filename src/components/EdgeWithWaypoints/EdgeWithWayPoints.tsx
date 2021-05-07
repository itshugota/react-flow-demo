import React, { memo } from 'react';

import { EdgeProps, getMarkerEnd } from 'react-flow-renderer';

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

export default memo(
  ({
    data,
    style,
    arrowHeadType,
    markerEndId,
  }: EdgeProps) => {
    const markerEnd = getMarkerEnd(arrowHeadType, markerEndId);
    const segments = getEdgeSegmentsFromWaypoints(data.waypoints as EdgeWaypoint[]);

    return (
      <>
        {segments.map((segment, index) => (
          <path
            style={style}
            className="react-flow__edge-path"
            d={`M ${segment.sourceX},${segment.sourceY}L ${segment.targetX},${segment.targetY}`}
            markerEnd={index === segments.length - 1 ? markerEnd : undefined}
          />
        ))}
      </>
    );
  }
);
