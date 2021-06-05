import { Edge, Node } from 'react-flowy/lib';

export interface ExtendedNodeContainerProps {
  node: Node;
  additionalEdgeProps?: Partial<Edge>;
  isHandleDisabled?: boolean;
}

export default function ExtendedNodeContainer(props: ExtendedNodeContainerProps): JSX.Element;
