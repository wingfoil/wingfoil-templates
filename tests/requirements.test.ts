import { strict as assert } from 'node:assert';
import { describe, it } from 'node:test';

import { parseEntry, satisfies } from '../src/requirements';

describe('parseEntry', () => {
  const ranges: [string, string[], string[]][] = [
    ['^1', ['1.0.0', '1.9.9'], ['0.9.9', '2.0.0']],
    ['^1.2', ['1.2.0', '1.9.0'], ['1.1.9', '2.0.0']],
    ['^1.2.3', ['1.2.3', '1.3.0'], ['1.2.2', '2.0.0']],
    ['~1.2', ['1.2.0', '1.2.9'], ['1.3.0']],
    ['~1.2.3', ['1.2.3', '1.2.9'], ['1.2.2', '1.3.0']],
    ['1.2.3', ['1.2.3'], ['1.2.4']],
    ['>=1.2.0 <3.0.0', ['1.2.0', '2.9.9'], ['1.1.9', '3.0.0']],
  ];
  for (const [range, inside, outside] of ranges) {
    it(`reads ${range} and evaluates it`, () => {
      const entry = parseEntry(`blueprint/web@${range}`, 'requires');
      assert.deepEqual(entry, { id: 'blueprint/web', range });
      for (const version of inside) assert.equal(satisfies(version, range), true, version);
      for (const version of outside) assert.equal(satisfies(version, range), false, version);
    });
  }

  for (const range of ['^1 || ^2', '1.2.x', '1.0.0 - 2.0.0', '^1.0.0-rc.1', '*', '']) {
    it(`refuses the range ${JSON.stringify(range)}`, () => {
      assert.throws(() => parseEntry(`blueprint/web@${range}`, 'requires'), /not a valid/);
    });
  }

  it('accepts a bare id in conflicts only', () => {
    assert.deepEqual(parseEntry('blueprint/web', 'conflicts'), { id: 'blueprint/web' });
    assert.throws(() => parseEntry('blueprint/web', 'requires'), /not a valid/);
  });

  it('treats an empty intersection as unsatisfiable', () => {
    const { range } = parseEntry('blueprint/web@>=2.0.0 <1.0.0', 'requires');
    assert.equal(satisfies('1.5.0', range ?? ''), false);
  });

  it('never accepts a prerelease version', () => {
    assert.equal(satisfies('1.3.0-rc.1', '^1.2.0'), false);
  });
});
