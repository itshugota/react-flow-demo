import React, { useMemo } from 'react';
import clsx from 'clsx';

import { getMarkerEnd, getPathFromWaypoints, getRectangleFromNode, getSourceNode, isPointInShape, StandardEdgeController } from 'react-flowy/lib';

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
    const sourceNode = getSourceNode({ id, source, target, waypoints });
    const shape = { ...getRectangleFromNode(sourceNode), ...sourceNode.shapeData };

    const { textX, textY } = useMemo(() => {
      const labelSize = label.length * 12;

      switch (firstSegmentDirection) {
        case 'vertical-top': {
          return { textX: waypoints[0].x + 12, textY: waypoints[0].y - 24 };
        }
        case 'vertical-bottom': {
          return { textX: waypoints[0].x + 12, textY: waypoints[0].y + 24 };
        }
        case 'horizontal-left': {
          let textX = waypoints[0].x - 12 - labelSize;
          let textY = waypoints[0].y - 12;

          if (isPointInShape(sourceNode.shapeType)({ x: textX + labelSize, y: textY }, shape)) {
            textY = waypoints[0].y + 24;
          }

          return { textX, textY };
        }
        case 'horizontal-right': {
          let textX = waypoints[0].x + 12;
          let textY = waypoints[0].y - 12;

          if (isPointInShape(sourceNode.shapeType)({ x: textX, y: textY }, shape)) {
            textY = waypoints[0].y + 24;
          }

          return { textX, textY };
        }
        default:
          return { textX: waypoints[0].x, textY: waypoints[0].y };
      }
    }, [waypoints, sourceNode.shapeType, shape]);

    return (
      <>
        <path
          style={style}
          className={clsx(
            'react-flowy__edge-path',
            isForming ? 'react-flowy__edge-path--forming' : '',
            isSelected ? 'react-flowy__edge-path--selected' : '',
            isInvalid ? 'react-flowy__edge-path--invalid' : '',
          )}
          d={getPathFromWaypoints(waypoints)}
          markerEnd={isInvalid ? errorMarkerEnd : markerEnd}
        />
        {!isInvalid && <text style={{ fontWeight: 500, userSelect: 'none', pointerEvents: 'none' }} x={textX} y={textY}>{label}</text>}
        {!isForming && <StandardEdgeController id={id} source={source} target={target} waypoints={waypoints} />}
      </>
    );
  }
);
