import { Application, Container, Graphics } from 'pixi.js';

// Create renderer and attach to DOM
const app = new Application({
  width: window.innerWidth, height: window.innerHeight, transparent: true, resolution: window.devicePixelRatio || 1,
});
document.body.appendChild(app.view);

const container = new Container();
const graphics = new Graphics();

container.addChild(graphics);
app.stage.addChild(container);

graphics.beginFill(0xDE3249);
graphics.drawRoundedRect(app.view.width / 2, app.view.height / 2, 100, 100, 16);
graphics.endFill();

app.ticker.add(() => {
  graphics.rotation += 0.01;
})
