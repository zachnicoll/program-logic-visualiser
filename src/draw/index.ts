import { Application, Graphics } from "pixi.js";
import { addStagePanListeners } from "../events/listeners";

const app = new Application({
  transparent: true,
  resolution: window.devicePixelRatio || 1,
  antialias: true,
  autoDensity: true,
  height: window.innerHeight,
  width: window.innerWidth * 0.66
});

export const graphics = new Graphics();

app.stage.addChild(graphics);

addStagePanListeners(app);

export default app;
