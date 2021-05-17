import {
  every,
  isArray
} from 'min-dash';
import Point from '../types/Point';
import Rectangle from '../types/Rectangle';

/**
 * Computes the distance between two points
 *
 * @param  {Point}  p
 * @param  {Point}  q
 *
 * @return {number}  distance
 */
export function getPointDistance(a: Point, b: Point) {
  if (!a || !b) {
    return -1;
  }

  return Math.sqrt(
    Math.pow(a.x - b.x, 2) +
    Math.pow(a.y - b.y, 2)
  );
}


/**
 * Returns true if the point r is on the line between p and q
 *
 * @param  {Point}  p
 * @param  {Point}  q
 * @param  {Point}  r
 * @param  {number} [accuracy=5] accuracy for points on line check (lower is better)
 *
 * @return {boolean}
 */
export function arePointsOnLine(p: Point, q: Point, r: Point, accuracy: number = 5) {
  if (!p || !q || !r) {
    return false;
  }

  const val = (q.x - p.x) * (r.y - p.y) - (q.y - p.y) * (r.x - p.x);
  const dist = getPointDistance(p, q);

  // @see http://stackoverflow.com/a/907491/412190
  return Math.abs(val / dist) <= accuracy;
}


const ALIGNED_THRESHOLD = 2;

/**
 * Check whether two points are horizontally or vertically aligned.
 *
 * @param {Array<Point>|Point}
 * @param {Point}
 *
 * @return {string|boolean}
 */
export function arePointsAligned(a: Point[] | Point, b?: Point) {
  const points = isArray(a) ? a : [a, b] as Point[];

  if (arePointsAlignedHorizontally(points)) {
    return 'h';
  }

  if (arePointsAlignedVertically(points)) {
    return 'v';
  }

  return false;
}

export function arePointsAlignedHorizontally(a: Point[] | Point, b?: Point) {
  const points = isArray(a) ? a : [a, b] as Point[];
  const firstPoint = points.slice().shift() as Point;

  return every(points, (point: Point) => {
    return Math.abs(firstPoint.y - point.y) <= ALIGNED_THRESHOLD;
  });
}

export function arePointsAlignedVertically(a: Point[] | Point, b?: Point) {
  const points = isArray(a) ? a : [a, b] as Point[];
  const firstPoint = points.slice().shift() as Point;

  return every(points, (point: Point) => {
    return Math.abs(firstPoint.x - point.x) <= ALIGNED_THRESHOLD;
  });
}

/**
 * Returns true if the point p is inside the rectangle rect
 *
 * @param  {Point}  p
 * @param  {Rectangle} rect
 * @param  {number} tolerance
 *
 * @return {boolean}
 */
export function isPointInRect(p: Point, rect: Rectangle, tolerance: number = 0) {
  return p.x > rect.x - tolerance &&
         p.y > rect.y - tolerance &&
         p.x < rect.x + rect.width + tolerance &&
         p.y < rect.y + rect.height + tolerance;
}

/**
 * Returns a point in the middle of points p and q
 *
 * @param  {Point}  p
 * @param  {Point}  q
 *
 * @return {Point} middle point
 */
export function getMidPoint(p: Point, q: Point) {
  return {
    x: Math.round(p.x + ((q.x - p.x) / 2.0)),
    y: Math.round(p.y + ((q.y - p.y) / 2.0))
  };
}
