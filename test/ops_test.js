import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import ops from '../scripts/ops.js'

function epsilon(x, y, e) {
  return Math.abs(x - y) < e;
}

describe(
  'translate',
  () => {
    it(
      "should provide an invertable operation",
      () => {
        const spec = {
          'i': {'min': 0, 'max': 1},
          'o': {'min': 20, 'max': 20000},
          'curve': {'min': 1, 'max': 10, 'exp': 2}
        }
        const t = ops.translator(spec);
        assert(epsilon(0, t.o(t.i(0)), 0.001));
        assert(epsilon(0.5, t.o(t.i(0.5)), 0.001));
        assert(epsilon(1, t.o(t.i(1)), 0.001));
      }
    )
  }
);
