import { isObject, sortBy } from 'min-dash';
import findPathIntersections from 'path-intersection';
import Intersection from '../types/Intersection';
import Orientation from '../types/Orientation';
import { Path } from '../types/Path';
import Point from '../types/Point';
import Rectangle from '../types/Rectangle';
import TRBL from '../types/TRBL';
import {
  getPointDistance,
  arePointsOnLine
} from '../utils/geometry';

export function roundRectangle(bounds: Rectangle) {
  return {
    x: Math.round(bounds.x),
    y: Math.round(bounds.y),
    width: Math.round(bounds.width),
    height: Math.round(bounds.height)
  };
}

export function roundPoint(point: Point) {
  return {
    x: Math.round(point.x),
    y: Math.round(point.y)
  };
}

/**
 * Convert the given bounds to a { top, left, bottom, right } descriptor.
 *
 * @param {Rectangle|Point} bounds
 *
 * @return {Object}
 */
export function asTRBL(bounds: Rectangle | Point) {
  return {
    top: bounds.y,
    right: bounds.x + ((bounds as Rectangle).width || 0),
    bottom: bounds.y + ((bounds as Rectangle).height || 0),
    left: bounds.x
  };
}

/**
 * Convert a { top, right, bottom, left } to an objects bounds.
 *
 * @param {TRBL} trbl
 *
 * @return {Rectangle}
 */
export function asRectangle(trbl: TRBL) {
  return {
    x: trbl.left,
    y: trbl.top,
    width: trbl.right - trbl.left,
    height: trbl.bottom - trbl.top
  };
}

/**
 * Get the mid of the given bounds or point.
 *
 * @param {Rectangle|Point} bounds
 *
 * @return {Point}
 */
export function getMidPoint(bounds: Rectangle | Point) {
  return roundPoint({
    x: bounds.x + ((bounds as Rectangle).width || 0) / 2,
    y: bounds.y + ((bounds as Rectangle).height || 0) / 2
  });
}

// orientation utils //////////////////////

/**
 * Get orientation of the given rectangle or point with respect to
 * the reference rectangle or point.
 *
 * A padding (positive or negative) may be passed to influence
 * horizontal / vertical orientation and intersection.
 *
 * @param {Rectangle|Point} source
 * @param {Rectangle|Point} reference
 * @param {Point|number} padding
 *
 * @return {Orientation} the orientation; one of top, top-left, left, ..., bottom, right or intersect.
 */
export function getOrientation(source: Rectangle | Point, reference: Rectangle | Point, padding: Point | number = 0): Orientation {
  // make sure we can use an object, too
  // for individual { x, y } padding
  if (!isObject(padding)) {
    padding = { x: padding, y: padding };
  }

  const rectOrientation = asTRBL(source);
  const referenceOrientation = asTRBL(reference);

  const top = rectOrientation.bottom + padding.y <= referenceOrientation.top;
  const right = rectOrientation.left - padding.x >= referenceOrientation.right;
  const bottom = rectOrientation.top - padding.y >= referenceOrientation.bottom;
  const left = rectOrientation.right + padding.x <= referenceOrientation.left;

  const vertical = top ? Orientation.TOP : (bottom ? Orientation.BOTTOM : null);
  const horizontal = left ? Orientation.LEFT : (right ? Orientation.RIGHT : null);

  if (horizontal && vertical) {
    return `${vertical}-${horizontal}` as Orientation;
  }

  return horizontal || vertical || Orientation.INTERSECT;
}

// intersection utils //////////////////////

/**
 * Get intersection between an element and a line path.
 *
 * @param {PathDef} elementPath
 * @param {PathDef} linePath
 * @param {boolean} isCropFromStart crop from start or end
 *
 * @return {Point}
 */
export function getElementLineIntersection(elementPath: any, linePath: any, isCropFromStart: boolean) {
  let intersections = getIntersections(elementPath, linePath);

  // recognize intersections
  // only one -> choose
  // two close together -> choose first
  // two or more distinct -> pull out appropriate one
  // none -> ok (fallback to point itself)
  if (intersections.length === 1) {
    return roundPoint(intersections[0]);
  }
  
  if (intersections.length === 2 && getPointDistance(intersections[0], intersections[1]) < 1) {
    return roundPoint(intersections[0]);
  }

  if (intersections.length > 1) {
    // sort by intersections based on connection segment +
    // distance from start
    intersections = sortBy(intersections, intersection => {
      let distance = Math.floor(intersection.t2 * 100) || 1;
      distance = 100 - distance;
      distance = Number((distance < 10 ? '0' : '')) + distance;

      // create a sort string that makes sure we sort
      // line segment ASC + line segment position DESC (for cropStart)
      // line segment ASC + line segment position ASC (for cropEnd)
      return intersection.segment2 + '#' + distance;
    });

    return roundPoint(intersections[isCropFromStart ? 0 : intersections.length - 1]);
  }

  return null;
}

export function getIntersections(pathA: Path, pathB: Path): Intersection[] {
  return findPathIntersections(pathA, pathB);
}

export function filterRedundantWaypoints(waypoints: Point[]) {
  // alter copy of waypoints, not original
  waypoints = waypoints.slice();

  var idx = 0,
      point,
      previousPoint,
      nextPoint;

  while (waypoints[idx]) {
    point = waypoints[idx];
    previousPoint = waypoints[idx - 1];
    nextPoint = waypoints[idx + 1];

    if (getPointDistance(point, nextPoint) === 0 ||
        arePointsOnLine(previousPoint, nextPoint, point)) {

      // remove point, if overlapping with {nextPoint}
      // or on line with {previousPoint} -> {point} -> {nextPoint}
      waypoints.splice(idx, 1);
    } else {
      idx++;
    }
  }

  return waypoints;
}
