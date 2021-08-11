import { Point, Shape } from 'react-flowy/lib';

export const isPointInTriangle: (point: Point) => (trianglePointA: Point, trianglePointB: Point, trianglePointC: Point) => boolean;

export const isPointInHexagon: (point: Point, shape: Shape) => boolean;
