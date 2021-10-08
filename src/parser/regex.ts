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
 * @example if x == true then
 */
export const ifStatementRegex =
  /if ([a-zA-Z_]+) (==|!=) ([0-9]+|true|false) then/g;
