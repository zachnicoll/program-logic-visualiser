import { STATEMENT_END, ENTRY_POINT } from "utils/constants";
import { ifStatementRegex, functionCallRegex } from "./regex";
import { FunctionDeclarationMap } from "./tokenize";
import { FunctionCallGraph, StatementType } from "./types";

const analyseFunction = (
  functionName: string,
  functionDeclarations: FunctionDeclarationMap,
  sourceCode: string
): FunctionCallGraph => {
  if (!functionDeclarations[functionName]) {
    throw new Error(`No function declaration for '${functionName} ()' found!`);
  }

  // Extract the chunk of source code that this function resides in
  const startOfFunction = sourceCode.substring(
    functionDeclarations[functionName].endIndex,
    sourceCode.length
  );

  const funcLines = startOfFunction.split("\n");

  const funcGraph: FunctionCallGraph = {
    // Nodes get labelled like 'main()'
    nodes: [{ id: functionName, label: `${functionName}()` }],
    edges: []
  };

  // Count how many STATEMENT_END tokens needed until function ends
  const statements: { type: StatementType; condition: string }[] = [];

  for (let i = 0; i < funcLines.length; i += 1) {
    const line = funcLines[i].trim();

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
        const [, ...groups] = ifStatementRegex.exec(line);
        statements.unshift({
          type: StatementType.IF,
          condition: groups.join(" ")
        });
      }

      // Found a function call e.g. a(x, y)
      else if (functionCallRegex.test(line)) {
        const callFuncName = line.split("(")[0];

        // This always finds the correct if-statement because the last if-statment called
        // will appear first in the statements array!
        const conditional = statements.find((s) => s.type === StatementType.IF);

        // Does this function call itself?
        const selfReferential = functionName.localeCompare(callFuncName) === 0;

        // We've found an edge from this function to another function
        funcGraph.edges.push({
          from: functionName,
          to: callFuncName,
          dashes: !!conditional,
          label: conditional ? "?" : "",
          title: conditional ? conditional.condition : undefined,
          selfReferential
        });

        if (!selfReferential) {
          // This creates a recursive loop to analyse every function inside every function
          const nextAnalysedFunc = analyseFunction(
            callFuncName,
            functionDeclarations,
            sourceCode
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

          // Also merge edges
          funcGraph.edges = [...funcGraph.edges, ...nextAnalysedFunc.edges];
        }
      }
    }
  }

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

  return analyseFunction(ENTRY_POINT, functionDeclarations, sourceCode);
};

export default functionGraph;
