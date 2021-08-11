import app, { graphics } from ".";
import { FunctionCallGraph } from "../parser/functionGraph";

const drawFunctionGraph = (functionCallGraph: FunctionCallGraph): void => {
  graphics.clear();

  graphics.beginFill(0xffdead);
  graphics.drawCircle(50, 50, 50);
  graphics.endFill();
};

export default drawFunctionGraph;
