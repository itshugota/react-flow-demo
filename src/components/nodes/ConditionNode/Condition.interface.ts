export enum Operator {
  EQUAL = '=',
  UNEQUAL = '!=',
}

export interface Condition {
  parameter: string;
  operator: Operator;
  value: string;
}
