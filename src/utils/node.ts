import Rectangle from '../lib/types/Rectangle';

export const getNodeElementById = (id: string) => {
  return document.querySelector(`.react-flow__node[data-id="${id}"`);
}

export const getNodeById = (elements: any[]) => (id: string) => {
  return elements.find(element => element.id === id);
}

export const getRectangleByNodeId = (elements: any[]) => (nodeId: string, positionAdjustment?: { x: number, y: number }): Rectangle => {
  const node = getNodeById(elements)(nodeId);
  const nodeElement = getNodeElementById(nodeId) as HTMLElement;

  const hihi = {
    x: (node.__rf?.position.x || node.position.x) + (positionAdjustment?.x || 0),
    y: (node.__rf?.position.y || node.position.y) + (positionAdjustment?.y || 0),
    width: nodeElement.offsetWidth,
    height: nodeElement.offsetHeight
  }

  console.log('getREctangleByNodedId', JSON.stringify(hihi));

  return hihi;
}
