import { VariableMap } from "./types";

export const parseValue = (
  value: string,
  variables: VariableMap
): boolean | number => {
  let x;
  if (value === "true" || value === "false") {
    x = value === "true";
  } else if (!Number.isNaN(parseInt(value, 10))) {
    x = parseInt(value, 10);
  } else if (variables[value] !== undefined) {
    x = variables[value];
  } else {
    throw new Error(
      `Tried to evaluate a condition containing ${value}, but ${value} has not been declared!`
    );
  }

  return x;
};

export const parseVariable = (
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
