import { fm_demo  } from './fm.js';

function init() {
  if (window.isAppInit) {
    return;
  }

  window.appContents.style.display = "block";
  document.body.removeChild(startMessage);

  // create web audio api context
  const audioContext = window.AudioContext || window.webkitAudioContext;
  const audioCtx = new AudioContext();

  // gran.gran_demo(audioCtx);
  fm_demo(audioCtx);

  window.isAppInit = true;
}

export {
  init
}
