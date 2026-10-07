import { strict as assert } from 'node:assert';
import { join } from 'node:path';
import { describe, it } from 'node:test';

import { composeTwice } from '../src/determinism';
import { REPO_ROOT } from './support/paths';

const LEAKY = join(__dirname, 'support', 'leaky-compose.js');
const REQUEST = { tree: REPO_ROOT, entries: ['methodology/x'], params: {} };

function withLeak<T>(leak: string, body: () => T): T {
  const saved = process.env['LEAK'];
  process.env['LEAK'] = leak;
  try {
    return body();
  } finally {
    if (saved === undefined) delete process.env['LEAK'];
    else process.env['LEAK'] = saved;
  }
}

describe('composeTwice, with the real comparison', () => {
  it('passes a composition that reads nothing of its environment', () => {
    const result = withLeak('none', () => composeTwice(REQUEST, { cli: LEAKY }));
    assert.deepEqual(result, { code: 0, files: 1, message: 'byte-identical' });
  });

  for (const leak of ['tz', 'home', 'cwd', 'umask', 'locale', 'tmpdir']) {
    it(`catches a composition that reads its ${leak}`, () => {
      const result = withLeak(leak, () => composeTwice(REQUEST, { cli: LEAKY }));
      assert.equal(result.code, 1, result.message);
      assert.equal(result.message, 'not deterministic: leak.txt: the bytes differ');
    });
  }

  it('reports a killed composition as exit 2, with its signal', () => {
    const result = withLeak('kill', () => composeTwice(REQUEST, { cli: LEAKY }));
    assert.deepEqual(result, { code: 2, files: 0, message: 'killed by SIGKILL' });
  });

  it('keeps an I/O failure of the composition as exit 2', () => {
    const result = withLeak('io', () => composeTwice(REQUEST, { cli: LEAKY }));
    assert.deepEqual(result, { code: 2, files: 0, message: 'cannot write the output' });
  });

  it('reports a failing comparison as exit 2, not a crash', () => {
    const result = withLeak('none', () => composeTwice(REQUEST, {
      cli: LEAKY,
      compare: () => {
        throw new Error('EACCES: permission denied');
      },
    }));
    assert.deepEqual(result, { code: 2, files: 0, message: 'EACCES: permission denied' });
  });
});
