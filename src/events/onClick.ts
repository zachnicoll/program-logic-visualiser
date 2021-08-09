import { tokenize } from "../parser/tokenize";

export const onGenerateClick = () => {
  const textarea = document.getElementById('code-input') as HTMLTextAreaElement;
  const sourceCodeText = textarea.value;

  const tokens = tokenize(sourceCodeText);
}