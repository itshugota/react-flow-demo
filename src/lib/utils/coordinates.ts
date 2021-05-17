import Canvas from '../types/Canvas';

export const eventPointToCanvasCoordinates = (event: MouseEvent | TouchEvent) => (canvas: Canvas) => {
  let clientX: number;
  let clientY: number;

  const touchEvent = event as TouchEvent;

  if (Array.isArray(touchEvent.touches)) {
    clientX = touchEvent.touches[0].clientX;
    clientY = touchEvent.touches[0].clientY;
  } else {
    clientX = (event as MouseEvent).clientX;
    clientY = (event as MouseEvent).clientY;
  }

  return {
    x: (clientX - canvas.position.x) / canvas.scale,
    y: (clientY - canvas.position.y) / canvas.scale,
  }
}
