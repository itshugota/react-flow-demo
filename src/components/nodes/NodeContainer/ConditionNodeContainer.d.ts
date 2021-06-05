import { Edge, Node } from 'react-flowy/lib';

export interface ConditionNodeContainerProps {
  node: Node;
  additionalEdgeProps?: Partial<Edge>;
  isHandleDisabled?: boolean;
  children: JSX.Element;
}

export default function ExtendedNodeContainer(props: ConditionNodeContainerProps): JSX.Element;
