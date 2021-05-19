import React, { useState, useRef, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import FourSideHandles, { ARROW_DISTANCE } from './FourSideHandles';
import { isPointInRect } from '../../lib/utils/geometry';
import { Node } from 'react-flowy';

const useStyles = makeStyles(() => ({
  container: {
    position: 'relative'
  },
}));

export interface NodeWithFourSideHandlesProps {
  node: Node;
}

const NodeWithFourSideHandles: React.FC<NodeWithFourSideHandlesProps> = React.memo(({ children, node }) => {
  const classes = useStyles();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isMouseDowned, setIsMouseDowned] = useState(false);
  const [shouldShowHandles, setShouldShowHandles] = useState(false);

  const handleMouseEnter = () => {
    setShouldShowHandles(true);
  }

  useEffect(() => {
    if (!shouldShowHandles) return;

    document.addEventListener('mousemove', handleMouseMove);

    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, [shouldShowHandles, isMouseDowned])

  useEffect(() => {
    if (!isMouseDowned) return;

    document.addEventListener('mouseup', handleMouseUp);

    return () => document.removeEventListener('mouseup', handleMouseUp);
  }, [isMouseDowned])

  const handleMouseMove = (e: MouseEvent) => {
    if (isMouseDowned) {
      if (shouldShowHandles) setShouldShowHandles(false);

      return;
    }

    const TOLERANCE = 12;
    const containerBoundingRect = containerRef.current!.getBoundingClientRect();
    const virtualBoundingRect = {
      x: containerBoundingRect.x - (ARROW_DISTANCE + TOLERANCE),
      y: containerBoundingRect.y - (ARROW_DISTANCE + TOLERANCE),
      width: containerBoundingRect.width + 2 * (ARROW_DISTANCE + TOLERANCE),
      height: containerBoundingRect.height + 2 * (ARROW_DISTANCE + TOLERANCE)
    };

    if (!isPointInRect({ x: e.clientX, y: e.clientY }, virtualBoundingRect)) {
      setShouldShowHandles(false);
    }
  }

  const handleMouseDown = () => {
    setIsMouseDowned(true);
  };

  const handleMouseUp = (e: MouseEvent) => {
    const containerBoundingRect = containerRef.current!.getBoundingClientRect();

    if (isPointInRect({ x: e.clientX, y: e.clientY }, containerBoundingRect)) {
      setShouldShowHandles(true);
    }

    setIsMouseDowned(false);
  }

  return (
    <div ref={containerRef} className={classes.container} onMouseEnter={handleMouseEnter} onMouseDown={handleMouseDown}>
      <FourSideHandles node={node} shouldShowHandles={shouldShowHandles} />
      {children}
    </div>
  );
});

export default NodeWithFourSideHandles;
