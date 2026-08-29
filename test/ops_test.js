import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import ops from '../scripts/ops.js'

describe(
  'translate',
  () => {
    it(
      "should provide an invertable operation",
      () => {
        const spec = {
          'i': {'min': 0, 'max': 1},
          'o': {'min': 20, 'max': 20000},
          'curve': 2
        }
        const t = ops.translator(spec);
        assert.equal(0, t.o(t.i(0)));
        assert.equal(0.5, t.o(t.i(0.5)));
        assert.equal(1, t.o(t.i(1)));
      }
    )
  }
);
