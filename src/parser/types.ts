import { EdgeOptions } from "vis-network/standalone";

type ArrowType =
  | "arrow"
  | "bar"
  | "circle"
  | "box"
  | "crow"
  | "curve"
  | "inv_curve"
  | "diamond"
  | "triangle"
  | "inv_triangle"
  | "vee";

export type GraphNode = {
  id: string;
  label: string;
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
