import { Point, Shape } from 'react-flowy/lib';

export interface Docking {
  dockingPoint: Point;
  direction: 't' | 'r' | 'b' | 'l';
}

export function getDockingPointForHexagon(point: Point, shape: Shape, detailedDockingDirection: 't' | 'r' | 'b' | 'l'): Docking;
