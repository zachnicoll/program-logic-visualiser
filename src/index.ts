import * as CodeMirror from "codemirror";
import { DEFAULT_TEXT } from "utils/constants";

import initialiseEventListeners from "./events/listeners";

const editor = CodeMirror.fromTextArea(
  document.getElementById("code-input") as HTMLTextAreaElement,
  {
    lineNumbers: true
  }
);

editor.setValue(DEFAULT_TEXT);

initialiseEventListeners();

export default editor;
