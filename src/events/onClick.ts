import { tokenize } from '../parser/tokenize';

export const onGenerateClick = (): void => {
  const textarea = document.getElementById('code-input') as HTMLTextAreaElement;
  const sourceCodeText = textarea.value;

  const tokens = tokenize(sourceCodeText);
  console.log(tokens);
};

export default onGenerateClick;
