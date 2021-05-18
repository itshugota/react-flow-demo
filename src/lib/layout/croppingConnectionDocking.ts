import Connection from '../types/Connection';
import Docking from '../types/Docking';
import Point from '../types/Point';
import Rectangle from '../types/Rectangle';
import { getConnectionPath, getElementLineIntersection, getShapePath } from './utils';

const dockingToPoint = (docking: Docking) => {
  // use the dockings actual point and
  // retain the original docking
  return Object.assign({ original: docking.point.original || docking.point }, docking.actual);
}


export const getCroppedWaypoints = function(connection: Connection, source?: Rectangle, target?: Rectangle) {
  source = source || connection.source;
  target = target || connection.target;

  const sourceDocking = getDockingPoint(connection, source, true);
  const targetDocking = getDockingPoint(connection, target);

  var croppedWaypoints = connection.waypoints.slice(sourceDocking.idx + 1, targetDocking.idx);

  croppedWaypoints.unshift(dockingToPoint(sourceDocking));
  croppedWaypoints.push(dockingToPoint(targetDocking));

  return croppedWaypoints;
};

const getDockingPoint = function(connection: Connection, shape: Rectangle, dockStart: boolean = false): Docking {
  const waypoints = connection.waypoints;
  const dockingIdx = dockStart ? 0 : waypoints.length - 1;
  const dockingPoint = waypoints[dockingIdx];

  const croppedPoint = _getIntersection(shape, connection, dockStart);

  return {
    point: dockingPoint,
    actual: croppedPoint || dockingPoint,
    idx: dockingIdx
  };
};

function _getIntersection(shape: Rectangle, connection: Connection, shouldCropFromStart: boolean): Point | null {
  const shapePath = getShapePath(shape);
  const connectionPath = getConnectionPath(connection);

  return getElementLineIntersection(shapePath, connectionPath, shouldCropFromStart);
};
