import { Shape } from 'react-flowy/lib';

export const hexagonAsTRBL = (shape: Shape) => {
  return {
    top: shape.y - shape.topPeakHeight,
    right: shape.x + shape.width,
    bottom: shape.y + shape.height + shape.topPeakHeight,
    left: shape.x,
  };
};
