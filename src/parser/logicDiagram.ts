import { STATEMENT_END } from "utils/constants";
import {
  actionRegex,
  elseRegex,
  functionCallRegex,
  ifStatementRegex,
  variableAssignmentRegex,
  variableDeclarationRegex
} from "./regex";
import {
  LogicNode,
  LogicNodeType,
  LogicEdge,
  LogicDiagram,
  VariableMap,
  VariableDeclaration,
  IfStatement
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

const parseVariable = (
  rawValue: string,
  existingVars: VariableMap
): number | boolean => {
  let parsedValue: number | boolean;

  if (rawValue === "true" || rawValue === "false") {
    parsedValue = rawValue === "true";
  } else if (!Number.isNaN(parseInt(rawValue, 10))) {
    parsedValue = parseInt(rawValue, 10);
  }
  // Value must be a variable reassignment, check if the reassigned var exists
  else if (!existingVars[rawValue]) {
    throw new Error(
      `Tried to re-assign ${rawValue}, but ${rawValue} does not exist!`
    );
  } else {
    parsedValue = existingVars[rawValue];
  }

  return parsedValue;
};

const conditionMap = {
  "==": (a: any, b: any): boolean => a === b,
  "!=": (a: any, b: any): boolean => a !== b
};

const logicDiagram = (funcLines: string[]): LogicDiagram => {
  const nodes: LogicNode[] = [START_NODE];
  const edges: LogicEdge[] = [];

  let prevNodes = [nodes[0]];

  const branches: { branch: "if" | "else"; decisionNode: LogicNode }[] = [];

  // Nodes that were inside the last if statement
  const lastIfNodes: LogicNode[][] = [];

  // Map of variables that have been declared and their values
  const variables: VariableMap = {};

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
    // Found a variable declaration
    else if (new RegExp(variableDeclarationRegex).test(line)) {
      const [, ...groups] = new RegExp(variableDeclarationRegex).exec(line);
      const [name, value] = groups as VariableDeclaration;

      if (variables[name]) {
        throw new Error(`Variable ${name} has already been declared.`);
      }

      variables[name] = parseVariable(value, variables);
    }

    // Found a variable assignment
    else if (new RegExp(variableAssignmentRegex).test(line)) {
      const [, ...groups] = new RegExp(variableAssignmentRegex).exec(line);
      const [name, value] = groups as VariableDeclaration;

      if (!variables[name]) {
        throw new Error(`Variable ${name} has not been declared!`);
      }

      variables[name] = parseVariable(value, variables);
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
      const [, ...groups] = new RegExp(ifStatementRegex).exec(line);
      const [lhs, condition, rhs] = groups as IfStatement;

      if (variables[lhs] === undefined) {
        throw new Error(
          `Tried to evaluate a condition containing ${lhs}, but ${lhs} has not been declared!`
        );
      }

      if (rhs !== "true" && rhs !== "false" && variables[rhs] === undefined) {
        throw new Error(
          `Tried to evaluate a condition containing ${rhs}, but ${rhs} has not been declared!`
        );
      }

      if (conditionMap[condition as keyof typeof conditionMap] === undefined) {
        throw new Error(
          `Could not recognise if-statment condition '${condition}'!`
        );
      }

      const x =
        rhs === "true" || rhs === "false" ? rhs === "true" : variables[rhs];
      const y = variables[lhs];

      const evaluates = conditionMap[condition as keyof typeof conditionMap](
        x,
        y
      );

      node = {
        id: `${i}`,
        label: `${lhs} ${condition} ${rhs}`,
        type: LogicNodeType.DECISION,
        evaluates
      };

      branches.unshift({ branch: "if", decisionNode: node });
    } else if (new RegExp(elseRegex).test(line)) {
      lastIfNodes.unshift([...prevNodes]);

      const lastDecision = branches.shift().decisionNode;

      branches.unshift({ branch: "else", decisionNode: lastDecision });

      prevNodes = [lastDecision];
    } else if (line.localeCompare(STATEMENT_END) === 0) {
      if (branches.length) {
        const branch = branches.shift();

        if (branch.branch === "if") {
          const noActionNode: LogicNode = {
            id: `${i}`,
            label: "NO_ACTION",
            type: LogicNodeType.PROCESS
          };

          const noActionEdge: LogicEdge = {
            from: branch.decisionNode.id,
            to: noActionNode.id,
            label: "False"
          };

          nodes.push(noActionNode);
          edges.push(noActionEdge);

          prevNodes = [...prevNodes, noActionNode];
        } else if (lastIfNodes.length) {
          prevNodes = [...prevNodes, ...lastIfNodes.shift()];
        }
      }
    }

    if (node) {
      prevNodes.forEach((prevNode) => {
        if (prevNode.type === LogicNodeType.DECISION) {
          edges.push({
            from: prevNode.id,
            to: node.id,
            label: branches[0].branch === "if" ? "True" : "False"
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
