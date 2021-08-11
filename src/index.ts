import app from "./pixi";
import initialiseEventListeners from "./events/listeners";

initialiseEventListeners();

// Attach render canvas to DOM
const displayDiv = document.getElementById("pixi-display");
displayDiv.appendChild(app.view);
