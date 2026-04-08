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
  it('should create a usable windowing function', () => {
    const win = amp_window(1.0, 16);

    assert.equal(win(), 0.0);
  })
})
