import Rectangle from '../lib/types/Rectangle';

export const getNodeElementById = (id: string) => {
  return document.querySelector(`.react-flow__node[data-id="${id}"`);
}

export const getNodeById = (elements: any[]) => (id: string) => {
  return elements.find(element => element.id === id);
}

export const getRectangleByNodeId = (elements: any[]) => (nodeId: string): Rectangle => {
  const node = getNodeById(elements)(nodeId);
  const nodeElement = getNodeElementById(nodeId) as HTMLElement;

  return {
    x: node.position.x,
    y: node.position.y,
    width: nodeElement.offsetWidth,
    height: nodeElement.offsetHeight
  }
}
