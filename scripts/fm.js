import { init_fm  } from './pure.js';

function new_fm(ctx, params) {
  var fm = init_fm(params);

  const mod_params = {
    "frequency": fm.modulation_frequency,
    "type": "sine"
  };
  const modulator = new OscillatorNode(ctx, mod_params);
  fm.modulator = modulator;

  const depth = new GainNode(ctx, {"gain": fm.depth * 100});

  modulator.connect(depth)

  const carrier_params = {
    "frequency": fm.carrier,
    "type": "sine"
  }
  const signal = new OscillatorNode(ctx, carrier_params);
  fm.signal = signal;
  depth.connect(signal.frequency);

  const amp = new GainNode(ctx, {"gain": fm.amp});
  fm.output = amp;

  signal.connect(amp).connect(ctx.destination);
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
        'modulation_hz': 666,
        'amp': 0.4,
        'dur': 200,
        'pan': 0
      }));
}

export {
  fm_demo
}
