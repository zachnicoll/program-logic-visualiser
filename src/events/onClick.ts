import editor from "index";
import createNetwork from "../network/network";
import functionGraph from "../parser/functionGraph";
import tokenize from "../parser/tokenize";

export const onGenerateClick = (): void => {
  const sourceCodeText = editor.getValue();

  try {
    const tokens = tokenize(sourceCodeText);
    const funcGraph = functionGraph(tokens, sourceCodeText);

    createNetwork(funcGraph);
  } catch (e) {
    alert(`Syntax error! ${(e as Error).message}`);
  }
};

export default onGenerateClick;
