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

  orc.play(
    'melody',
    new_fm(
      audioCtx,
      {
        'hz_low': 100,
        'hz_high': 10000,
        'modulation_hz': 6,
        'amp': 0.4,
        'dur': 200,
        'pan': 0
      }));

  return orc;
}

const key_callbacks = {
  "a": (evt, press, ctx, orc) => {
    console.log("a", press);
  }
}

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
