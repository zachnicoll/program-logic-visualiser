import { Application, Container, Graphics } from 'pixi.js';
import { initialiseEventListeners } from './events/listeners';

initialiseEventListeners();

// Create renderer and attach to DOM
const app = new Application({
  transparent: true, resolution: window.devicePixelRatio || 1,
});

const displayDiv = document.getElementById('container');

displayDiv.appendChild(app.view);

const container = new Container();
const graphics = new Graphics();

container.addChild(graphics);
app.stage.addChild(container);
