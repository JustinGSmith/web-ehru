import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import pkg from '../scripts/pure.js';

const { linear } = pkg;

describe('linear', () => {
  it('should translate ranges', () => {
    const lin = linear(0,1, 0,100);

    assert.equal(lin(0.5), 50);
  })
})
