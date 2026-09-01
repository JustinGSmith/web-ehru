function log_n(x, n) {
  return Math.log(x) / Math.log(n);
}

function translator(spec) {
  // translates between a linear range (i) and a curved one (o)
  var i = {'min': spec.i.min, 'max': spec.i.max};
  var c = {'min': spec.curve.min, 'max': spec.curve.max};
  var o = {'min': spec.o.min, 'max': spec.o.max};
  const apply_curve = (x) => {
    return Math.pow(spec.curve.exp, x);
  }
  const remove_curve = (x) => {
    return log_n(x, spec.curve.exp);
  }
  i.spread = i.max - i.min;
  c.spread_in = c.max - c.min;
  c.min_out = apply_curve(c.min);
  c.spread_out = apply_curve(c.max) - apply_curve(c.min);
  o.spread = o.max - o.min;
  o.gain = o.spread / c.spread_out;
  i.gain = c.spread_in / i.spread;

  return {
    'i': (x) => {
      const linear_trimmed = x - i.min;
      const linear_scaled = linear_trimmed * i.gain;
      const linear_padded = linear_scaled + c.min;
      const curved = apply_curve(linear_padded);
      const curve_trimmed = curved - c.min_out;
      const curve_scaled = o.gain * curve_trimmed;
      const curve_padded = spec.o.min + curve_scaled;

      // console.log({x, linear_trimmed, linear_scaled, linear_padded, curved,
      //   curve_trimmed, curve_scaled, curve_padded});
      return curve_padded;
    },
    'o': (x) => {
      const curve_unpadded = x - spec.o.min;
      const curve_unscaled = curve_unpadded / o.gain;
      const curve_untrimmed = curve_unscaled + c.min_out;
      const uncurved = remove_curve(curve_untrimmed);
      const linear_unpadded = uncurved - c.min
      const linear_unscaled = linear_unpadded / i.gain;
      const linear_untrimmed = linear_unscaled + i.min;

      // console.log({x, curve_unpadded, curve_unscaled, curve_untrimmed,
      //   uncurved, linear_unpadded, linear_unscaled, linear_untrimmed});
      return linear_untrimmed;
    }
  }
}

const amp_trans = {
  'i': (x) => {
    const v = x / 100;
    return v*v;
  },
  'o': (x) => {
    const v = Math.sqrt(x);
    return v * 100;
  }
}


export default {
  translator,
  amp_trans
}
