import { START_NODE, STATEMENT_END, STOP_NODE } from "utils/constants";
import { formatDecisionLabel } from "utils/format";
import conditionMap from "./conditionMap";
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
  IfStatement,
  Branch
} from "./types";
import { parseVariable, parseValue } from "./valueParsers";

const logicDiagram = (
  funcLines: string[],
  variableOverwrites?: VariableMap
): LogicDiagram => {
  // The START node goes first, always
  const nodes: LogicNode[] = [START_NODE];
  const edges: LogicEdge[] = [];

  /**
   * Array of nodes previously evaluated - there are cases where we want
   * to connect multiple nodes to a single node, so we need to store them
   * as an array.
   */
  let prevNodes = [nodes[0]];

  const branches: Branch[] = [];

  // Nodes that were inside the last if statement
  const lastIfNodes: LogicNode[][] = [];

  // Map of variables that have been declared and their values
  const variables: VariableMap = {};

  // Capture the variables when they are declared, so they can be returned and modified
  const variableDeclarations: VariableMap = {};

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

      if (variableOverwrites && variableOverwrites[name] !== undefined) {
        variables[name] = variableOverwrites[name];
      } else {
        variables[name] = parseVariable(value, variables);
      }

      // Save a copy of the variable in its declared form
      variableDeclarations[name] = variables[name];
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
    }
    // Found an if-statement
    else if (new RegExp(ifStatementRegex).test(line)) {
      const [, ...groups] = new RegExp(ifStatementRegex).exec(line);
      const [lhs, condition, rhs] = groups as IfStatement;

      if (variables[lhs] === undefined) {
        throw new Error(
          `Tried to evaluate a condition containing ${lhs}, but ${lhs} has not been declared!`
        );
      }

      if (conditionMap[condition as keyof typeof conditionMap] === undefined) {
        throw new Error(
          `Could not recognise if-statment condition '${condition}'!`
        );
      }

      const x = parseValue(lhs, variables);
      const y = parseValue(rhs, variables);

      const evaluates = conditionMap[condition as keyof typeof conditionMap](
        x,
        y
      );

      node = {
        id: `${i}`,
        label: formatDecisionLabel(lhs, condition, rhs),
        type: LogicNodeType.DECISION,
        evaluates
      };

      branches.unshift({ branch: "if", decisionNode: node });
    }
    // Found an else keyword
    else if (new RegExp(elseRegex).test(line)) {
      /**
       * We've moved into an else-block, move the last nodes evaluated in the if-block
       * to the front of the lastIfNodes array.
       */
      lastIfNodes.unshift([...prevNodes]);

      /**
       * Shift the first branch off the stack and extract the decision node.
       * The next node/s will connect to this node in the next iteration of the for-loop.
       */
      const lastDecision = branches.shift().decisionNode;
      prevNodes = [lastDecision];

      /**
       * We're now inside an else-block, so add the same decision node
       * back with the correct branch.
       */
      branches.unshift({ branch: "else", decisionNode: lastDecision });
    }
    // Found a STATEMENT_END keyword
    else if (line.localeCompare(STATEMENT_END) === 0) {
      if (branches.length) {
        const { branch, decisionNode } = branches.shift();

        if (branch === "if") {
          /**
           * Reached the end of an if-statement without an else-block, so add
           * a dummy 'NO_ACTION' node to the False branch of the decision node
           */

          const reachable = decisionNode.evaluates === false;

          const noActionNode: LogicNode = {
            id: `${i}`,
            label: "NO_ACTION",
            type: LogicNodeType.PROCESS,
            reachable
          };

          const noActionEdge: LogicEdge = {
            from: decisionNode.id,
            to: noActionNode.id,
            label: "False",
            reachable
          };

          nodes.push(noActionNode);
          edges.push(noActionEdge);

          prevNodes = [...prevNodes, noActionNode];
        } else if (lastIfNodes.length) {
          /**
           * Reached end of else-block, shift last if-block nodes off front of array and
           * combine them with the last nodes in the else-block. The next node will join
           * on to all of these nodes (will usually be max 2)
           */
          prevNodes = [...prevNodes, ...lastIfNodes.shift()];
        }
      }
    }

    // Might not be a node this line, if the line was a comment
    if (node) {
      // If there are previous nodes, connect them to this node
      prevNodes.forEach((prevNode) => {
        if (prevNode.type === LogicNodeType.DECISION) {
          const { branch, decisionNode } = branches[0];

          const reachable = !(
            (branch === "if" && decisionNode.evaluates === false) ||
            (branch === "else" && decisionNode.evaluates === true)
          );

          edges.push({
            from: prevNode.id,
            to: node.id,

            /**
             * If we're currently inside the 'if' block of an if-statement, then
             * that means the if-condition has evaluated true - so show True on the
             * edge pointing to the nodes inside the 'if' block
             */
            label: branches[0].branch === "if" ? "True" : "False",
            reachable
          });
        } else {
          edges.push({
            from: prevNode.id,
            to: node.id,
            reachable: prevNode.reachable
          });
        }
      });

      if (branches.length && node.type !== LogicNodeType.DECISION) {
        const { branch, decisionNode } = branches[0];

        const reachable = !(
          (branch === "if" && decisionNode.evaluates === false) ||
          (branch === "else" && decisionNode.evaluates === true)
        );

        node.reachable = reachable;
      }

      nodes.push(node);
      prevNodes = [node];
    }
  });

  // Insert the STOP node and connect the last node in the array to it with an edge
  nodes.push(STOP_NODE);
  prevNodes.forEach((prevNode) => {
    edges.push({
      from: prevNode.id,
      to: "STOP"
    });
  });

  return {
    nodes,
    edges,
    variableDeclarations
  };
};

export default logicDiagram;
