import { actionRegex, functionCallRegex, ifStatementRegex } from "./regex";
import {
  LogicNode,
  GraphEdge,
  LogicNodeType,
  LogicEdge,
  LogicDiagram
} from "./types";

const START_NODE: LogicNode = {
  id: "START",
  label: "START",
  type: LogicNodeType.START
};

const STOP_NODE: LogicNode = {
  id: "STOP",
  label: "STOP",
  type: LogicNodeType.STOP
};

const logicDiagram = (funcLines: string[]): LogicDiagram => {
  const nodes: LogicNode[] = [START_NODE];
  const edges: LogicEdge[] = [];

  let prevNode = nodes[0];

  const noEmptyLines = funcLines.filter((line) => line.length);

  noEmptyLines.forEach((line, i) => {
    let node: LogicNode | null = null;

    // Found an action e.g. `perform ACTION_X`
    if (new RegExp(actionRegex).test(line)) {
      const [, actionName] = new RegExp(actionRegex).exec(line);

      node = {
        id: `${i}`,
        label: actionName,
        type: LogicNodeType.PROCESS
      };
    }
    // Found a function call e.g. `a(x,y)`
    else if (new RegExp(functionCallRegex).test(line)) {
      // [fullMatch, funcName, param1, param2, ...]
      const [, funcName, ...params] = new RegExp(functionCallRegex).exec(line);

      node = {
        id: `${i}`,
        label: `${funcName}(${params.join(",")})`,
        type: LogicNodeType.TERMINAL
      };
    } else if (new RegExp(ifStatementRegex).test(line)) {
      const [, lhs, condition, rhs] = new RegExp(ifStatementRegex).exec(line);

      node = {
        id: `${i}`,
        label: `${lhs} ${condition} ${rhs}`,
        type: LogicNodeType.DECISION
      };
    }

    if (node) {
      edges.push({
        from: prevNode.id,
        to: node.id
      });

      nodes.push(node);
      prevNode = node;
    }
  });

  nodes.push(STOP_NODE);
  edges.push({
    from: prevNode.id,
    to: "STOP"
  });

  return {
    nodes,
    edges
  };
};

export default logicDiagram;
