import { Application, Graphics } from "pixi.js";

const app = new Application({
  transparent: true,
  resolution: window.devicePixelRatio || 1,
  antialias: true,
  autoDensity: true,
  height: window.innerHeight,
  width: window.innerWidth * 0.66,
});

export const graphics = new Graphics();
app.stage.addChild(graphics);

export default app;
