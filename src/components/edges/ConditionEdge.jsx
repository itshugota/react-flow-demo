import React, { useMemo } from 'react';
import Tooltip from '@material-ui/core/Tooltip';

import { getRectangleFromNode, getSourceNode, isPointInShape, nodesSelector, StandardEdge, useReactFlowyStoreById } from 'react-flowy/lib';
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
    edge,
    storeId,
  }) => {
    const {
      id,
      label,
      source,
      target,
      waypoints,
      isInvalid,
    } = edge;
    const firstSegment = getFirstSegment(waypoints);
    const firstSegmentDirection = getSegmentDirection(firstSegment);
    const useReactFlowyStore = useReactFlowyStoreById(storeId);
    const nodes = useReactFlowyStore(nodesSelector);
    const sourceNode = getSourceNode(nodes)({ id, source, target, waypoints });
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
        <EdgeWithStartIndicator edge={edge} storeId={storeId} />
        {!isInvalid &&
          <g className="condition-edge__text-group">
            <g className="condition-edge__text-group__tooltip">
              <text style={{ fontWeight: 500, userSelect: 'none', pointerEvents: 'none' }} x={textX} y={textY}>MUHAHAHAHAHa</text>
            </g>
            <text style={{ fontWeight: 500, userSelect: 'none', pointerEvents: 'none' }} x={textX} y={textY}>{label}</text>
          </g>
        }
      </>
    );
  }
);
