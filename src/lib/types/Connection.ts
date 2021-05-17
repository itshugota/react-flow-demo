import Point from './Point';
import Rectangle from './Rectangle';

export default interface Connection {
  waypoints: Point[];
  source: Rectangle;
  target: Rectangle;
}
