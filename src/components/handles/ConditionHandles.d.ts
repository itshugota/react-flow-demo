import { Edge } from 'react-flowy/lib';

export interface ConditionHandlesProps {
  node: Node;
  additionalEdgeProps?: Partial<Edge>;
  shouldShowHandles: boolean;
  TopHandleIndicator?: React.FC;
  RightHandleIndicator?: React.FC;
  BottomHandleIndicator?: React.FC;
  LeftHandleIndicator?: React.FC;
}

export default function ConditionHandles(props: ConditionHandlesProps): JSX.Element;