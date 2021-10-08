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

type ArrowOptions = {
  enabled: boolean;
  type: ArrowType;
  scaleFactor?: number;
};

export type GraphEdge = {
  from: string;
  to: string;
  dashes?: boolean | number[];
  label?: string;
  font?: {
    color?: string;
    size?: number;
    face?: string;
    background?: string;
  };
  arrows?: {
    to: ArrowOptions;
    middle?: ArrowOptions;
  };
};

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
