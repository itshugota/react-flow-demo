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

const getSegmentDirection = segment => {
  if (segment.targetX === segment.sourceX) {
    if (segment.targetY > segment.sourceY) return 'vertical-bottom';
    if (segment.targetY < segment.sourceY) return 'vertical-top';
  }

  if (segment.targetX > segment.sourceX) return 'horizontal-right';
  if (segment.targetX < segment.sourceX) return 'horizontal-left';
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

    let textX;
    let textY;

    switch (firstSegmentDirection) {
      case 'vertical-top': {
        textX = waypoints[0].x + 12;
        textY = waypoints[0].y - 24;
        break;
      }
      case 'vertical-bottom': {
        textX = waypoints[0].x + 12;
        textY = waypoints[0].y + 24;
        break;
      }
      case 'horizontal-left': {
        textX = waypoints[0].x - 12 - label.length * 12;
        textY = waypoints[0].y - 12;
        break;
      }
      case 'horizontal-right': {
        textX = waypoints[0].x + 12;
        textY = waypoints[0].y - 12;
        break;
      }
      default:
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
