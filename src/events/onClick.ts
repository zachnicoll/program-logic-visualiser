import functionGraph from "../parser/functionGraph";
import tokenize from "../parser/tokenize";
import drawFunctionGraph from "../pixi/drawFunctionGraph";

export const onGenerateClick = (): void => {
  const textarea = document.getElementById("code-input") as HTMLTextAreaElement;
  const sourceCodeText = textarea.value;

  try {
    const tokens = tokenize(sourceCodeText);
    const funcGraph = functionGraph(tokens, sourceCodeText);
    drawFunctionGraph(funcGraph);
  } catch (e) {
    alert(`Syntax error! ${(e as Error).message}`);
  }
};

export default onGenerateClick;
