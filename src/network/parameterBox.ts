import { VariableMap, GraphNode } from "parser/types";
import { drawLogicDiagram } from "./network";

const showParameterBox = (variables: VariableMap, node: GraphNode): void => {
  const inputs = Object.keys(variables).map((v) => {
    const label = document.createElement("label");
    label.setAttribute("for", v);
    label.innerHTML = `${v}: `;

    const input = document.createElement("input");
    input.setAttribute("type", "text");
    input.id = v;
    input.name = v;
    input.value = `${variables[v]}`;

    return { label, input };
  });

  const title = document.createElement("h1");
  title.innerHTML = "Parameters";

  const btn = document.createElement("button");
  btn.innerHTML = "Re-Evaluate";
  btn.onclick = (): void => drawLogicDiagram(node);

  const paramBox = document.getElementById("parameter-box");

  // Add title
  paramBox.append(title);

  // Add labels and inputs
  inputs.forEach(({ label, input }) => {
    paramBox.append(label);
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
