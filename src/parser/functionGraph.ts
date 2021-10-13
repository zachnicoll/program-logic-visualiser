import { STATEMENT_END, ENTRY_POINT } from "utils/constants";
import {
  ifStatementRegex,
  functionCallRegex,
  variableDeclarationRegex,
  variableAssignmentRegex
} from "./regex";
import { FunctionDeclarationMap } from "./tokenize";
import {
  FunctionCallGraph,
  GraphEdge,
  IfStatement,
  StatementType,
  VariableDeclaration,
  VariableMap
} from "./types";

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

const analyseFunction = (
  functionName: string,
  functionDeclarations: FunctionDeclarationMap,
  sourceCode: string,
  prevEdges: GraphEdge[]
): FunctionCallGraph => {
  if (!functionDeclarations[functionName]) {
    throw new Error(`No function declaration for '${functionName} ()' found!`);
  }

  // Extract the chunk of source code that this function resides in
  const startOfFunction = sourceCode.substring(
    functionDeclarations[functionName].endIndex,
    sourceCode.length
  );

  const sourceLines = startOfFunction.split("\n");

  const funcGraph: FunctionCallGraph = {
    // Nodes get labelled like 'main()'
    nodes: [{ id: functionName, label: `${functionName}()`, lines: [] }],
    edges: []
  };

  // Count how many STATEMENT_END tokens needed until function ends
  const statements: { type: StatementType; condition: string }[] = [];

  // Map of variables that have been declared and their values
  const variables: VariableMap = {};

  for (let i = 0; i < sourceLines.length; i += 1) {
    const line = sourceLines[i].trim();

    funcGraph.nodes[0].lines.push(line);

    // This line isn't a comment
    if (!line.startsWith("//")) {
      if (line.localeCompare(STATEMENT_END) === 0) {
        // Break if we reach the last STATEMENT_END keyword, there are no more lines
        // left to analyse in this function (the function declaration has ended)
        if (statements.length === 0) {
          break;
        } else {
          statements.shift();
        }
      }

      // Found an if statement
      if (line.search(ifStatementRegex) !== -1) {
        // Array takes the form [fullMatch, lhs, condition, rhs]
        const [, ...groups] = new RegExp(ifStatementRegex).exec(line);
        const ifStatementInfo = groups as IfStatement;

        statements.unshift({
          type: StatementType.IF,
          condition: ifStatementInfo.join(" ")
        });
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

      // Found a function call e.g. a(x, y)
      else if (new RegExp(functionCallRegex).test(line)) {
        const callFuncName = line.split("(")[0];

        // This always finds the correct if-statement because the last if-statment called
        // will appear first in the statements array!
        const conditional = statements.find((s) => s.type === StatementType.IF);

        // Does this function call itself?
        const selfReferential = functionName.localeCompare(callFuncName) === 0;

        // Recursion detected if the same from and to destinations already exist
        const recursive = prevEdges.some(
          (e) =>
            e.from.localeCompare(functionName) === 0 &&
            e.to.localeCompare(callFuncName) === 0
        );

        const edge: GraphEdge = {
          from: functionName,
          to: callFuncName,
          dashes: !!conditional,
          label: conditional ? "?" : "",
          title: conditional ? conditional.condition : undefined,
          selfReferential
        };

        // We've found an edge from this function to another function
        // Only keep track of it if it doesn't already exist
        if (!recursive) prevEdges.push(edge);

        if (!selfReferential && !recursive) {
          // This creates a recursive loop to analyse every function inside every function
          const nextAnalysedFunc = analyseFunction(
            callFuncName,
            functionDeclarations,
            sourceCode,
            prevEdges
          );

          // Need all of the nodes found inside the next analysed function in the 'parent'
          // funcGraph object, so combine them and then make sure there isn't any duplicates
          const combinedNodes = [...funcGraph.nodes, ...nextAnalysedFunc.nodes];
          const uniqueNodes: FunctionCallGraph["nodes"] = [];

          combinedNodes.forEach((n) => {
            if (!uniqueNodes.find((un) => un.id.localeCompare(n.id) === 0))
              uniqueNodes.push(n);
          });

          funcGraph.nodes = uniqueNodes;
        }
      }
    }
  }

  funcGraph.edges = prevEdges;

  return funcGraph;
};

const functionGraph = (
  functionDeclarations: FunctionDeclarationMap,
  sourceCode: string
): FunctionCallGraph => {
  if (!functionDeclarations[ENTRY_POINT]) {
    throw new Error(
      "No program entry point found! Make sure you declare main()."
    );
  }

  return analyseFunction(ENTRY_POINT, functionDeclarations, sourceCode, []);
};

export default functionGraph;
