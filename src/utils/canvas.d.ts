interface CanvasBounding {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export function getCanvasBounding(): CanvasBounding;
