import { funcDeclarationRegex } from "./regex";

type FunctionInformation = {
  parameters: string[];
  startIndex: number; // Index in string where declaration starts, the beginning of 'func'
  endIndex: number; // Index in string where declaration ends, the end of 'does\n'
};

export interface FunctionDeclarationMap {
  [funcName: string]: FunctionInformation;
}

const tokenize = (sourceCodeText: string): FunctionDeclarationMap => {
  const functions: FunctionDeclarationMap = {};

  let newMatch = funcDeclarationRegex.exec(sourceCodeText);

  while (newMatch !== null) {
    const funcName: string | undefined = newMatch[1];
    const funcParamsStr: string | undefined = newMatch[2];

    if (funcName) {
      if (funcParamsStr) {
        const funcParams = funcParamsStr
          // Remove the '(' & ')' chars from parameter declaration
          .substring(1, funcParamsStr.length - 1)
          .replace(/\s/g, "") // Remove all whitespace
          .split(",") // Split the parameters by ',' char, e.g. a,b,c
          .filter((str) => str !== ""); // Filter for edge case where there are no params and "" is returned

        if (functions[funcName] !== undefined) {
          throw new Error(
            "More than one function declared with the same name!"
          );
        }

        functions[funcName] = {
          parameters: funcParams,
          startIndex: newMatch.index,
          endIndex: newMatch.index + newMatch[0].length
        };
      } else {
        throw new Error("Invalid function parameter declaration!");
      }
    } else {
      throw new Error("Invalid function declaration!");
    }

    newMatch = funcDeclarationRegex.exec(sourceCodeText);
  }

  return functions;
};

export default tokenize;
