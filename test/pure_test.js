import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { linear, amp_window, pan_amps, new_granule } from '../scripts/pure.js';

describe('linear', () => {
  it('should translate ranges', () => {
    const lin = linear(0,1, 0,100);

    assert.equal(lin(0.5), 50);
  })
})

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

describe ('new_granule', () => {
  it('creates a well behaved granule', () => {
    const granule_params = {
      sr: 44100,
      t: 0,
      hz: 440,
      amp: 0,
      dur: 10,
      pan: 0
    }
    const g = new_granule(granule_params);
    for (let i = 0; i < 10 * granule_params.sr; i++) {
      const frame = g.next_value();
      // console.log(frame);
      assert.equal(frame.done, false);
    }
    const frame_after_end = g.next_value();
    // console.log(frame_after_end);
    assert.equal(frame_after_end.done, true);
  })
})
