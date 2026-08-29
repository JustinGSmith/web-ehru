function init_fm(params) {
  const center = (params.hz_high - params.hz_low) / 2;
  return {
    'amp': params.amp || 0.8,
    'pan': params.pan || 0,
    'modulation_frequency': params.modulation_frequency || params.hz_low,
    'depth': center,
    'carrier': params.hz_low + center,
  };
}

function voice(ctx, note_data) {
  var params = init_fm(note_data);

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

  modulator.connect(depth)
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
      'mod': (x) => { modulator.frequency.value = x },
      'depth': (x) => { depth.gain.value = x },
      'hz': (x) => { signal.detune.value = x },
      'amp': (x) => {
        volume = x * x; // square of 0..1 gets a decent curve
        if (amp.gain.value != 0) {
          amp.gain.value = x;
        }
      }
    }
  }
}

function init(context_class) {
  const ctx = new context_class()

  return (params) => {
    return voice(ctx, params);
  };
}


export default {
  init
}
