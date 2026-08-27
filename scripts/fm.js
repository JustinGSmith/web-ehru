import { init_fm  } from './pure.js';

function new_fm(ctx, params) {
  var fm = init_fm(params);

  const modulator = new OscillatorNode(
    ctx,
    {
      "frequency": fm.modulation_frequency,
      "type": "sine"
    });
  const depth = new GainNode(
    ctx,
    {
      "gain": fm.depth
    });
  const signal = new OscillatorNode(
    ctx,
    {
      "frequency": fm.carrier,
      "type": "sine"
    });
  const amp = new GainNode(
    ctx,
    {
      "gain": fm.amp
    });

  modulator.connect(depth)
  depth.connect(signal.frequency);
  signal.connect(amp);
  amp.connect(ctx.destination);

  fm.modulator = modulator;
  fm.depth = depth;
  fm.signal = signal;
  fm.output = amp;

  modulator.start();

  return fm;
}

function toggle_instrument(code, params) {
  // creates a function that starts or stops an instrument in an orchestra
  return (evt, press, ctx, orc) => {
    if (press) {
      orc.play(code, new_fm(ctx, params));
    } else {
      orc.stop(code);
    }
  }
}

const key_data = [
  {
    'element_id': "note1",
    'key': "a",
    'hz_low': 100,
    'hz_high': 10000,
    'modulation_hz': 6,
    'amp': 0.4,
    'dur': 200,
    'pan': -1
  },
  {
    'element_id': "note2",
    'key': "s",
    'hz_low': 220,
    'hz_high': 300,
    'modulation_hz': 21,
    'amp': 0.6,
    'dur': 200,
    'pan': 1
  },
  {
    'element_id': "note3",
    'key': "d",
    'hz_low': 413,
    'hz_high': 511,
    'modulation_hz': 111.111,
    'amp': 0.5,
    'dur': 200,
    'pan': 0
  },
  {
    'element_id': "note4",
    'key': "f",
    'hz_low': 20,
    'hz_high': 696.33,
    'modulation_hz': 300.111,
    'amp': 0.6,
    'dur': 200,
    'pan': 0
  },
  {
    'element_id': "note5",
    'key': "w",
    'hz_low': 1000,
    'hz_high': 1200,
    'modulation_hz': 202,
    'amp': 0.3,
    'dur': 200,
    'pan': 0
  }
];

var key_callbacks = {}

function key_callback(evt, ctx, orc) {

  if (evt["repeat"]) {
    console.log("key repeat ignored", evt.key);
    return;
  }

  const f = key_callbacks[evt.key]

  if (!f) {
    console.log("no binding for", evt.key, evt);
    return;
  }

  const press = evt.type == "keydown";

  f(evt, press, ctx, orc);
  return;
}

function create_fm_orchestra(ctx) {

  console.log("creating fm orchestra v0");
  var orchestra = {};

  function play(label, instance) {
    orchestra[label] = instance;
    instance.signal.start();
  }
  orchestra.play = play;

  function pause(label) {
    orchestra[label].signal.stop();
  }
  orchestra.pause = pause;

  function stop(label, instance) {
    pause(label);
    delete(orchestra[label]);
  }
  orchestra.stop = stop;

  return orchestra;
}

function fm_demo(audioCtx) {
  key_data.forEach((k) => {
    // hook up sliders etc.
    const element = document.getElementById(k.element_id);
    console.log(element)
    // hook up keypress
    key_callbacks[k.key] = toggle_instrument(k.key, k);
  });

  var orc = create_fm_orchestra(audioCtx);
  return orc;
}

export {
  fm_demo,
  key_callback
}
