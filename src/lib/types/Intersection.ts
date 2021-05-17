export default interface Intersection {
  /**
   * Segment of first path.
   */
  segment1: number;

  /**
   * Segment of first path.
   */
  segment2: number;

  /**
   * The x coordinate.
   */
  x: number;

  /**
   * The y coordinate.
   */
  y: number;

  /**
   * Bezier curve for matching path segment 1.
   */
  bez1: number[];

  /**
   * Bezier curve for matching path segment 2.
   */
  bez2: number[];

  /**
   * Relative position of intersection on path segment1 (0.5 => in middle, 0.0 => at start, 1.0 => at end).
   */
  t1: number;

  /**
   * Relative position of intersection on path segment2 (0.5 => in middle, 0.0 => at start, 1.0 => at end).
   */
  t2: number;
}
