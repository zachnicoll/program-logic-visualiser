import { onGenerateClick } from "./onClick";

const textAreaListeners = (): void => {
  // Make sure tab-presses are inputted as tabs
  const textarea = document.getElementById("code-input") as HTMLTextAreaElement;

  textarea.value = `
func a() does
  perform A_ACTION
end

func b() does
  perform B_ACTION
end

func c() does
  perform C_ACTION
  d()
end

func d() does
  perform D_ACTION
	b()
	a()
	e()
	f()
	g()
end

func e() does
  perform E_ACTION
end

func f() does
  perform F_ACTION
end

func g() does
  perform G_ACTION
end

func main() does
  perform HELLO_WORLD
  a()
  b()
  c()
  d()
  `;

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
