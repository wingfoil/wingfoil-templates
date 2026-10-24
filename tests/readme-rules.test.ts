import { strict as assert } from 'node:assert';
import { copyFileSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, it } from 'node:test';

import { runCheckPacks } from '../src/check-packs';
import type { CheckPacksResult } from '../src/check-packs';
import { FIXTURE_CATALOG } from './support/paths';
import { FROZEN_COMPAT } from './support/published-repo';
import { FOUNDATION_COMPOSABLE as FOUNDATION, KANBAN, withPackTree } from './support/pack-tree';
import { exampleSection } from './support/examples';
import { CATALOG_URL, TEMPORARY_MARK, conformingReadme } from './support/readme';

// Section 7 holds an example with its fixture (task-022); the tests' free content goes to section 8.
const README = conformingReadme({ id: 'methodology/kanban', title: 'methodology/kanban',
  description: 'Test pack methodology/kanban.' }, exampleSection('kanban'));
const FILE = 'packs/methodology/kanban/README.md';

interface Options {
  /** compat.yaml of the tree: FROZEN_COMPAT, one whose release lists pack-install, none. */
  compat?: 'repository' | 'pack-install' | 'invalid' | 'none';
}

function lintReadme(readme: string, options: Options = {}): CheckPacksResult {
  let result: CheckPacksResult | undefined;
  withPackTree([...FOUNDATION, { ...KANBAN, extraFiles: { 'README.md': readme } }], (root) => {
    copyFileSync(FIXTURE_CATALOG, join(root, 'catalog.yaml'));
    const compat = options.compat ?? 'repository';
    if (compat !== 'none') {
      const text = FROZEN_COMPAT;
      const written = { repository: text, invalid: text.replace('format: 1', 'format: one'),
        'pack-install': text.replace('capabilities: []', 'capabilities: [pack-install]') };
      writeFileSync(join(root, 'compat.yaml'), written[compat]);
    }
    result = runCheckPacks(root);
  });
  assert.ok(result !== undefined);
  return result;
}

/** The README problems as `<line> <rule>`, every other rule dropped. */
function found(readme: string, options?: Options): string[] {
  return lintReadme(readme, options).problems.filter((problem) => problem.file === FILE)
    .map((problem) => `${problem.line ?? 0} ${problem.rule}`);
}

function passes(readme: string, options?: Options): void {
  const result = lintReadme(readme, options);
  assert.equal(result.code, 0, result.lines.join('\n'));
}

function failsWith(rule: string, readme: string, options?: Options): void {
  const result = lintReadme(readme, options);
  assert.equal(result.code, 1, result.lines.join('\n'));
  const rules = [...new Set(result.problems.map((problem) => problem.rule))];
  assert.deepEqual(rules, [rule], result.lines.join('\n'));
}

/** The 1-based line of the first line equal to `text`. */
function lineOf(readme: string, text: string): number {
  return readme.split('\n').indexOf(text) + 1;
}

function without(readme: string, from: string, to: string): string {
  const start = readme.indexOf(from);
  return readme.slice(0, start) + readme.slice(readme.indexOf(to, start));
}

