import app from "./pixi";
import initialiseEventListeners from "./events/listeners";

initialiseEventListeners();

// Attach render canvas to DOM
const displayDiv = document.getElementById("container");
displayDiv.appendChild(app.view);
