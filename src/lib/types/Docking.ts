import Point from './Point';

export default interface Docking {
  point: Point;
  actual: Point;
  idx: number;
}