describe('README lint rules (task-018)', () => {
  it('passes a README of the standard', () => {
    passes(README);
  });

  describe('readme-heading (acceptance 5)', () => {
    it('reports a missing heading at the heading in its place', () => {
      const readme = without(README, '## Sources and adaptations', '## Versions');
      assert.deepEqual(found(readme), [`${lineOf(readme, '## Versions')} readme-heading`]);
    });

    it('reports a missing last heading at the last line of the file', () => {
      const readme = README.slice(0, README.indexOf('## Versions'));
      assert.deepEqual(found(readme), [`${readme.split('\n').length - 1} readme-heading`]);
    });

    it('reports a missing heading in its place, not at an unknown heading before it', () => {
      const readme = README.slice(0, README.indexOf('## Versions'))
        .replace('## When to use it', '## Foo\n\n## When to use it');
      assert.deepEqual(found(readme).sort(), [`${lineOf(readme, '## Foo')} readme-heading`,
        `${readme.split('\n').length - 1} readme-heading`].sort());
    });

    it('fails a heading out of order, duplicated, misspelled or not of the standard', () => {
      const install = README.slice(README.indexOf('## Install'), README.indexOf('<!-- generated:begin composition'));
      const swapped = README.replace(install, '').replace('## When to use it', `${install}## When to use it`);
      failsWith('readme-heading', swapped);
      failsWith('readme-heading', `${README}\n## Examples\n\nAgain.\n`);
      failsWith('readme-heading', README.replace('## When to use it', '## When To Use It'));
      failsWith('readme-heading', `${README}\n## Extra\n`);
      failsWith('readme-heading', `${README}\n# Another title\n`);
    });

    it('reports a missing heading before the next higher one, not at a later duplicate', () => {
      const readme = `${without(README, '## Install and update', '<!-- generated:begin composition')}`
        + '\n## When to use it\n';
      assert.ok(found(readme).includes(`${lineOf(readme, '## Composition')} readme-heading`));
    });

    it('fails content before the level-1 heading, and an empty title', () => {
      failsWith('readme-heading', `Intro.\n\n${README}`);
      failsWith('readme-heading', `-\n>\n${README}`);
      failsWith('readme-heading', README.replace('# methodology/kanban', '#'));
    });

    it('accepts setext headings, deeper headings, and headings in code or quotes', () => {
      passes(README.replace('## Examples\n', 'Examples\n--------\n'));
      passes(README.replace('None: written for this catalog.\n',
        '### One\n\n```\n## Extra\n```\n\n> ## Quoted\n'));
    });
  });

  describe('readme-marker (acceptance 6)', () => {
    it('fails a generated section without its pair', () => {
      failsWith('readme-marker', README.replace('<!-- generated:begin composition -->\n', '')
        .replace('<!-- generated:end composition -->\n', ''));
    });

    it('fails an unknown name, a duplicate, an unpaired or a nested marker', () => {
      failsWith('readme-marker', README.replace('## Examples\n',
        '<!-- generated:begin examples -->\n## Examples\n<!-- generated:end examples -->\n'));
      failsWith('readme-marker', `${README}<!-- generated:begin title -->\n<!-- generated:end title -->\n`);
      failsWith('readme-marker', README.replace('<!-- generated:end parameters -->\n', ''));
      failsWith('readme-marker', README.replace('## Parameters\n',
        '## Parameters\n<!-- generated:begin composition -->\n'));
    });

    it('fails text between a begin marker and its heading, or after an end marker', () => {
      failsWith('readme-marker', README.replace('<!-- generated:begin composition -->\n',
        '<!-- generated:begin composition -->\nHand text.\n'));
      failsWith('readme-marker', README.replace('<!-- generated:end composition -->\n',
        '<!-- generated:end composition -->\nHand text.\n'));
    });

    it('fails a pair that encloses a written section heading', () => {
      failsWith('readme-marker', README.replace('<!-- generated:end parameters -->\n', '')
        .replace('## Sources and adaptations', '<!-- generated:end parameters -->\n\n'
          + '## Sources and adaptations'));
    });

    it('fails a malformed marker line', () => {
      failsWith('readme-marker', README.replace('<!-- generated:end parameters -->',
        '<!--generated:end parameters-->'));
      failsWith('readme-marker', `${README}\n<!-- generated:open x -->\n`);
    });

    it('does not read a marker-like line inside a multi-line comment', () => {
      passes(README.replace('None: written for this catalog.\n',
        '<!-- a note\n<!-- generated:open x -->\n-->\n'));
    });

    it('does not read a marker in a code block', () => {
      passes(README.replace('None: written for this catalog.\n',
        '```\n<!-- generated:begin title -->\n```\n'));
    });
  });

  describe('readme-command (acceptance 7)', () => {
    const inSources = (text: string): string =>
      README.replace('None: written for this catalog.\n', text);

    it('fails a WingFoil command in a code block, indented code, a quote or a span', () => {
      failsWith('readme-command', inSources('```\nwingfoil init\n```\n'));
      failsWith('readme-command', inSources('    $ npm run -s wingfoil -- memory list\n'));
      failsWith('readme-command', inSources('> ```\n> npx wingfoil init\n> ```\n'));
      failsWith('readme-command', inSources('Run `npm exec wingfoil init`.\n'));
      failsWith('readme-command', inSources('```\nnpm run wingfoil\n```\n'));
      failsWith('readme-command', inSources('```\n  wingfoil\n```\n'));
    });

    it('fails a command in a generated section too, naming its line', () => {
      const readme = README.replace('## Parameters\n', '## Parameters\n\n`wingfoil list`\n');
      assert.deepEqual(found(readme), [`${lineOf(readme, '`wingfoil list`')} readme-command`]);
    });

    it('accepts the program named in a span, prose, other programs and comments', () => {
      passes(inSources('The `wingfoil` CLI. Run wingfoil init. `wingfoilx`\n\n'
        + '```\nnpm run validate\n```\n\n<!-- wingfoil init -->\n'));
    });
  });

  describe('readme-install-mark (acceptance 8)', () => {
    const unmarked = README.replace(`${TEMPORARY_MARK}\n\n`, '');

    it('requires the mark while no release provides pack-install, or with no compat.yaml', () => {
      failsWith('readme-install-mark', unmarked);
      failsWith('readme-install-mark', unmarked, { compat: 'none' });
      assert.deepEqual(found(unmarked, { compat: 'invalid' }).map((entry) => entry.split(' ')[1]),
        ['readme-install-mark']);
      failsWith('readme-install-mark', README.replace(TEMPORARY_MARK, `${TEMPORARY_MARK} `));
      passes(README, { compat: 'none' });
    });

    it('no longer requires it, nor forbids it, once a release provides pack-install', () => {
      passes(unmarked, { compat: 'pack-install' });
      passes(README, { compat: 'pack-install' });
    });

    it('reports an empty section 3 at its heading', () => {
      const readme = README.replace(`${TEMPORARY_MARK}\n\nSee the [Install block](${CATALOG_URL}#install) `
        + 'of the catalog.\n', '');
      assert.deepEqual(found(readme), [`${lineOf(readme, '## Install and update')} readme-install-mark`,
        `${lineOf(readme, '## Install and update')} readme-link`]);
    });

    it('reads it after a setext section 3 heading', () => {
      passes(README.replace('## Install and update\n', 'Install and update\n------------------\n'));
    });
  });

  describe('readme-link (acceptance 9)', () => {
    it('requires the Install link in section 3', () => {
      failsWith('readme-link', README.replace(`(${CATALOG_URL}#install)`, '(https://example.org)'));
    });

    it('requires the changelog and catalog-entry links in section 9', () => {
      failsWith('readme-link', README.replace('(CHANGELOG.md)', '(NEWS.md)'));
      failsWith('readme-link', README.replace('#pack-methodology-kanban', '#pack-kanban'));
      passes(README.replace('(CHANGELOG.md)', '(./CHANGELOG.md)'));
    });

    it('fails any link to CATALOG.md that is not absolute to main, wherever it is', () => {
      const inSources = (text: string): string =>
        README.replace('None: written for this catalog.\n', text);
      failsWith('readme-link', inSources('- [Catalog](../../CATALOG.md#install)\n'));
      failsWith('readme-link', inSources('> [Catalog](CATALOG.md)\n'));
      failsWith('readme-link', inSources(
        '[Catalog](https://github.com/wingfoil/wingfoil-templates/blob/v1/CATALOG.md#install)\n'));
      failsWith('readme-link', inSources(`[Catalog](${CATALOG_URL})\n`));
      passes(inSources('`[Catalog](CATALOG.md)`\n'));
    });
  });

  it('checks nothing when README.md is a directory: the layout rule reports it', () => {
    let result: CheckPacksResult | undefined;
    withPackTree([...FOUNDATION, KANBAN], (root) => {
      copyFileSync(FIXTURE_CATALOG, join(root, 'catalog.yaml'));
      rmSync(join(root, FILE));
      mkdirSync(join(root, FILE));
      result = runCheckPacks(root);
    });
    assert.equal(result?.code, 1, result?.lines.join('\n'));
    assert.deepEqual([...new Set(result?.problems.map((problem) => problem.rule))], ['layout']);
  });

  it('checks nothing in a pack without README.md: the layout rule reports it', () => {
    let result: CheckPacksResult | undefined;
    withPackTree([...FOUNDATION, KANBAN], (root) => {
      copyFileSync(FIXTURE_CATALOG, join(root, 'catalog.yaml'));
      rmSync(join(root, FILE));
      result = runCheckPacks(root);
    });
    assert.deepEqual([...new Set(result?.problems.map((problem) => problem.rule))], ['layout']);
  });
});
