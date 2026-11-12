// Split from tests/validate.test.ts (task-089); the helpers in tests/support/validate-harness.ts.
import { strict as assert } from 'node:assert';
import { readFileSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { describe, it } from 'node:test';

import { REPO_ROOT } from './support/paths';
import { publishByHand, treeRepo } from './support/published-repo';
import { TREE, ENTRIES, NAME, validate, withTree, replaceIn } from './support/validate-harness';

describe('npm run validate', () => {
  it('fixes the mode by the caller: --mode is not an option', () => {
    assert.equal(validate(['--mode', 'publication']).code, 3);
    assert.equal(validate(['--mode=self-test']).code, 3);
  });

  it('accepts a tree given as a relative path', () => {
    const result = validate(['--tree', relative(process.cwd(), TREE), ...NAME]);
    assert.equal(result.code, 0, result.lines.join('\n'));
  });

  it('reports the preset and the given entries', () => {
    const result = validate(['--tree', TREE, '--param', 'project_name=Golden',
      '--param', 'wip_limit=4', ...ENTRIES]);
    assert.equal(result.code, 1, 'wip_limit is set by the preset');
    const entries = validate(['--tree', TREE, ...NAME, ...ENTRIES]);
    assert.equal(entries.code, 0, entries.lines.join('\n'));
    assert.ok(entries.lines.includes('compositions: 14'));
    assert.ok(entries.lines.some((line) => line.startsWith('composition entries: composed twice')));
  });

  it('validates this repository: base, software, methodology/scrum and methodology/kanban, their '
    + 'two presets and nine examples, on 0.3.0 and the newest release (task-039, task-047, '
    + 'task-055, task-059, task-067, task-074, task-079, task-090)', () => {
      const result = validate(['--tree', REPO_ROOT]);
      assert.equal(result.code, 0, result.lines.join('\n'));
      assert.ok(result.lines.includes('schemas: checked 8 files, 0 problems'));
      assert.ok(result.lines.includes('lint: checked 76 files, 0 problems'));
      assert.ok(result.lines.includes('compositions: 11'));
      assert.ok(result.lines.includes(
        'matrix: self-test, 22 runs, 0 failed, tolerance applied: none'), result.lines.join('\n'));
    });

  it('validates software through its fixture methodology: the four governed repositories\' '
    + 'parameter sets (task-047, task-049, task-067)', () => {
    const result = validate(['--tree', REPO_ROOT, '--overlay', 'tests/fixtures/software-exit']);
    assert.equal(result.code, 0, result.lines.join('\n'));
    for (const id of ['defaults', 'flat-releases', 'release-folders', 'release-folders-lean']) {
      assert.ok(result.lines.some((line) => line.startsWith('composition '
        + `tests/fixtures/software-exit/compositions/${id}/example.yaml: composed twice, `)),
      `${id}\n${result.lines.join('\n')}`);
    }
    assert.ok(result.lines.includes('compositions: 15'), result.lines.join('\n'));
    assert.ok(result.lines.includes(
      'matrix: self-test, 30 runs, 0 failed, tolerance applied: none'), result.lines.join('\n'));
  });

  it('validates methodology/scrum with the four governed repositories\' parameter sets (task-056, '
    + 'task-067)',
    () => {
      const result = validate(['--tree', REPO_ROOT, '--overlay', 'tests/fixtures/scrum-exit']);
      assert.equal(result.code, 0, result.lines.join('\n'));
      for (const id of ['defaults', 'flat-releases', 'release-folders', 'release-folders-lean']) {
        assert.ok(result.lines.some((line) => line.startsWith('composition '
          + `tests/fixtures/scrum-exit/compositions/${id}/example.yaml: composed twice, `)),
        `${id}\n${result.lines.join('\n')}`);
      }
      assert.ok(result.lines.includes('compositions: 15'), result.lines.join('\n'));
      assert.ok(result.lines.includes(
        'matrix: self-test, 30 runs, 0 failed, tolerance applied: none'), result.lines.join('\n'));
    });

  it('validates methodology/kanban with the four governed repositories\' parameter sets (task-068)',
    () => {
      const result = validate(['--tree', REPO_ROOT, '--overlay', 'tests/fixtures/kanban-exit']);
      assert.equal(result.code, 0, result.lines.join('\n'));
      for (const id of ['defaults', 'flat-releases', 'release-folders', 'release-folders-lean']) {
        assert.ok(result.lines.some((line) => line.startsWith('composition '
          + `tests/fixtures/kanban-exit/compositions/${id}/example.yaml: composed twice, `)),
        `${id}\n${result.lines.join('\n')}`);
      }
      assert.ok(result.lines.includes('compositions: 15'), result.lines.join('\n'));
      assert.ok(result.lines.includes(
        'matrix: self-test, 30 runs, 0 failed, tolerance applied: none'), result.lines.join('\n'));
    });

  it('passes a publication run of this repository: the two presets and nine examples on 0.3.0 and '
    + 'the newest release (task-039, task-055, task-059, task-067, task-074, task-079, task-090)',
    () => {
      const result = validate(['--tree', REPO_ROOT], { mode: 'publication' });
      assert.equal(result.code, 0, result.lines.join('\n'));
      assert.ok(result.lines.includes(
        'matrix: publication, 22 runs, 0 failed, tolerance applied: none'),
      result.lines.join('\n'));
    });

  it('exits 1 on a schema error, and does not compose the failing preset', () => {
    withTree((tree) => replaceIn(join(tree, 'presets', 'golden.yaml'), 'format: 1', 'format: 2'),
      (tree) => {
        const result = validate(['--tree', tree, ...NAME]);
        assert.equal(result.code, 1);
        assert.ok(result.lines.some((line) => line.startsWith('presets/golden.yaml:')));
        // The examples still compose (task-022); the failing preset does not.
        assert.ok(result.lines.includes('compositions: 12'), result.lines.join('\n'));
      });
  });

  it('exits 1 on a composition error, naming it', () => {
    withTree((tree) => replaceIn(join(tree, 'packs', 'methodology', 'kanban', 'fragments',
      'roles.yaml'), 'format: 1', 'format: 1\nversion: 2'), (tree) => {
      const result = validate(['--tree', tree, ...NAME]);
      assert.equal(result.code, 1);
      assert.ok(result.lines.some((line) => /presets\/golden\.yaml.*version/.test(line)),
        result.lines.join('\n'));
    });
  });

  it('runs index --check after the lint and before the compositions (task-019)', () => {
    const result = validate(['--tree', TREE, ...NAME]);
    const at = (pattern: RegExp): number => result.lines.findIndex((line) => pattern.test(line));
    assert.ok(at(/^lint: /) < at(/^index: checked 11 files, 0 not up to date$/));
    assert.ok(at(/^index: checked/) < at(/^composition /), result.lines.join('\n'));
  });

  it('exits 2 when the index cannot read a tag that catalog.yaml names (task-019)', () => {
    const repo = treeRepo();
    try {
      publishByHand(repo, 'base');
      repo.git(['tag', '-d', 'base@1.0.0']);
      const result = validate(['--tree', repo.dir, 'methodology/kanban']);
      assert.equal(result.code, 2, result.lines.join('\n'));
      assert.ok(result.lines.includes('index: tag base@1.0.0 is named by catalog.yaml and missing '
        + 'from the repository'), result.lines.join('\n'));
    } finally {
      repo.dispose();
    }
  });

  it('skips the index when the lint reports a file that does not parse (task-019)', () => {
    withTree((tree) => {
      const workflow = join(tree, 'packs', 'methodology', 'kanban', 'workflows',
        'replenishment.yaml');
      writeFileSync(workflow, `${readFileSync(workflow, 'utf8')}name: [unclosed\n`);
    }, (tree) => {
      const result = validate(['--tree', tree, ...NAME]);
      assert.equal(result.code, 1, result.lines.join('\n'));
      assert.ok(result.lines.includes('index: skipped, the lint reports files that do not parse'));
    }, true);
  });
});
