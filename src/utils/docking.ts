import findPathIntersections from 'path-intersection';
import { getLinePath, Point, Shape } from 'react-flowy/lib';

export const getDockingPointForHexagon = (point: Point, shape: Shape, detailedDockingDirection: 't' | 'r' | 'b' | 'l') => {
  // shape.topPeakHeight shape.bottomPeakHeight

  const topPeak = { x: shape.x + shape.width / 2, y: shape.y - shape.topPeakHeight };
  const topLeftPeak = { x: shape.x, y: shape.y };
  const topRightPeak = { x: shape.x + shape.width, y: shape.y };
  const bottomPeak = { x: shape.x + shape.width / 2, y: shape.y + shape.height + shape.bottomPeakHeight };
  const bottomLeftPeak = { x: shape.x, y: shape.y + shape.height };
  const bottomRightPeak = { x: shape.x + shape.width, y: shape.y + shape.height };

  if (detailedDockingDirection === 't') {
    const otherPoint = { x: point.x, y: point.y - shape.topPeakHeight * 2 - shape.height };
    const intersections = findPathIntersections(getLinePath([point, otherPoint]), getLinePath([topLeftPeak, topPeak, topRightPeak]));

    return {
      dockingPoint: { original: point, ...{ x: intersections[0].x, y: intersections[0].y } },
      direction: 't',
    };
  }

  if (detailedDockingDirection === 'r') {
    if (point.y >= shape.y && point.y <= shape.y + shape.height) {
      return {
        dockingPoint: { original: point, x: shape.x + shape.width, y: point.y },
        direction: 'r',
      };
    }

    const otherPoint = { x: point.x + shape.width, y: point.y };

    if (point.y < shape.y) {
      const intersections = findPathIntersections(getLinePath([point, otherPoint]), getLinePath([topLeftPeak, topPeak, topRightPeak]));

      return {
        dockingPoint: { original: point, ...{ x: intersections[0].x, y: intersections[0].y } },
        direction: 'r',
      };
    }

    if (point.y > shape.y + shape.height) {
      const intersections = findPathIntersections(getLinePath([point, otherPoint]), getLinePath([bottomLeftPeak, bottomPeak, bottomRightPeak]));

      return {
        dockingPoint: { original: point, ...{ x: intersections[0].x, y: intersections[0].y } },
        direction: 'r',
      };
    }
  }

  if (detailedDockingDirection === 'b') {
    const otherPoint = { x: point.x, y: point.y + shape.topPeakHeight * 2 + shape.height };
    const intersections = findPathIntersections(getLinePath([point, otherPoint]), getLinePath([bottomLeftPeak, bottomPeak, bottomRightPeak]));

    return {
      dockingPoint: { original: point, ...{ x: intersections[0].x, y: intersections[0].y } },
      direction: 'b',
    };
  }

  if (detailedDockingDirection === 'l') {
    if (point.y >= shape.y && point.y <= shape.y + shape.height) {
      return {
        dockingPoint: { original: point, x: shape.x, y: point.y },
        direction: 'l',
      };
    }

    const otherPoint = { x: point.x - shape.width, y: point.y };

    if (point.y < shape.y) {
      const intersections = findPathIntersections(getLinePath([point, otherPoint]), getLinePath([topLeftPeak, topPeak, topRightPeak]));

      return {
        dockingPoint: { original: point, ...{ x: intersections[0].x, y: intersections[0].y } },
        direction: 'l',
      };
    }

    if (point.y > shape.y + shape.height) {
      const intersections = findPathIntersections(getLinePath([point, otherPoint]), getLinePath([bottomLeftPeak, bottomPeak, bottomRightPeak]));

      return {
        dockingPoint: { original: point, ...{ x: intersections[0].x, y: intersections[0].y } },
        direction: 'l',
      };
    }
  }

  throw new Error('Unexpected dockingDirection: <' + detailedDockingDirection + '>');
}
