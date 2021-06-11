import { Node } from 'react-flowy/lib';
import { Condition } from './Condition.interface';

interface ConditionRowProps {
  node: Node;
  condition: Condition;
  index: number;
  isLastRow: boolean;
}

export default function ConditionRow(props: ConditionRowProps): JSX.Element;
