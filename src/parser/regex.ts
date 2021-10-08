/**
 * @example func a(x,y) does
 */
export const funcDeclarationRegex =
  /func ([a-zA-Z_]+)(\((?:[a-zA-Z_ ]+[,]?)*\)) does\n/g;

/**
 * @example a(x,y)
 */
export const functionCallRegex = /[a-zA-Z_]+\((?:[a-zA-Z_ ]+[,]?)*\)/g;

/**
 * Groups left side, conditional symbol, and right side of statement e.g.
 * if (x) (==) (true) then
 * @example if x == true then
 */
export const ifStatementRegex =
  /if ([a-zA-Z_]+) (==|!=) ([0-9]+|true|false) then/g;
