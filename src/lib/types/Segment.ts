import Point from './Point';

export default interface Segment {
  directions: string;
  waypoints: Point[];
  turnNextDirections: boolean;
}
