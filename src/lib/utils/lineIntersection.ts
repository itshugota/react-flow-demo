import findPathIntersections from 'path-intersection';
import { getPointDistance } from './geometry';
import Point from '../types/Point';

function circlePath(center: Point, radius: number) {
  var x = center.x,
      y = center.y;

  return [
    ['M', x, y],
    ['m', 0, -radius],
    ['a', radius, radius, 0, 1, 1, 0, 2 * radius],
    ['a', radius, radius, 0, 1, 1, 0, -2 * radius],
    ['z']
  ];
}

function linePath(points: Point[]) {
  const segments: (string | number)[][] = [];

  points.forEach((point, index) => {
    segments.push([ index === 0 ? 'M' : 'L', point.x, point.y ]);
  });

  return segments;
}

var INTERSECTION_THRESHOLD = 10;

function getBendpointIntersection(waypoints: Point[], reference: Point) {
  let waypoint;

  for (let index = 0; (waypoint = waypoints[index]); index++) {
    if (getPointDistance(waypoint, reference) <= INTERSECTION_THRESHOLD) {
      return {
        point: waypoints[index],
        bendpoint: true,
        index: index
      };
    }
  }

  return null;
}

function getPathIntersection(waypoints: Point[], reference: Point) {
  const intersections = findPathIntersections(circlePath(reference, INTERSECTION_THRESHOLD), linePath(waypoints));

  const firstIntersection = intersections[0];
  const lastIntersection = intersections[intersections.length - 1];
  let index;

  if (!firstIntersection) {

    // no intersection
    return null;
  }

  if (firstIntersection !== lastIntersection) {
    if (firstIntersection.segment2 !== lastIntersection.segment2) {
      // we use the bendpoint in between both segments
      // as the intersection point
      index = Math.max(firstIntersection.segment2, lastIntersection.segment2) - 1;

      return {
        point: waypoints[index],
        bendpoint: true,
        index: index
      };
    }

    return {
      point: {
        x: (Math.round(firstIntersection.x + lastIntersection.x) / 2),
        y: (Math.round(firstIntersection.y + lastIntersection.y) / 2)
      },
      index: firstIntersection.segment2
    };
  }

  return {
    point: {
      x: Math.round(firstIntersection.x),
      y: Math.round(firstIntersection.y)
    },
    index: firstIntersection.segment2
  };
}

/**
 * Returns the closest point on the connection towards a given reference point.
 *
 * @param  {Point[]} waypoints
 * @param  {Point} reference
 *
 * @return {Object} intersection data (segment, point)
 */
export function getApproxIntersection(waypoints: Point[], reference: Point) {
  return getBendpointIntersection(waypoints, reference) || getPathIntersection(waypoints, reference);
}
