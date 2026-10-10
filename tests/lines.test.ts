import { strict as assert } from 'node:assert';
import { describe, it } from 'node:test';

import { LineError, decideLine, lineName } from '../src/lines';
import type { LineInput } from '../src/lines';

const FORMATS = { workflow: 1 };
const published = (...versions: string[]): LineInput['published'] =>
  versions.map((version) => ({ version, formats: FORMATS }));

function input(changes: Partial<LineInput>): LineInput {
  return { pack: 'base', version: '1.0.1', formats: FORMATS, branch: 'main',
    published: published('1.0.0', '2.0.0'), fromOne: true, descends: () => true, ...changes };
}

function refused(changes: Partial<LineInput>, pattern: RegExp): void {
  assert.throws(() => decideLine(input(changes)),
    (error: unknown) => error instanceof LineError && pattern.test(error.message));
}

describe('decideLine (F5.3, dl-002)', () => {
  it('before WingFoil 1.0: one living line, and no maintenance branch', () => {
    assert.equal(lineName(decideLine(input({ fromOne: false, version: '2.1.0' }))), 'current');
    refused({ fromOne: false, version: '1.0.1' }, /not above the published 2\.0\.0/);
    refused({ fromOne: false, branch: 'maint/base/1.x' }, /start with WingFoil 1\.0/);
  });

  it('from WingFoil 1.0: the current line takes a newer version from any other branch', () => {
    assert.equal(lineName(decideLine(input({ version: '2.1.0', branch: 'task/x' }))), 'current');
    refused({ version: '1.0.1', branch: 'main' }, /maint\/base\/<major>\.x/);
  });

  it('N-1: a patch or a minor above the line\'s newest, on maint/<pack>/<major>.x', () => {
    for (const version of ['1.0.1', '1.1.0']) {
      assert.equal(lineName(decideLine(input({ version, branch: 'maint/base/1.x' }))), '1.x');
    }
  });

  it('refuses another pack\'s branch, another major, N-2, a lower version, a format move', () => {
    refused({ branch: 'maint/methodology/kanban/1.x' }, /not of base/);
    refused({ branch: 'maint/base/2.x' }, /not on the line 2\.x/);
    refused({ version: '2.0.1', branch: 'maint/base/1.x' }, /not on the line 1\.x/);
    refused({ branch: 'maint/base/1.x', published: published('1.0.0', '2.0.0', '3.0.0') },
      /N-1 is 2\.x/);
    refused({ version: '1.0.0', branch: 'maint/base/1.x' }, /not above 1\.0\.0/);
    refused({ branch: 'maint/base/1.x', formats: { workflow: 2 } }, /format move/);
  });

  it('refuses a branch whose head does not descend from the line\'s newest tag', () => {
    refused({ branch: 'maint/base/1.x', descends: () => false },
      /does not descend from base@1\.0\.0/);
  });

  it('treats every maint/ branch as a maintenance branch, a malformed name refused', () => {
    for (const branch of ['maint/base', 'maint/base/1.x-old']) {
      refused({ fromOne: false, branch, version: '3.0.0' }, /start with WingFoil 1\.0/);
      refused({ branch, version: '3.0.0' }, /not a maintenance branch name/);
    }
  });

  it('names a missing N-1: no older major published', () => {
    refused({ branch: 'maint/base/1.x', published: published('2.0.0') },
      /N is 2\.x and no older major is published/);
  });

  it('a detached HEAD is on the current line', () => {
    assert.equal(lineName(decideLine(input({ version: '2.1.0', branch: '' }))), 'current');
  });
});
