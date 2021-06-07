import React, { useMemo } from 'react';

import { getRectangleFromNode, getSourceNode, isPointInShape, StandardEdge } from 'react-flowy/lib';
import EdgeWithStartIndicator from './EdgeWithStartIndicator';

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
    label,
    source,
    target,
    waypoints,
    isInvalid,
    ...rest
  }) => {
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
        <EdgeWithStartIndicator id={id} label={label} source={source} target={target} waypoints={waypoints} isInvalid={isInvalid} {...rest} />
        {!isInvalid && <text style={{ fontWeight: 500, userSelect: 'none', pointerEvents: 'none' }} x={textX} y={textY}>{label}</text>}
      </>
    );
  }
);
