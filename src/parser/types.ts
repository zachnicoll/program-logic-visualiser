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

export enum LogicNodeType {
  START, // First node
  STOP, // Last node (or 'end' statement)
  DECISION, // If statement node
  PROCESS, // perform action statement node
  TERMINAL // Other function calls node
}

export type LogicNode = {
  id: string;
  label: string;
  type: LogicNodeType;
  evaluates?: boolean;
};

export type LogicEdge = {
  from: string;
  to: string;
} & EdgeOptions;

export type FunctionCallGraph = {
  nodes: GraphNode[];
  edges: GraphEdge[];
};

export type LogicDiagram = {
  nodes: LogicNode[];
  edges: LogicEdge[];
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
