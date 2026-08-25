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
  signal.connect(amp)
  amp.connect(ctx.destination);

  fm.modulator = modulator;
  fm.depth = depth;
  fm.signal = signal;
  fm.output = amp;

  modulator.start();

  return fm;
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
  var orc = create_fm_orchestra(audioCtx);
  return orc;
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
    'key': "a",
    'hz_low': 100,
    'hz_high': 10000,
    'modulation_hz': 6,
    'amp': 0.4,
    'dur': 200,
    'pan': -1
  },
  {
    'key': "s",
    'hz_low': 220,
    'hz_high': 300,
    'modulation_hz': 21,
    'amp': 0.6,
    'dur': 200,
    'pan': 1
  },
  {
    'key': "d",
    'hz_low': 413,
    'hz_high': 511,
    'modulation_hz': 111.111,
    'amp': 0.5,
    'dur': 200,
    'pan': 0
  },
  {
    'key': "f",
    'hz_low': 20,
    'hz_high': 696.33,
    'modulation_hz': 300.111,
    'amp': 0.6,
    'dur': 200,
    'pan': 0
  }
];

var key_callbacks = {}

key_data.forEach((k) => {
  key_callbacks[k.key] = toggle_instrument(k.key, k);
});

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

export {
  fm_demo,
  key_callback
}
