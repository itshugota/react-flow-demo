import Canvas from '../lib/types/Canvas';

export const getCanvasFromTransform = (canvasTransform: number[]): Canvas => {
  return {
    position: {
      x: canvasTransform[0],
      y: canvasTransform[1],
    },
    scale: canvasTransform[2],
  };
}
