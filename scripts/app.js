import { fm_demo, key_callback  } from './fm.js';

function init() {
  if (window.isAppInit) {
    return;
  }

  // create web audio api context
  const audioContext = window.AudioContext || window.webkitAudioContext;
  const audioCtx = new audioContext();

  // gran.gran_demo(audioCtx);
  const orchestra = fm_demo(audioCtx);

  window.addEventListener(
    "keydown",
    (event) => {
      key_callback(event, audioCtx, orchestra);
    }
  );
  window.addEventListener(
    "keyup",
    (event) => {
      key_callback(event, audioCtx, orchestra);
    }
  );

  window.isAppInit = true;
}

export {
  init
}
