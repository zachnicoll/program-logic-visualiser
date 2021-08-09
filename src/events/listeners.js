import { onGenerateClick } from "./onClick";

const textAreaListeners = () => {
  // Make sure tab-presses are inputted as tabs
  const textarea = document.getElementById('code-input');

  textarea.value = "func main() does\n\tperform HELLO_WORLD\nend"

  textarea.addEventListener('keydown', (e) => {
    if (e.key == "Tab") {
      e.preventDefault();
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;

      // set textarea value to: text before caret + tab + text after caret
      textarea.value = textarea.value.substring(0, start) +
        "\t" + textarea.value.substring(end);

      textarea.selectionStart =
        textarea.selectionEnd = start + 1;
    }
  });
}

const buttonListeners = () => {
  const generateButton = document.getElementById('generate-button');
  generateButton.addEventListener('click', onGenerateClick);
}

export const initialiseEventListeners = () => {
  textAreaListeners();
  buttonListeners();
}
