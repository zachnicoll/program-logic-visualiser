import { Graphics } from "pixi.js";
import app, { graphics } from ".";
import { FunctionCallGraph } from "../parser/functionGraph";
import formatFuncName from "../utils/format";
import { drawCircle, drawText } from "./draw";

const nodeRadius = 40;
const nodeColour = 0xffdead;
const xNodeSpacing = 75;
const yNodeSpacing = 100;

const drawFunctionGraphNode = (
  g: Graphics,
  funcName: string,
  x: number,
  y: number
): void => {
  drawCircle(g, x, y, nodeRadius, nodeColour);
  drawText(g, formatFuncName(funcName), x, y);
};

const drawNodeRow = (
  g: Graphics,
  calls: FunctionCallGraph[],
  baseX: number,
  baseY: number
): void => {
  const numNodes = calls.length;
  const xIncrement = nodeRadius + xNodeSpacing;

  // X position for the first node on the left, centered around the parent node's x (baseX)
  const startingX =
    baseX - (numNodes > 1 ? (numNodes / 2) * xIncrement - xIncrement / 2 : 0);

  calls.forEach((call, i) => {
    const x = startingX + i * xIncrement;
    const y = baseY + yNodeSpacing;
    drawFunctionGraphNode(g, call.name, x, y);

    drawNodeRow(g, call.calls, x, y);
  });
};

const drawFunctionGraph = (functionCallGraph: FunctionCallGraph): void => {
  graphics.removeChildren();
  graphics.clear();

  const middleCanvas = app.view.width / 2;
  const baseY = -50; // Making it negative so I can do one function call to drawNodeRow, and it positions main() correctly
  const baseX = middleCanvas;

  // Traverse graph and draw all nodes
  drawNodeRow(graphics, [functionCallGraph], baseX, baseY);
};

export default drawFunctionGraph;
