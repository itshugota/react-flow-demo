import { Node } from '../../../../react-flowy/lib';

export type NodeDropValidator = (nodes: Node[], droppableNode: Node) => boolean; 

export const nodeDropValidators: Record<string, NodeDropValidator>;

export const registerNodeDropValidator: (nodeType: string) => (nodeDropValidator: NodeDropValidator) => void;

export interface DraggableBlockProps {
  Icon: React.FC;
  DragShell: React.FC;
  name: string;
  description: string;
  nodeType: string;
}

export default function DraggableBlock(props: DraggableBlockProps): JSX.Element;
