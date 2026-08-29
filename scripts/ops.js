function log_n(x, n) {
  return Math.log(x) / Math.log(n);
}

function translator(spec) {
  // translates between a linear range (i) and a curved one (o)
  var i = {};
  var o = {};
  const apply_curve = (x) => {
    return Math.pow(spec.curve, x);
  }
  const remove_curve = (x) => {
    return log_n(x, spec.curve);
  }
  i.spread = spec.i.max - spec.i.min;
  o.spread = remove_curve(spec.o.max - spec.o.min);
  o.gain = o.spread / i.spread;
  i.gain = i.spread / o.spread;

  return {
    'i': (x) => {
      const trimmed = x - spec.i.min;
      const scaled = o.gain * trimmed;
      const curved = apply_curve(scaled);
      const padded = spec.o.min + curved;
      return padded;
    },
    'o': (x) => {
      const unpadded = x - spec.o.min;
      const uncurved = remove_curve(unpadded)
      const unscaled = i.gain * uncurved;
      const untrimmed = spec.i.min + unscaled;
      return untrimmed;
    }
  }
}


export default {
  translator
}
