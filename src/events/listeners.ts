import { DEFAULT_TEXT } from "utils/constants";
import { onGenerateClick } from "./onClick";

const textAreaListeners = (): void => {
  // Make sure tab-presses are inputted as tabs
  const textarea = document.getElementById("code-input") as HTMLTextAreaElement;

  // Set default value for text area
  textarea.value = DEFAULT_TEXT;

  textarea.addEventListener("keydown", (e) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;

      // set textarea value to: text before caret + tab + text after caret
      textarea.value = `${textarea.value.substring(
        0,
        start
      )}\t${textarea.value.substring(end)}`;

      textarea.selectionStart = start + 1;
      textarea.selectionEnd = start + 1;
    }
  });
};

const buttonListeners = (): void => {
  const generateButton = document.getElementById("generate-button");
  generateButton.addEventListener("click", onGenerateClick);
};

const initialiseEventListeners = (): void => {
  textAreaListeners();
  buttonListeners();
};

export default initialiseEventListeners;
