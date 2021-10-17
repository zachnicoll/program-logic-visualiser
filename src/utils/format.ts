export const formatFuncName = (funcName: string): string => `${funcName}()`;

export const formatDecisionLabel = (
  lhs: string,
  condition: string,
  rhs: string
): string => `${lhs} ${condition} ${rhs}`;

export default formatFuncName;
