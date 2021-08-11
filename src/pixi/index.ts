import { Application, Graphics } from "pixi.js";

const app = new Application({
  transparent: true,
  resolution: window.devicePixelRatio || 1
});

export const graphics = new Graphics();
app.stage.addChild(graphics);

export default app;
