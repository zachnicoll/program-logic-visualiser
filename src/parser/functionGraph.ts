import { FunctionDeclarationMap } from "./tokenize";
import { FunctionCallGraph } from "./types";

export const ENTRY_POINT = "main";

const functionCallRegex = /[a-zA-Z_]+\((?:[a-zA-Z_ ]+[,]?)*\)/g;

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

  for (let i = 0; i < funcLines.length; i += 1) {
    const line = funcLines[i];
    if (line.localeCompare("end") === 0) break;

    const trimmedLine = line.trim();

    // Found a function call in the source code text
    if (functionCallRegex.test(trimmedLine)) {
      const callFuncName = trimmedLine.split("(")[0];

      // We've found an edge from this function to another function
      funcGraph.edges.push({
        from: functionName,
        to: callFuncName,
        // TODO: Add conditional call check here, and make line dashed if so
        arrows: {
          to: {
            enabled: true,
            type: "arrow"
          }
        }
      });

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
        if (!uniqueNodes.find((un) => un.id === n.id)) uniqueNodes.push(n);
      });

      funcGraph.nodes = uniqueNodes;

      // Also merge edges
      funcGraph.edges = [...funcGraph.edges, ...nextAnalysedFunc.edges];
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
