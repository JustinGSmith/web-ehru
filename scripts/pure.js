function linear(a,b, x,y) {
  // linear translation of numbers in range a ... b to range x ... y
  const pad = x
  const trim = a
  const scale = (y - x) / (b - a)
  function linear_projection(n) {
    return pad + (scale * (n - trim))
  }
  return linear_projection;
}

function amp_window(amp, dur) {
  // creates a windowing function in the shape of a sinusoid
  // start at nadir of sin's range
  var phase = Math.PI * 1.5;
  const increment = 2 * (Math.PI / dur);
  // translate from range of sin to 0 ... amp
  const lin = linear(-1,1, 0,amp)
  function window_f() {
    const scalar = Math.sin(phase);
    phase = phase + increment;
    return lin(scalar);
  }
  return window_f;
}

const tau = Math.PI * 2
const pan_phase_lin = linear(-1,1, (tau * 0.25),(tau * 0.75));
const pan_amp_lin = linear(-1,1, 0,1);

function pan_amps(n) {
  // for input -1, r will be at nadir, l will be at peak
  // for input 1, l will be at nadir, r will be at peak

  const pos = pan_phase_lin(n);

  return {
    l: pan_amp_lin(Math.sin(pos)),
    r: pan_amp_lin(Math.sin(pos + Math.PI))
  };
}

function init_granule(params) {
  let {sr, t, hz, amp, dur, pan} = params;
  var g = {};
  // the .t property is the delay in samples before the grain starts
  g.sr = sr;
  g.t = (t * sr) || 0;
  g.hz = hz || 440;
  g.amp = amp || 0.8;
  // 3 = cycle each for fade in + hold + fade out
  const duration_seconds = dur || 3 / g.hz;
  // duration in samples
  g.dur = sr * duration_seconds;
  g.win = amp_window(g.amp, g.dur);
  g.phase = 0;
  g.incr = (g.hz / sr) * tau
  g.pan = pan || 0.0;
  return g;
}

function new_granule(params) {
  var g = init_granule(params);

  const prefix_zero = {
    l: 0.0,
    r: 0.0,
    done: false
  };

  const postfix_zero = {
    l: 0.0,
    r: 0.0,
    done: true
  };

  function next_value() {
    // if we finished already, emit zeroes
    if (g.dur <= 0) {
      return postfix_zero;
    }
    // if we haven't started yet, emit zeroes
    if (g.t > 0) {
      g.t--;
      return prefix_zero;
    }

    g.dur--;

    const value = g.win() * Math.sin(g.phase);
    g.phase = (g.phase + g.incr) % tau;
    const amps = pan_amps(g.pan);
    return {
      l: value * amps.l,
      r: value * amps.r,
      done: false
    };
  }

  function fill(count) {
    var arr = Array(count);
    for (let i = 0; i < count; i++) {
      arr[i] = g.next_value();
    }
    return arr;
  }

  g.next_value = next_value;
  g.fill = fill;
  return g;
}

function init_fm(params) {
  var fm = {};
  let {hz_low, hz_high, modulation_frequency, amp, dur, pan} = params;
  fm.amp = amp || 0.8;
  fm.dur = dur || 1;
  fm.pan = pan || 0;
  fm.modulation_frequency = modulation_frequency;
  // range of sine is -1 to +1, so our absolute magnitude should be half our
  const center = hz_high - hz_low;
  // desired range
  fm.depth = center / 2;
  // range of sine is centered on zero, so we add an offset ensuring our
  // lowest frequency value is hz_low
  fm.carrier = hz_low + center;
  fm.win = amp_window(fm.amp, fm.dur)
  return fm;
}


export {
  linear,
  amp_window,
  pan_amps,
  new_granule,
  init_fm
}
