import { Graphics } from "pixi.js";
import app, { graphics } from ".";
import { FunctionCallGraph } from "../parser/functionGraph";
import formatFuncName from "../utils/format";
import { drawCircle, drawText } from "./draw";

const drawFunctionGraphNode = (
  g: Graphics,
  funcName: string,
  x: number,
  y: number
): void => {
  const nodeRadius = 30;
  const nodeColour = 0xffdead;

  drawCircle(g, x, y, nodeRadius, nodeColour);
  drawText(g, formatFuncName(funcName), x, y);
};

const drawFunctionGraph = (functionCallGraph: FunctionCallGraph): void => {
  graphics.clear();

  const middleCanvas = app.view.width / 2;

  // main() function call
  drawFunctionGraphNode(graphics, functionCallGraph.name, middleCanvas, 50);
};

export default drawFunctionGraph;
