import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { linear } from './scripts/pure.js';

describe('linear', () => {
  it('should translate ranges', () => {
    const lin = linear(0,1, 0,100);

    assert.equals(lin(0.5), 50);
  })
})
