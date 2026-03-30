function oscillator_init(ctx, win) {
  console.log("creating osc v1");
  // create Oscillator and gain node
  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();

  // connect oscillator to gain node to speakers
  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);

  // set options for the oscillator
  oscillator.detune.value = 100; // value in cents
  oscillator.start(0);

  oscillator.onended = function () {
    console.log("Your tone has now stopped playing!");
  };

  osc = {}

  osc.frequency = oscillator.frequency;
  osc.gain = gainNode;
  osc.maxFreq = 6000;
  osc.maxVol = 0.02;
  osc.initialVol = 0.001;
  osc.WIDTH = win.innerWidth;
  osc.HEIGHT = win.innerHeight;

  gainNode.gain.value = osc.initialVol;
  gainNode.gain.minValue = osc.initialVol;
  gainNode.gain.maxValue = osc.initialVol;

  console.log(osc);
  return osc;
}

function init() {
  if (isAppInit) {
    return;
  }

  appContents.style.display = "block";
  document.body.removeChild(startMessage);

  // create web audio api context
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  const audioCtx = new AudioContext();

  osc = oscillator_init(audioCtx, window);

  // Mouse pointer coordinates
  let CurX;
  let CurY;

  // Get new mouse pointer coordinates when mouse is moved
  // then set new gain and pitch values
  document.onmousemove = updatePage;

  function updatePage(e) {
    KeyFlag = false;

    CurX = e.pageX;
    CurY = e.pageY;

    osc.frequency.value = (CurX / osc.WIDTH) * osc.maxFreq;
    osc.gain.gain.value = (CurY / osc.HEIGHT) * osc.maxVol;

    canvasDraw();
  }

  // mute button
  const mute = document.querySelector(".mute");

  mute.onclick = function () {
    if (mute.getAttribute("data-muted") === "false") {
      osc.gain.disconnect(audioCtx.destination);
      mute.setAttribute("data-muted", "true");
      mute.innerHTML = "Unmute";
    } else {
      osc.gain.connect(audioCtx.destination);
      mute.setAttribute("data-muted", "false");
      mute.innerHTML = "Mute";
    }
  };

  // canvas visualization
  function random(number1, number2) {
    return number1 + (Math.floor(Math.random() * (number2 - number1)) + 1);
  }

  const canvas = document.querySelector(".canvas");
  const canvasCtx = canvas.getContext("2d");

  canvas.width = osc.WIDTH;
  canvas.height = osc.HEIGHT;

  function canvasDraw() {
    if (KeyFlag) {
      rX = KeyX;
      rY = KeyY;
    } else {
      rX = CurX;
      rY = CurY;
    }

    rC = Math.floor((osc.gain.gain.value / osc.maxVol) * 30);

    canvasCtx.globalAlpha = 0.2;

    for (let i = 1; i <= 15; i = i + 2) {
      canvasCtx.beginPath();
      canvasCtx.fillStyle =
        "rgb(" +
        100 +
        i * 10 +
        "," +
        Math.floor((osc.gain.gain.value / osc.maxVol) * 255) +
        "," +
        Math.floor((osc.frequency.value / osc.maxFreq) * 255) +
        ")";
      canvasCtx.arc(
        rX + random(0, 50),
        rY + random(0, 50),
        rC / 2 + i,
        (Math.PI / 180) * 0,
        (Math.PI / 180) * 360,
        false
      );
      canvasCtx.fill();
      canvasCtx.closePath();
    }
  }

  // clear screen
  const clear = document.querySelector(".clear");

  clear.onclick = function () {
    canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
  };

  // keyboard controls
  const body = document.querySelector("body");

  let KeyX = 1;
  let KeyY = 0.01;
  let KeyFlag = false;

  const ARROW_LEFT = "ArrowLeft";
  const ARROW_RIGHT = "ArrowRight";
  const ARROW_UP = "ArrowUp";
  const ARROW_DOWN = "ArrowDown";

  body.onkeydown = function (e) {
    KeyFlag = true;

    if (e.code === ARROW_LEFT) {
      KeyX -= 20;
    }

    if (e.code === ARROW_RIGHT) {
      KeyX += 20;
    }

    if (e.code === ARROW_UP) {
      KeyY -= 20;
    }

    if (e.code === ARROW_DOWN) {
      KeyY += 20;
    }

    // set max and min constraints for KeyX and KeyY
    if (KeyX < 1) {
      KeyX = 1;
    }

    if (KeyX > osc.WIDTH) {
      KeyX = osc.WIDTH;
    }

    if (KeyY < 0.01) {
      KeyY = 0.01;
    }

    if (KeyY > osc.HEIGHT) {
      KeyY = osc.HEIGHT;
    }

    osc.frequency.value = (KeyX / osc.WIDTH) * osc.maxFreq;
    osc.gain.gain.value = (KeyY / osc.HEIGHT) * osc.maxVol;

    canvasDraw();
  };

  isAppInit = true;
}

