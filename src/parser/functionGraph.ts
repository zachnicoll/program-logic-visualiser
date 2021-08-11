import { FunctionDeclarationMap } from "./tokenize";

export type FunctionCallGraph =
  | {
      name: string;
      calls: FunctionCallGraph[];
    }
  | ({
      name: string;
      calls: FunctionCallGraph[];
      isCalledBy: string;
    } & (
      | {
          conditionallyCalled: false;
        }
      | {
          conditionallyCalled: true;
          callCondition: string;
        }
    ));

const functionCallRegex = /[a-zA-Z_]+\((?:[a-zA-Z_ ]+[,]?)*\)/g;

const analyseFunction = (
  functionName: string,
  functionDeclarations: FunctionDeclarationMap,
  sourceCode: string
): FunctionCallGraph => {
  if (!functionDeclarations[functionName]) {
    throw new Error(`No function declaration for '${functionName}()' found!`);
  }

  const startOfFunction = sourceCode.substring(
    functionDeclarations[functionName].endIndex,
    sourceCode.length
  );
  const funcLines = startOfFunction.split("\n");

  const funcGraph: FunctionCallGraph = {
    name: functionName,
    calls: [],
  };

  for (let i = 0; i < funcLines.length; i += 1) {
    const line = funcLines[i];
    if (line.localeCompare("end") === 0) break;

    const trimmedLine = line.trim();
    if (functionCallRegex.test(trimmedLine)) {
      const callFuncName = trimmedLine.split("(")[0];

      funcGraph.calls.push(
        analyseFunction(callFuncName, functionDeclarations, sourceCode)
      );
    }
  }

  return funcGraph;
};

const functionGraph = (
  functionDeclarations: FunctionDeclarationMap,
  sourceCode: string
): FunctionCallGraph => {
  if (!functionDeclarations.main) {
    throw new Error(
      "No program entry point found! Make sure you declare main()."
    );
  }

  return analyseFunction("main", functionDeclarations, sourceCode);
};

export default functionGraph;
