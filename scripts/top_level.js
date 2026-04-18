import init from './app.js';

const appContents = document.querySelector(".app-contents");
const startMessage = document.querySelector(".start-message");

window.isAppInit = false;
appContents.style.display = "none";

window.addEventListener("keydown", init);
window.addEventListener("click", init);
