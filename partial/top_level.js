const appContents = document.querySelector(".app-contents");
const startMessage = document.querySelector(".start-message");
let isAppInit = false;
appContents.style.display = "none";

window.addEventListener("keydown", init);
window.addEventListener("click", init);
