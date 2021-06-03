import React from 'react';
import cc from 'classcat';

import { getMarkerEnd, getPathFromWaypoints, StandardEdgeController } from 'react-flowy/lib';

const getFirstSegment = waypoints => {
  if (waypoints.length < 2) return null;

  return {
    sourceX: waypoints[0].x,
    sourceY: waypoints[0].y,
    targetX: waypoints[1].x,
    targetY: waypoints[1].y,
  };
};

const getSecondSegment = waypoints => {
  if (waypoints.length < 3) return null;

  return {
    sourceX: waypoints[1].x,
    sourceY: waypoints[1].y,
    targetX: waypoints[2].x,
    targetY: waypoints[2].y,
  };
};

const getSegmentDirection = segment => {
  if (segment.targetX === segment.sourceX) return 'vertical';

  return 'horizontal';
};

export default React.memo(
  ({
    id,
    style,
    arrowHeadType,
    label,
    source,
    target,
    waypoints,
    isForming,
    isSelected,
    isInvalid,
  }) => {
    const markerEnd = getMarkerEnd(arrowHeadType);
    const errorMarkerEnd = getMarkerEnd(`${arrowHeadType}--error`);

    const firstSegment = getFirstSegment(waypoints);
    const firstSegmentDirection = getSegmentDirection(firstSegment);
    const secondSegment = getSecondSegment(waypoints);

    let textX = waypoints[0].x + 12;
    let textY = firstSegmentDirection === 'vertical' ? waypoints[0].y + 24 : waypoints[0].y - 12;

    if (secondSegment) {
      if (firstSegmentDirection === 'horizontal' && secondSegment.sourceX <= textX + label.length * 12 && secondSegment.targetY < secondSegment.sourceY) {
        textY = waypoints[0].y + 24;
      } else if (firstSegmentDirection === 'vertical' && secondSegment.sourceY <= textY + 24) {
        textX = waypoints[0].x - (label.length * 12);
      }
    }

    return (
      <>
        <path
          style={style}
          className={cc([
            'react-flowy__edge-path',
            {
              'react-flowy__edge-path--forming': isForming,
              'react-flowy__edge-path--selected': isSelected,
              'react-flowy__edge-path--invalid': isInvalid,
            }
          ])}
          d={getPathFromWaypoints(waypoints)}
          markerEnd={isInvalid ? errorMarkerEnd : markerEnd}
        />
        {!isInvalid && <text style={{ fontWeight: 500, userSelect: 'none', pointerEvents: 'none' }} x={textX} y={textY}>{label}</text>}
        {!isForming && <StandardEdgeController id={id} source={source} target={target} waypoints={waypoints} />}
      </>
    );
  }
);
