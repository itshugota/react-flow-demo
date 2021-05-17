
import { arePointsAligned } from '../utils/geometry';
import { getOrientation, getMidPoint } from '../layout/utils';
import Rectangle from '../types/Rectangle';
import Point from '../types/Point';
import Axis from '../types/Axis';
import Connection from '../types/Connection';
import ApproxIntersection from '../types/ApproxIntersection';
import Orientation from '../types/Orientation';

function axisAdd(point: Point, axis: Axis, delta: number): Point {
  return axisSet(point, axis, point[axis] + delta);
}

function axisSet(point: Point, axis: Axis, value: number): Point {
  return {
    x: (axis === Axis.X ? value : point.x),
    y: (axis === Axis.Y ? value : point.y),
  };
}

function flipAxis(axis: Axis): Axis {
  return axis === Axis.X ? Axis.Y : Axis.X;
}

export interface Context {
  connection: Connection;
  segmentStartIndex: number;
  segmentEndIndex: number;
  segmentStart: Point;
  segmentEnd: Point;
  axis: Axis;
  dragPosition: Point;
  originalWaypoints: Point[];
}

/**
 * Get the docking point on the given element.
 *
 * Compute a reasonable docking, if non exists.
 *
 * @param  {Point} point
 * @param  {Rectangle} referenceElement
 * @param  {Axis} moveAxis
 *
 * @return {Point}
 */
function getDocking(point: Point, referenceElement: Rectangle, moveAxis: Axis): Point {
  const referenceMidPoint = getMidPoint(referenceElement);
  const inverseAxis = flipAxis(moveAxis);

  return axisSet(point, inverseAxis, referenceMidPoint[inverseAxis]);
}

export const activateBendpointMove = (connection: Connection, intersection: ApproxIntersection) => {
  const segmentStartIndex = intersection.index - 1;
  const segmentEndIndex = intersection.index;
  let segmentStart = connection.waypoints[segmentStartIndex];
  let segmentEnd = connection.waypoints[segmentEndIndex];

  const direction = arePointsAligned(segmentStart, segmentEnd);

  // do not move diagonal connection
  if (!direction) {
    return;
  }

  // the axis where we are going to move things
  const axis = direction === 'v' ? Axis.X : Axis.Y;

  if (segmentStartIndex === 0) {
    segmentStart = getDocking(segmentStart, connection.source, axis);
  }

  if (segmentEndIndex === connection.waypoints.length - 1) {
    segmentEnd = getDocking(segmentEnd, connection.target, axis);
  }

  let dragPosition: Point;

  if (intersection) {
    dragPosition = intersection.point;
  } else {

    // set to segment center as default
    dragPosition = {
      x: (segmentStart.x + segmentEnd.x) / 2,
      y: (segmentStart.y + segmentEnd.y) / 2
    };
  }

  const context: Context = {
    connection,
    segmentStartIndex,
    segmentEndIndex,
    segmentStart,
    segmentEnd,
    axis,
    dragPosition,
    originalWaypoints: connection.waypoints,
  };

  return context;
};

/**
 * Crop connection if connection cropping is provided.
 *
 * @param {Connection} connection
 * @param {Point[]} newWaypoints
 *
 * @return {Point[]} cropped connection waypoints
 */
function cropConnection(connection: Connection, newWaypoints: Point[]) {
  const oldWaypoints = connection.waypoints;

  // temporary set new waypoints
  connection.waypoints = newWaypoints;

  // croppedWaypoints = connectionDocking.getCroppedWaypoints(connection);
  const croppedWaypoints = oldWaypoints;

  // restore old waypoints
  connection.waypoints = oldWaypoints;

  return croppedWaypoints;
}

export const handleMouseMoveWithContext = (event: MouseEvent) => (context: Context) => {
  const { connection, segmentStartIndex, segmentEndIndex, segmentStart, segmentEnd, axis, originalWaypoints } = context;
  const newWaypoints = originalWaypoints.slice();
  const newSegmentStart = axisAdd(segmentStart, axis, event[`movement${axis.toUpperCase()}`]);
  const newSegmentEnd = axisAdd(segmentEnd, axis, event[`movement${axis.toUpperCase()}`]);
  // original waypoint count and added / removed
  // from start waypoint delta. We use the later
  // to retrieve the updated segmentStartIndex / segmentEndIndex
  const waypointCount = newWaypoints.length;
  let segmentOffset = 0;

  // move segment start / end by axis delta
  newWaypoints[segmentStartIndex] = newSegmentStart;
  newWaypoints[segmentEndIndex] = newSegmentEnd;

  let sourceToSegmentOrientation: Orientation;
  let targetToSegmentOrientation: Orientation;

  // handle first segment
  if (segmentStartIndex < 2) {
    sourceToSegmentOrientation = getOrientation(connection.source, newSegmentStart);

    // first bendpoint, remove first segment if intersecting
    if (segmentStartIndex === 1) {

      if (sourceToSegmentOrientation === Orientation.INTERSECT) {
        newWaypoints.shift();
        newWaypoints[0] = newSegmentStart;
        segmentOffset--;
      }
    }

    // docking point, add segment if not intersecting anymore
    else {
      if (sourceToSegmentOrientation !== Orientation.INTERSECT) {
        newWaypoints.unshift(segmentStart);
        segmentOffset++;
      }
    }
  }

  // handle last segment
  if (segmentEndIndex > waypointCount - 3) {
    targetToSegmentOrientation = getOrientation(connection.target, newSegmentEnd);

    // last bendpoint, remove last segment if intersecting
    if (segmentEndIndex === waypointCount - 2) {

      if (targetToSegmentOrientation === Orientation.INTERSECT) {
        newWaypoints.pop();
        newWaypoints[newWaypoints.length - 1] = newSegmentEnd;
      }
    }

    // last bendpoint, remove last segment if intersecting
    else {
      if (targetToSegmentOrientation !== Orientation.INTERSECT) {
        newWaypoints.push(segmentEnd);
      }
    }
  }

  // update connection waypoints
  const newConnection = { ...connection, waypoints: [...connection.waypoints] };
  // newConnection.waypoints = cropConnection(connection, newWaypoints);
  newConnection.waypoints = newWaypoints;

  // save segmentOffset in context
  // context.newSegmentStartIndex = segmentStartIndex + segmentOffset;

  return newConnection;
};