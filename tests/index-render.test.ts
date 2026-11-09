import { strict as assert } from 'node:assert';
import { describe, it } from 'node:test';

import type { CatalogIndex } from '../src/index-model';
import type { IndexPack } from '../src/index-model';
import {
  cell, conditionalMark, firstSentence, renderCatalog, renderJson, renderLlms, summaryOf,
} from '../src/index-render';

const AXES = ['methodology', 'phase', 'blueprint', 'governance', 'team-mode', 'stage'];
const FOUNDATION = ['base', 'software'];
const EMPTY: CatalogIndex = { format: 2, repository: 'wingfoil/wingfoil-templates', install: [],
  packs: [], presets: [], transitions: [] };

function headings(text: string): string[] {
  return text.split('\n').filter((line) => /^#{1,2} /.test(line));
}

describe('table cells and summaries (acceptance 6)', () => {
  it('escapes `|` and folds line breaks', () => {
    assert.equal(cell('a | b\n  c'), 'a \\| b c');
  });

  it('takes the first sentence: a stop followed by whitespace or the end', () => {
    assert.equal(firstSentence('Kanban, 1.1.0. A pull system.'), 'Kanban, 1.1.0.');
    assert.equal(firstSentence('Done! Then more.'), 'Done!');
    assert.equal(firstSentence('Why? Because.'), 'Why?');
    assert.equal(firstSentence('No stop at all'), 'No stop at all');
    assert.equal(firstSentence('Version 1.0 only'), 'Version 1.0 only');
  });
});

describe('conditionalMark, one mark per entry (plan-039 R3, task-088 Acceptance 3)', () => {
  type Part = { with: string; workflows: string[]; directives: string[] };
  const pack = (parts: Part[]): IndexPack => ({
    latest: '1.0.0', versions: [{ version: '1.0.0', conditional: parts.map((part) =>
      ({ with: part.with })) }],
    conditional_workflows: [], conditional_directives: [], conditional_parts: parts, tensions: [],
  }) as unknown as IndexPack;
  const part = (entry: string, workflows: string[], directives: string[]): Part =>
    ({ with: entry, workflows, directives });

  it('names each entry\'s workflows, else its directives, and the id its with names', () => {
    assert.deepEqual(conditionalMark(pack([part('software@^1', ['delivery'], ['d'])])),
      [{ names: ['delivery'], layer: 'software' }]);
    assert.deepEqual(conditionalMark(pack([part('software@^1', [], ['d'])])),
      [{ names: ['d'], layer: 'software' }]);
    assert.deepEqual(conditionalMark(pack([part('software@^1', ['a'], []),
      part('stage/mvp@^1', [], ['c'])])),
    [{ names: ['a'], layer: 'software' }, { names: ['c'], layer: 'stage/mvp' }]);
  });

  it('gives no mark for an entry that adds nothing, none without a part', () => {
    assert.deepEqual(conditionalMark(pack([part('software@^1', [], [])])), []);
    assert.deepEqual(conditionalMark(pack([part('software@^1', [], []),
      part('stage/mvp@^1', ['w'], [])])), [{ names: ['w'], layer: 'stage/mvp' }]);
    assert.deepEqual(conditionalMark(pack([])), []);
  });
});

describe('summaryOf: the marks and the tensions (task-088 Acceptance 3)', () => {
  type Part = { with: string; workflows: string[]; directives: string[] };
  const pack = (parts: Part[], tensions: string[]): IndexPack => ({
    description: 'First sentence. Second one.', latest: '1.0.0',
    versions: [{ version: '1.0.0', conditional: parts.map((part) => ({ with: part.with })) }],
    conditional_workflows: [], conditional_directives: [], conditional_parts: parts,
    tensions: tensions.map((entry) => ({ pack: entry, resolution: 'R.' })),
  }) as unknown as IndexPack;
  const code = (text: string): string => `\`${text}\``;
  const same = (text: string): string => text;
  const SW = { with: 'software@^1', workflows: ['checks-flow', 'b'], directives: [] };
  const FLOW = { with: 'methodology/flow@^1', workflows: [], directives: ['checks-rule'] };

  it('keeps one entry\'s text and writes nothing without parts or tensions', () => {
    assert.equal(summaryOf(pack([SW], []), code, same),
      'First sentence. (`checks-flow`, `b` only with `software`)');
    assert.equal(summaryOf(pack([], []), code, same), 'First sentence.');
  });

  it('joins the entries\' marks with "; " in one parenthesis, in entry order', () => {
    assert.equal(summaryOf(pack([SW, FLOW], []), code, same), 'First sentence. (`checks-flow`, '
      + '`b` only with `software`; `checks-rule` only with `methodology/flow`)');
  });

  it('appends the tensions\' ids, no range, sorted, once, with no full stop', () => {
    assert.equal(summaryOf(pack([], ['stage/mvp@^1', 'blueprint/web', 'stage/mvp@^2']), code,
      same), 'First sentence. Combines with care: `blueprint/web`, `stage/mvp`');
  });

  it('writes the full text: the marks, then the tensions', () => {
    assert.equal(summaryOf(pack([{ ...SW, workflows: ['checks-flow'] }, FLOW], ['stage/mvp@^1']),
      code, same), 'First sentence. (`checks-flow` only with `software`; `checks-rule` only with '
      + '`methodology/flow`) Combines with care: `stage/mvp`');
  });
});

describe('renderCatalog (§3.2)', () => {
  it('writes the sections in order, base first, then the axes of catalog.yaml', () => {
    assert.deepEqual(headings(renderCatalog(EMPTY, AXES, FOUNDATION)), [
      '# WingFoil template catalog',
      '## Install', '## Foundation', '## Methodology', '## Phase', '## Blueprint', '## Governance',
      '## Team mode', '## Stage', '## Presets', '## Transitions', '## Profiles', '## For agents']);
  });

  it('anchors the Install block and says no release installs packs yet', () => {
    const text = renderCatalog(EMPTY, AXES, FOUNDATION);
    assert.ok(text.includes('<a id="install"></a>\n\n## Install\n\nNo released WingFoil'));
    assert.ok(renderCatalog({ ...EMPTY, install: ['1.0.0', '1.2.0'] }, AXES, FOUNDATION)
      .includes('The WingFoil releases that install packs from this catalog: `1.0.0`, `1.2.0`.'));
  });

  it('writes the empty sentences of an empty catalog', () => {
    const text = renderCatalog(EMPTY, AXES, FOUNDATION);
    assert.equal(text.split('\n').filter((line) => line === 'None published yet.').length, 7);
    assert.equal(text.split('\n').filter((line) => line === 'None yet.').length, 3);
  });

  it('links llms.txt and lists the URL patterns for agents', () => {
    const text = renderCatalog(EMPTY, AXES, FOUNDATION);
    assert.ok(text.includes('[llms.txt](llms.txt)'));
    assert.ok(text.includes('`https://raw.githubusercontent.com/wingfoil/wingfoil-templates/main/'
      + 'catalog-index.json`'));
  });

  it('ends with one newline and has no trailing whitespace', () => {
    for (const text of [renderCatalog(EMPTY, AXES, FOUNDATION), renderLlms(), renderJson(EMPTY)]) {
      assert.ok(text.endsWith('\n') && !text.endsWith('\n\n'));
      assert.ok(text.split('\n').every((line) => line === line.trimEnd()));
    }
  });
});

describe('renderLlms (§3.4)', () => {
  it('has a title, a blockquote summary, then Index, Specifications, Reading a pack', () => {
    const lines = renderLlms().split('\n');
    assert.equal(lines[0], '# WingFoil template catalog');
    assert.ok(lines[2]?.startsWith('> '));
    assert.deepEqual(headings(renderLlms()).slice(1),
      ['## Index', '## Specifications', '## Reading a pack']);
    assert.ok(renderLlms().includes('/refs/tags/<catalog pack id>@<version>/packs/'
      + '<catalog pack id>/README.md'));
  });

  it('names the index\'s format 2 on its index line, its one change (task-088 Acc. 5)', () => {
    const line = renderLlms().split('\n').find((entry) => entry.includes('catalog-index.json)'));
    assert.ok(line?.includes('every published pack, preset and transition (format 2); search is '
      + 'a local filter over it'), line);
  });
});

describe('renderJson', () => {
  it('writes two-space JSON with a final newline', () => {
    assert.equal(renderJson(EMPTY), `${JSON.stringify(EMPTY, null, 2)}\n`);
  });
});
