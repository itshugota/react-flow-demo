import { Edge, Node } from 'react-flowy/lib';

export interface ExtendedNodeContainerProps {
  node: Node;
  additionalEdgeProps?: Partial<Edge>;
  isHandleDisabled?: boolean;
  children: JSX.Element;
}

export default function ExtendedNodeContainer(props: ExtendedNodeContainerProps): JSX.Element;
