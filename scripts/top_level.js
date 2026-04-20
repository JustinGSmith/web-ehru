import { init } from './app.js';

window.appContents = document.querySelector(".app-contents");
window.startMessage = document.querySelector(".start-message");

window.isAppInit = false;
window.appContents.style.display = "none";

window.addEventListener("keydown", init);
window.addEventListener("click", init);
