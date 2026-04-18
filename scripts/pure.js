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

// TODO - break this down into smaller parts
function new_granule(params) {
  let {sr, t, hz, amp, dur, pan} = params;
  var g = {};
  // the .t property is the delay in samples before the grain starts
  g.t = t || 0;
  g.hz = hz || 440;
  g.amp = amp || 0.8;
  // 3 = cycle each for fade in + hold + fade out
  g.dur = sr * (dur || 3  / g.hz);
  g.win = amp_window(g.amp, g.dur);
  g.phase = 0;
  g.incr = (g.hz / sr) * tau;

  function next_value() {
    if (g.dur <= 0) {
      return {
	l: 0.0,
	r: 0.0,
	done: true
      };
    }
    if (g.t > 0) {
      g.t--;
      return {
	l: 0.0,
	r: 0.0
      };
    }
    g.dur--;
    const value = g.win() * Math.sin(g.phase);
    g.phase = (g.phase + g.incr) % tau;
    const amps = pan_amps(pan);
    return {
      l: value * ampls.l,
      r: value * amps.r
    };
  }

  g.next_value = next_value;
  return g
}

export default {
  linear,
  amp_window,
  pan_amps,
  new_granule
}
