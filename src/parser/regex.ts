/**
 * @example func a(x,y) does
 */
export const funcDeclarationRegex =
  /func ([a-zA-Z_]+)(\((?:[a-zA-Z_ ]+[,]?)*\)) does\n/g;

/**
 * Groups function name and paremeters inside function call
 * @example a(x,y)
 */
export const functionCallRegex = /([a-zA-Z_]+)\((?:[a-zA-Z_ ]+[,]?)*\)/g;

/**
 * Groups left side, conditional symbol, and right side of statement e.g.
 * if (x) (==) (true) then
 * @example if x == true then
 */
export const ifStatementRegex =
  /if ([a-zA-Z_]+) (==|!=|<|<=|>|>=) ([0-9]+|true|false|[a-zA-Z_]+) then/g;

/**
 * Groups variable name and variable value
 * @example let my_variable = true
 */
export const variableDeclarationRegex =
  /let ([a-zA-Z_]+) = (true|false|[a-zA-Z_]+|[0-9]+)/g;

/**
 * Groups variable name and variable value
 * @example my_variable = true
 */
export const variableAssignmentRegex =
  /([a-zA-Z_]+) = (true|false|[a-zA-Z_]+|[0-9]+)/g;

/**
 * Groups the name of the action
 * @example perform ACTION_X
 */
export const actionRegex = /perform ([a-zA-Z_]+)/g;

/**
 * @example else
 */
export const elseRegex = /else/g;
