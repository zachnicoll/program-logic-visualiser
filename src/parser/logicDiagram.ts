import { STATEMENT_END } from "utils/constants";
import {
  actionRegex,
  elseRegex,
  functionCallRegex,
  ifStatementRegex
} from "./regex";
import { LogicNode, LogicNodeType, LogicEdge, LogicDiagram } from "./types";

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

  let prevNodes = [nodes[0]];

  let branch: "if" | "else" | null = null;
  let branchCount = 0;

  const lastIfNodes: LogicNode[][] = [];

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

      branch = "if";
      branchCount += 1;
    } else if (new RegExp(elseRegex).test(line)) {
      lastIfNodes.unshift([...prevNodes]);

      const lastDecision = nodes.filter(
        (n) => n.type === LogicNodeType.DECISION
      )[branchCount - 1];

      branch = "else";
      branchCount += 1;

      prevNodes = [lastDecision];
    } else if (line.localeCompare(STATEMENT_END) === 0) {
      if (branch) {
        const lastDecision = nodes.filter(
          (n) => n.type === LogicNodeType.DECISION
        )[branchCount - 1];

        if (branch === "if") {
          const noActionNode: LogicNode = {
            id: `${i}`,
            label: "NO_ACTION",
            type: LogicNodeType.PROCESS
          };

          const noActionEdge: LogicEdge = {
            from: lastDecision.id,
            to: noActionNode.id,
            label: "False"
          };

          nodes.push(noActionNode);
          edges.push(noActionEdge);

          prevNodes = [...prevNodes, noActionNode];
        } else if (lastIfNodes.length) {
          prevNodes = [...prevNodes, ...lastIfNodes.shift()];
        }

        branchCount -= 1;
        if (branchCount === 0) {
          branch = null;
        }
      }
    }

    if (node) {
      prevNodes.forEach((prevNode) => {
        if (prevNode.type === LogicNodeType.DECISION) {
          edges.push({
            from: prevNode.id,
            to: node.id,
            label: branch === "if" ? "True" : "False"
          });
        } else {
          edges.push({
            from: prevNode.id,
            to: node.id
          });
        }
      });

      nodes.push(node);
      prevNodes = [node];
    }
  });

  nodes.push(STOP_NODE);

  prevNodes.forEach((prevNode) => {
    edges.push({
      from: prevNode.id,
      to: "STOP"
    });
  });

  return {
    nodes,
    edges
  };
};

export default logicDiagram;
