import { strict as assert } from 'node:assert';
import { copyFileSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { describe, it } from 'node:test';

import { runCheckPacks } from '../src/check-packs';
import type { CheckPacksResult } from '../src/check-packs';
import { loadCatalog } from '../src/catalog';
import { resolve } from '../src/resolve';
import { EXEMPTION } from '../src/examples';
import { exampleSection } from './support/examples';
import {
  BASE_COMPOSABLE as BASE, FOUNDATION_COMPOSABLE as FOUNDATION, KANBAN, withPackTree,
} from './support/pack-tree';
import type { PackSpec } from './support/pack-tree';
import { FIXTURE_CATALOG } from './support/paths';
import { FROZEN_COMPAT } from './support/published-repo';

const KANBAN_README = 'packs/methodology/kanban/README.md';
const FIXTURE = 'tests/fixtures/examples/kanban/basic/example.yaml';

interface Edit {
  specs?: PackSpec[];
  examples?: boolean;
  edit?: (root: string) => void;
}

function write(root: string, path: string, text: string): void {
  mkdirSync(dirname(join(root, path)), { recursive: true });
  writeFileSync(join(root, path), text);
}

function replace(root: string, path: string, from: string, to: string): void {
  const text = readFileSync(join(root, path), 'utf8');
  assert.ok(text.includes(from), `${from} not in ${path}`);
  writeFileSync(join(root, path), text.replace(from, to));
}

function lint({ specs = [...FOUNDATION, KANBAN], examples = true,
  edit = () => undefined }: Edit = {}):
CheckPacksResult {
  let result: CheckPacksResult | undefined;
  withPackTree(specs, (root) => {
    copyFileSync(FIXTURE_CATALOG, join(root, 'catalog.yaml'));
    writeFileSync(join(root, 'compat.yaml'), FROZEN_COMPAT);
    edit(root);
    result = runCheckPacks(root);
  }, { examples });
  assert.ok(result !== undefined);
  return result;
}

/** The example problems, as `<file>[:<line>] <rule>`. */
function found(edit: Edit = {}): string[] {
  return lint(edit).problems.filter((problem) => problem.rule.startsWith('example-'))
    .map((problem) => `${problem.file}${problem.line === undefined ? '' : `:${problem.line}`} `
      + problem.rule);
}

/**
 * The tree fails `rule`; any other problem is the orphan its broken example leaves behind (a
 * fixture no README example names any more).
 */
function fails(rule: string, edit: Edit): void {
  const problems = found(edit);
  assert.ok(problems.some((line) => line.endsWith(` ${rule}`)), problems.join('\n'));
  assert.ok(problems.every((line) => line.endsWith(` ${rule}`)
    || line === 'tests/fixtures/examples/kanban/basic example-fixture'), problems.join('\n'));
}

const section7 = (root: string, body: string): void => replace(root, KANBAN_README,
  exampleSection('kanban'), body);

describe('examples as fixtures (task-022)', () => {
  it('passes a tree whose packs each have an example and its fixture', () => {
    const result = lint();
    assert.equal(result.code, 0, result.lines.join('\n'));
  });

  it('counts the example files among the files it checks', () => {
    assert.equal(lint().lines[0], 'lint: checked 22 files, 0 problems');
  });

  describe('example-section (acceptance 3, 5)', () => {
    it('accepts the exemption line while the tree holds no methodology', () => {
      assert.deepEqual(found({ specs: [BASE] }), []);
    });

    it('refuses the exemption line once the tree holds a methodology', () => {
      fails('example-section', { examples: false });
    });

    it('refuses a section 7 with neither examples nor the exemption line', () => {
      fails('example-section', { edit: (root) => section7(root, 'Some prose.\n') });
    });

    it('refuses text before the first example, a bad or duplicate name, a wrong Fixture line',
      () => {
        fails('example-section', { edit: (root) => section7(root,
          `Intro.\n\n${exampleSection('kanban')}`) });
        fails('example-section', { edit: (root) => replace(root, KANBAN_README, '### basic',
          '### Bad Name') });
        fails('example-section', { edit: (root) => section7(root,
          `${exampleSection('kanban')}\n${exampleSection('kanban')}`) });
        fails('example-section', { edit: (root) => replace(root, KANBAN_README,
          'Fixture: tests/fixtures/examples/kanban/basic/', 'Fixture: tests/fixtures/kanban/') });
        fails('example-section', { edit: (root) => replace(root, KANBAN_README,
          'Fixture: tests/fixtures/examples/kanban/basic/\n', 'See below.\n') });
      });

    it('accepts free text after an example, deeper headings among it', () => {
      assert.deepEqual(found({ edit: (root) => section7(root,
        `${exampleSection('kanban')}\n#### How a phase runs\n\nIt runs.\n`) }), []);
    });
  });

  describe('example-fixture (acceptance 4, 5)', () => {
    it('reports a missing fixture at the README\'s Fixture line', () => {
      const problems = found({ edit: (root) => rmSync(join(root, FIXTURE)) });
      assert.ok(problems.some((line) => /^packs\/methodology\/kanban\/README\.md:\d+ example-fixture$/
        .test(line)), problems.join('\n'));
    });

    it('reports a fixture no README names, a pack name of no pack, a stray entry', () => {
      fails('example-fixture', { edit: (root) => write(root,
        'tests/fixtures/examples/kanban/other/example.yaml', readFileSync(join(root, FIXTURE), 'utf8')
          .replace('id: basic', 'id: other')) });
      fails('example-fixture', { edit: (root) => write(root,
        'tests/fixtures/examples/scrum/basic/example.yaml', readFileSync(join(root, FIXTURE), 'utf8')) });
      fails('example-fixture', { edit: (root) => write(root, 'tests/fixtures/examples/kanban/x.md',
        'x\n') });
      fails('example-fixture', { edit: (root) => write(root,
        'tests/fixtures/examples/kanban/basic/notes.md', 'x\n') });
      fails('example-fixture', { edit: (root) => write(root, 'tests/fixtures/examples/README.md',
        'x\n') });
    });

    it('checks example.yaml: schema, id, no profile, the pack, packs of the tree, values', () => {
      const yaml = (root: string, from: string, to: string): void => replace(root, FIXTURE, from, to);
      fails('example-fixture', { edit: (root) => yaml(root, 'title: "Basic"\n', '') });
      fails('example-fixture', { edit: (root) => yaml(root, 'id: basic', 'id: other') });
      fails('example-fixture', { edit: (root) => yaml(root, 'title: "Basic"',
        'title: "Basic"\nprofile: "teams"') });
      fails('example-fixture', { edit: (root) => replace(root,
        'tests/fixtures/examples/base/basic/example.yaml', '  - base@^1\n', '') });
      fails('example-fixture', { edit: (root) => yaml(root, '  - methodology/kanban@^1\n',
        '  - methodology/kanban@^1\n  - blueprint/nope@^1\n') });
      fails('example-fixture', { edit: (root) => writeFileSync(join(root, FIXTURE),
        `${readFileSync(join(root, FIXTURE), 'utf8')}parameters:\n  nope: 1\n`) });
    });

    it('runs the YAML and secret rules on example.yaml', () => {
      const yamlRule = lint({ edit: (root) => replace(root, FIXTURE, 'format: 1', 'format: 1.0') });
      assert.ok(yamlRule.problems.some((problem) => problem.file === FIXTURE), yamlRule.lines.join('\n'));
      const block = ['-----BEGIN ', 'OPENSSH PRIVATE', ' KEY-----'].join('');
      const secret = lint({ edit: (root) => writeFileSync(join(root, FIXTURE),
        `${readFileSync(join(root, FIXTURE), 'utf8')}# ${block}\n`) });
      assert.ok(secret.problems.some((problem) => problem.file === FIXTURE
        && problem.rule === 'secret'), secret.lines.join('\n'));
    });
  });

  it('leaves the composer alone: a pack composes with its fixture missing', () => {
    withPackTree([...FOUNDATION, KANBAN], (root) => {
      copyFileSync(FIXTURE_CATALOG, join(root, 'catalog.yaml'));
      rmSync(join(root, FIXTURE));
      assert.doesNotThrow(() => resolve(root, loadCatalog(join(root, 'catalog.yaml')),
        ['methodology/kanban']));
    });
  });

  it('keeps the exemption line as spec-002 §2.4 writes it', () => {
    assert.equal(EXEMPTION, 'None yet: no methodology pack is published.');
  });

  it('reports each section 7 problem at the README line it is about', () => {
    const at = (edit: (root: string) => void, text: string): void => {
      let lines: string[] = [];
      let readme = '';
      withPackTree([...FOUNDATION, KANBAN], (root) => {
        copyFileSync(FIXTURE_CATALOG, join(root, 'catalog.yaml'));
        writeFileSync(join(root, 'compat.yaml'), FROZEN_COMPAT);
        edit(root);
        readme = readFileSync(join(root, KANBAN_README), 'utf8');
        lines = runCheckPacks(root).problems.filter((problem) => problem.rule === 'example-section')
          .map((problem) => `${problem.file}:${problem.line ?? 0}`);
      });
      assert.deepEqual(lines, [`${KANBAN_README}:${readme.split('\n').indexOf(text) + 1}`]);
    };
    at((root) => replace(root, KANBAN_README, '### basic', '### Bad Name'), '### Bad Name');
    at((root) => section7(root, `Intro.\n\n${exampleSection('kanban')}`), 'Intro.');
    at((root) => replace(root, KANBAN_README, 'Fixture: tests/fixtures/examples/kanban/basic/\n',
      'See below.\n'), 'See below.');
  });
});
