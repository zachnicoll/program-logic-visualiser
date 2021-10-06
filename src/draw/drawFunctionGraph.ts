import { Graphics } from "pixi.js";
import app, { graphics } from ".";
import { FunctionCallGraph } from "../parser/types";
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

const maxChildWidth = (graph: FunctionCallGraph): void => {
  graph.width = graph.calls.length
    ? Math.max(
        graph.width,
        graph.calls.map((call) => call.width).reduce((p, c) => p + c)
      )
    : graph.width;

  graph.calls.forEach(maxChildWidth);
};

const nodeColumnWidth = (
  functionCallGraph: FunctionCallGraph
): FunctionCallGraph => {
  const fcg = functionCallGraph;

  // Recursively re-assign all the nodes in the graph with an object containing that node's width
  fcg.calls.forEach((call, i) => {
    fcg.calls[i] = nodeColumnWidth(call);
  });

  // Node width is equivalent to maximum number of child nodes in a row of nodes
  fcg.width = fcg.calls.length;
  maxChildWidth(fcg);

  return fcg;
};

const drawFunctionGraph = (functionCallGraph: FunctionCallGraph): void => {
  graphics.removeChildren();
  graphics.clear();

  const middleCanvas = app.view.width / 2;
  const baseY = -50; // Making it negative so I can do one function call to drawNodeRow, and it positions main() correctly
  const baseX = middleCanvas;

  const graphWithWidths = nodeColumnWidth(functionCallGraph);

  // Traverse graph and draw all nodes
  drawNodeRow(graphics, [graphWithWidths], baseX, baseY);
};

export default drawFunctionGraph;
