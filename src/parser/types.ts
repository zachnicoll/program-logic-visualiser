/* eslint-disable no-use-before-define */

type FunctionCallGraphCalledBy = {
  name: string;
  calls: FunctionCallGraph[];
  isCalledBy: string;
};

type IsConditionallyCalled = {
  conditionallyCalled: true;
  callCondition: string;
};

type IsNotConditionallyCalled = {
  conditionallyCalled: false;
};

// export type FunctionCallGraph =
//   | {
//       width?: number;
//     } & (
//       | {
//           name: string;
//           calls: FunctionCallGraph[];
//         }
//       | (FunctionCallGraphCalledBy &
//           (IsNotConditionallyCalled | IsConditionallyCalled))
//     );

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

type GraphNode = {
  id: string;
  label: string;
};

type GraphEdge = {
  from: string;
  to: string;
  dashes?: boolean | number[];
  arrows?: {
    to: {
      enabled: boolean;
      type: ArrowType;
    };
  };
};

export type FunctionCallGraph = {
  nodes: GraphNode[];
  edges: GraphEdge[];
};
