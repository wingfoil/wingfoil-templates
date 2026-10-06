import { strict as assert } from 'node:assert';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, it } from 'node:test';

import { checkPins, runCheckPins } from '../src/check-pins';

const FIELDS = ['dependencies', 'devDependencies', 'optionalDependencies', 'peerDependencies'];

function lockFor(deps: Record<string, string>): unknown {
  const packages: Record<string, unknown> = { '': {} };
  for (const [name, version] of Object.entries(deps)) {
    const alias = /^npm:(.+)@([^@]+)$/.exec(version);
    packages[`node_modules/${name}`] = alias
      ? { name: alias[1], version: alias[2] }
      : { version };
  }
  return { lockfileVersion: 3, packages };
}

describe('checkPins', () => {
  it('accepts exact versions that match the lockfile', () => {
    const manifest = {
      dependencies: { yaml: '2.9.1' },
      devDependencies: { typescript: '6.0.3' },
    };
    const lock = lockFor({ yaml: '2.9.1', typescript: '6.0.3' });
    assert.deepEqual(checkPins(manifest, lock), []);
  });

  it('accepts an npm alias pinned to an exact version', () => {
    const manifest = { devDependencies: { 'wingfoil-0.2.2': 'npm:wingfoil@0.2.2' } };
    const lock = lockFor({ 'wingfoil-0.2.2': 'npm:wingfoil@0.2.2' });
    assert.deepEqual(checkPins(manifest, lock), []);
  });

  for (const field of FIELDS) {
    for (const spec of ['^1.2.3', '~1.2.3', '>=1.2.3', '*', '1.x', 'latest', '', '1.2', 'npm:x@^1.0.0',
      'git+https://example.invalid/x.git', 'file:../x']) {
      it(`rejects ${JSON.stringify(spec)} in ${field}, naming the dependency`, () => {
        const manifest = { [field]: { dep: spec } };
        const problems = checkPins(manifest, lockFor({}));
        assert.equal(problems.length, 1, problems.join('\n'));
        assert.match(problems[0] ?? '', /\bdep\b/);
        assert.match(problems[0] ?? '', new RegExp(field));
      });
    }
  }

  it('accepts a scoped package and a scoped alias', () => {
    const manifest = { dependencies: { '@s/n': '1.0.0', alias: 'npm:@s/x@1.2.3' } };
    const lock = lockFor({ '@s/n': '1.0.0', alias: 'npm:@s/x@1.2.3' });
    assert.deepEqual(checkPins(manifest, lock), []);
  });

  for (const spec of ['01.2.3', '1.2.3-rc.1', '1.2.3+build', 'npm:x', 123]) {
    it(`rejects ${JSON.stringify(spec)}: exact means MAJOR.MINOR.PATCH, no prerelease or build`, () => {
      assert.equal(checkPins({ dependencies: { dep: spec } }, lockFor({})).length, 1);
    });
  }

  it('rejects a lockfile version that differs from package.json', () => {
    const manifest = { dependencies: { yaml: '2.9.1' } };
    const problems = checkPins(manifest, lockFor({ yaml: '2.9.0' }));
    assert.equal(problems.length, 1);
    assert.match(problems[0] ?? '', /yaml/);
    assert.match(problems[0] ?? '', /2\.9\.0/);
  });

  it('rejects a dependency missing from the lockfile', () => {
    const manifest = { dependencies: { yaml: '2.9.1' } };
    const problems = checkPins(manifest, lockFor({}));
    assert.equal(problems.length, 1);
    assert.match(problems[0] ?? '', /yaml/);
  });

  it('rejects an alias whose lockfile entry is another package', () => {
    const manifest = { devDependencies: { wf: 'npm:wingfoil@0.2.2' } };
    const lock = { lockfileVersion: 3, packages: { 'node_modules/wf': { name: 'other', version: '0.2.2' } } };
    assert.equal(checkPins(manifest, lock).length, 1);
  });

  it('reports problems in a stable, sorted order', () => {
    const manifest = { devDependencies: { zeta: '^1.0.0', alpha: '~1.0.0' }, dependencies: { mid: '*' } };
    const problems = checkPins(manifest, lockFor({}));
    assert.deepEqual(problems, [...problems].sort());
    assert.equal(problems.length, 3);
  });
});

describe('runCheckPins', () => {
  function withDir(files: Record<string, string>, body: (dir: string) => void): void {
    const dir = mkdtempSync(join(tmpdir(), 'check-pins-'));
    try {
      for (const [name, text] of Object.entries(files)) writeFileSync(join(dir, name), text);
      body(dir);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  }

  it('fails with code 2 when the lockfile is missing', () => {
    withDir({ 'package.json': '{"dependencies":{"yaml":"2.9.1"}}' }, (dir) => {
      const result = runCheckPins(dir);
      assert.equal(result.code, 2);
      assert.match(result.messages.join('\n'), /package-lock\.json/);
    });
  });

  it('fails with code 2 when a file is not JSON', () => {
    withDir({ 'package.json': '{', 'package-lock.json': '{}' }, (dir) => {
      assert.equal(runCheckPins(dir).code, 2);
    });
  });

  it('fails with code 2 when package.json is not an object', () => {
    withDir({ 'package.json': '[]', 'package-lock.json': JSON.stringify(lockFor({})) }, (dir) => {
      assert.equal(runCheckPins(dir).code, 2);
    });
  });

  it('fails with code 2 on a lockfile without packages (lockfileVersion 1)', () => {
    withDir({ 'package.json': '{}', 'package-lock.json': '{"lockfileVersion":1}' }, (dir) => {
      const result = runCheckPins(dir);
      assert.equal(result.code, 2);
      assert.match(result.messages.join('\n'), /packages/);
    });
  });

  it('fails with code 1 and lists the problems', () => {
    withDir({
      'package.json': '{"dependencies":{"yaml":"^2.9.1"}}',
      'package-lock.json': JSON.stringify(lockFor({ yaml: '2.9.1' })),
    }, (dir) => {
      const result = runCheckPins(dir);
      assert.equal(result.code, 1);
      assert.equal(result.messages.length, 1);
    });
  });

  it('passes on this repository', () => {
    const result = runCheckPins(join(__dirname, '..', '..'));
    assert.deepEqual(result, { code: 0, messages: [] });
  });
});
