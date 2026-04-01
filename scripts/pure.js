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

const pan_lin = linear(-1,1, (Math.PI * 2 * 0.25),(Math.PI * 2 * 0.75));
const pan_amp_lin = linear(-1,1, 0,1);

function pan_amps(n) {
  // for input -1, r will be at nadir, l will be at peak
  // for input 1, l will be at nadir, r will be at peak

  pos = pan_lin(n);

  l = sin(pos + Math.PI);
  r = sin(pos);

  return [pan_amp_lin(l), pan_amp_lin(r)];
}

function new_granule(sr, t, hz, amp, dur, pan) {
  g = {};
  g.t = t || 0;
  g.hz = hz || 440;
  g.amp = amp || 0.8;
  // 3 = cycle each for fade in + hold + fade out
  g.dur = sr * (dur || 3  / g.hz);
  g.win = amp_window(g.amp, g.dur);
  g.pos = 0;
  g.phase = 0;
  g.incr = (g.hz / sr) * 2 * Math.PI;

  function next_value() {
    value = g.win() * Math.sin(g.phase);
    g.phase = (g.phase + g.incr) % (2 * Math.PI);
    g.pos = g.pos + 1;
    pan_a = pan_amps(pan);
    return [value * pan_a[0], value * pan_a[1]];
  }

  g.next_value = next_value;
  return g
}

export default { linear }
