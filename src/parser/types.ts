import { EdgeOptions } from "vis-network/standalone";

export type GraphNode = {
  id: string;
  label: string;
  lines: string[];
};

export type GraphEdge = {
  from: string;
  to: string;
  selfReferential: boolean;
} & EdgeOptions;

export type FunctionCallGraph = {
  nodes: GraphNode[];
  edges: GraphEdge[];
};

export enum StatementType {
  FUNCTION,
  IF,
  FOR,
  WHILE
}

export type IfStatement = [lhs: string, condition: string, rhs: string];

export type VariableDeclaration = [name: string, value: string];

export type VariableMap = Record<string, number | boolean>;
