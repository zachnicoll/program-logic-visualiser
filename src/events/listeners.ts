import { onGenerateClick } from "./onClick";

const buttonListeners = (): void => {
  const generateButton = document.getElementById("generate-button");
  generateButton.addEventListener("click", onGenerateClick);
};

const initialiseEventListeners = (): void => {
  buttonListeners();
};

export default initialiseEventListeners;
