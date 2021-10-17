import { VariableMap, GraphNode } from "parser/types";
import { parseValue } from "parser/valueParsers";
import { drawLogicDiagram } from "./network";

let dynamicVariables: VariableMap | null = null;

const showParameterBox = (variables: VariableMap, node: GraphNode): void => {
  dynamicVariables = { ...variables };

  const inputs = Object.keys(dynamicVariables).map((v) => {
    const container = document.createElement("div");

    const label = document.createElement("label");
    label.setAttribute("for", v);
    label.innerHTML = `${v}: `;

    const input = document.createElement("input");
    input.setAttribute("type", "text");
    input.id = v;
    input.name = v;
    input.value = `${dynamicVariables[v]}`;

    input.addEventListener("input", (e) => {
      dynamicVariables[v] = parseValue(
        (e.target as HTMLInputElement).value,
        {}
      );
    });

    container.append(label);
    container.append(input);

    return container;
  });

  const title = document.createElement("h2");
  title.innerHTML = "Parameters";

  const btn = document.createElement("button");
  btn.innerHTML = "Re-Evaluate";
  btn.onclick = (): void => drawLogicDiagram(node, dynamicVariables);

  const paramBox = document.getElementById("parameter-box");

  // Add title
  paramBox.append(title);

  // Add labels and inputs
  inputs.forEach((input) => {
    paramBox.append(input);
  });

  // Add button
  paramBox.append(btn);

  // Show the box
  paramBox.style.display = "flex";
};

export const destroyParameterBox = (): void => {
  const paramBox = document.getElementById("parameter-box");
  paramBox.innerHTML = "";
  paramBox.style.display = "none";
};

export default showParameterBox;
