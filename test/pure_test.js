import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import pure from '../scripts/pure.js';

const { linear } = pure;

describe('linear', () => {
  it('should translate ranges', () => {
    const lin = linear(0,1, 0,100);

    assert.equal(lin(0.5), 50);
  })
})

const { amp_window } = pure;

describe('amp_window', () => {
  it('creates a usable windowing function', () => {
    const win = amp_window(1.0, 16);

    assert.equal(win(), 0.0);
    for (var i = 0; i < 7; i++) {
      const w = win();
      assert.equal(w > 0.0, true);
      assert.equal(w < 1.0, true);
    }
    assert.equal(win(), 1.0);
    for (var i = 0; i < 7; i++) {
      const w = win();
      assert.equal(w > 0.0, true);
      assert.equal(w < 1.0, true);
     }
    assert.equal(win(), 0.0);
  })
})

const { pan_amps } = pure;

describe('pan_amps', () => {
  it('creates a usable pan amplitude pair', () => {
    assert.equal(pan_amps(-1).l, 1);
    assert.equal(pan_amps(-1).r, 0);

    assert.equal(pan_amps(1).l, 0);
    assert.equal(pan_amps(1).r, 1);

    const center = pan_amps(0)
    const center_drift = center.l - center.r;
    assert.equal(Math.abs(center_drift) < 0.0001, true);
  })
})

const { new_granule } = pure;

describe ('new_granule', () => {
  it('creates a well behaved granule', () => {
    const g = new_granule(4400, 0, 440, 0, 10, 0);
  })
})
