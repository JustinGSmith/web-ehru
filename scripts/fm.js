import ops from './ops.js'

const slider_spec = {'min': 0, 'max': 100}

const as_amp = ops.amp_trans;

const as_hz = ops.translator({
  'i': slider_spec,
  'o': {'min': 20, 'max': 10000},
  'curve': 2
});

const as_mod = ops.translator({
  'i': slider_spec,
  'o': {'min': 0, 'max': 1000},
  'curve': 2
})

function voice(ctx, params) {
  const modulator = new OscillatorNode(
    ctx,
    {
      'frequency': params.modulation_frequency,
      'type': "sine"
    });
  const depth = new GainNode(
    ctx,
    {
      'gain': params.depth
    });
  const signal = new OscillatorNode(
    ctx,
    {
      'frequency': params.carrier,
      'type': "sine"
    });
  const amp = new GainNode(
    ctx,
    {
      'gain': 0
    });

  modulator.connect(depth);
  depth.connect(signal.frequency);
  signal.connect(amp);
  amp.connect(ctx.destination);

  modulator.start();
  signal.start();

  var volume = params.amp;

  return {
    'control': {
      'play': () => { amp.gain.value = volume; },
      'pause': () => { amp.gain.value = 0; }
    },
    'assign': {
      'mod': (x) => { modulator.frequency.value = as_mod.i(x) },
      'depth': (x) => { depth.gain.value = as_mod.i(x) },
      'hz': (x) => { signal.detune.value = as_hz.i(x) },
      'amp': (x) => {
        volume = as_amp.i(x);
        console.log("setting amp", volume);
        if (amp.gain.value != 0) {
          amp.gain.value = volume;
        }
      }
    },
    'read': {
      'mod': () => { return as_mod.o(modulator.frequency.value); },
      'depth': () => { return as_mod.o(depth.gain.value); },
      'hz': () => { return as_hz.o(signal.detune.value); },
      'amp': () => { return as_amp.o(volume); }
    }
  }
}

function init(context_class) {
  const ctx = new context_class()

  return (params) => {
    return voice(ctx, params);
  };
}


// > {default: fm} = await import('./scripts/fm.js')
export default {
  init,
  as_amp,
  as_hz,
  as_mod
}
