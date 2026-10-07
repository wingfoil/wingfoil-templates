import { strict as assert } from 'node:assert';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, relative } from 'node:path';
import { describe, it } from 'node:test';

import { FIXTURES, REPO_ROOT } from './support/paths';

const CLI = join(REPO_ROOT, 'dist', 'src', 'compose-cli.js');
const TREE = join(FIXTURES, 'compose', 'tree');
const EXPECTED = join(FIXTURES, 'compose', 'expected');
const ENTRIES = ['methodology/kanban', 'phase/inception/lean', 'blueprint/web-service',
  'team-mode/agent-first', 'stage/production'];
const PARAMS = ['--param', 'project_name=Golden', '--param', 'wip_limit=2'];

function run(args: string[]): { status: number | null; stderr: string } {
  const result = spawnSync(process.execPath, [CLI, ...args], { encoding: 'utf8' });
  return { status: result.status, stderr: result.stderr };
}

/** Every file under a directory, relative to it, in byte order. */
function filesUnder(root: string, dir = root): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => (entry.isDirectory()
    ? filesUnder(root, join(dir, entry.name))
    : [relative(root, join(dir, entry.name))]))
    .sort((a, b) => Buffer.compare(Buffer.from(a), Buffer.from(b)));
}

function withTemp(body: (dir: string) => void): void {
  const dir = mkdtempSync(join(tmpdir(), 'compose-cli-'));
  try {
    body(dir);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

describe('npm run compose', () => {
  it('composes the golden tree into exactly the expected files, byte for byte', () => {
    withTemp((dir) => {
      const out = join(dir, 'out');
      const result = run(['--tree', TREE, '--out', out, ...PARAMS, ...ENTRIES]);
      assert.equal(result.status, 0, result.stderr);
      const files = filesUnder(out);
      assert.deepEqual(files, filesUnder(EXPECTED));
      for (const file of files) {
        assert.ok(readFileSync(join(out, file)).equals(readFileSync(join(EXPECTED, file))), file);
      }
    });
  });

  it('exits 1 on a resolution error and on an undeclared parameter', () => {
    withTemp((dir) => {
      assert.equal(run(['--tree', TREE, '--out', join(dir, 'a'), ...PARAMS, 'blueprint/nope'])
        .status, 1);
      assert.equal(run(['--tree', TREE, '--out', join(dir, 'b'), ...PARAMS, '--param', 'nope=1',
        ...ENTRIES]).status, 1);
    });
  });

  it('exits 2 when --out exists and is not empty', () => {
    withTemp((dir) => {
      writeFileSync(join(dir, 'keep.txt'), 'project file\n');
      assert.equal(run(['--tree', TREE, '--out', dir, ...PARAMS, ...ENTRIES]).status, 2);
      assert.equal(readFileSync(join(dir, 'keep.txt'), 'utf8'), 'project file\n');
    });
  });

  it('exits 3 on bad usage', () => {
    withTemp((dir) => {
      const out = join(dir, 'out');
      assert.equal(run(['--tree', TREE, ...PARAMS, ...ENTRIES]).status, 3);
      assert.equal(run(['--tree', TREE, '--out', out, ...PARAMS]).status, 3);
      assert.equal(run(['--tree', TREE, '--out', out, '--param', 'novalue', ...ENTRIES]).status, 3);
      assert.equal(run(['--tree', TREE, '--out', out, ...PARAMS, '--param', 'wip_limit=4',
        ...ENTRIES]).status, 3);
      assert.equal(run(['--tree', TREE, '--out', out, '--unknown', ...ENTRIES]).status, 3);
    });
  });

  it('reads a value by its declared type', () => {
    withTemp((dir) => {
      const result = run(['--tree', TREE, '--out', join(dir, 'out'), '--param', 'project_name=007',
        '--param', 'wip_limit=two', ...ENTRIES]);
      assert.equal(result.status, 1);
      assert.match(result.stderr, /wip_limit.*integer/);
    });
  });
});
