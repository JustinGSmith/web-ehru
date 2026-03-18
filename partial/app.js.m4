include(`partial/top_level.js.m4')dnl

function linear(a,b, x,y) {
  // linear translation of numbers in range a ... b to range x ... y
  pad = x
  trim = a
  scale = (y - x) / (b - a)
  function linear_projection(n) {
    return pad + (scale * (n - trim))
  }
  return linear_projection;
}

function amp_window(amp, dur) {
  // creates a windowing function in the shape of a sinusoid
  // start at nadir of sin's range
  phase = Math.PI * 1.5;
  increment = 2 * (Math.PI / dur);
  // translate from range of sin to 0 ... amp
  lin = linear(-1,1, 0,amp)
  function window_f() {
    scalar = Math.sin(phase);
    phase = phase + increment;
    return lin(scalar);
  }
  return window_f;
}

pan_lin = linear(-1,1, (Math.PI * 2 * 0.25),(Math.PI * 2 * 0.75));
pan_amp_lin = linear(-1,1, 0,1);

function pan_amps(n) {
  // for input -1, r will be at nadir, l will be at peak
  // for input 1, l will be at nadir, r will be at peak

  pos = pan_lin(n);

  l = sin(pos + Math.PI);
  r = sin(pos);

  return [pan_amp_lin(l), pan_amp_lin(r)];
}

function granule_init(ctx) {

  console.log("creating granule v0");
  granule = {};

  granule.buffer = new AudioBuffer({
    numberOfChannels: 2,
    length: ctx.sampleRate * 2.0,
    sampleRate: ctx.sampleRate
  });

  granule.granules = [];


  function new_granule(t, hz, amp, dur, pan) {
    g = {};
    g.t = t || 0;
    g.hz = hz || 440;
    g.amp = amp || 0.8;
    // 3 = cycle each for fade in + hold + fade out
    g.dur = ctx.sampleRate * (dur || 3  / g.hz);
    g.win = amp_window(g.amp, g.dur);
    g.pos = 0;
    g.phase = 0;
    g.incr = (g.hz / ctx.sampleRate) * 2 * Math.PI;

    function next_value() {
      value = g.win() * Math.sin(g.phase);
      g.phase = (g.phase + g.incr) % (2 * Math.PI);
      g.pos = g.pos + 1;
      pan_a = pan_amps(pan);
      return [value * pan_a[0], value * pan_a[1]];
    }

    g.next_value = next_value;
    granule.granules.push(g);
  }

  granule.new_granule = new_granule;

  function fill_buffer() {
      // This gives us the actual array that contains the data
    const buff_l = granule.buffer.getChannelData(0);
    const buff_r = granule.buffer.getChannelData(1);
    for (let i = 0; i < granule.buffer.length; i++) {
	nowBuffering[i] = Math.random() * 2 - 1;
      }
    }
    keep = []

    granule.granules.forEach((g) =>
    )

  }

  function play_buffer() {
    fill_buffer();
    source = ctx.createBufferSource();
    source.buffer = granule.buffer;
    source.connect(ctx.destination)
    source.start();
    source.onended = () => {
      play_buffer();
    }
  }

  return granule;
}

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
