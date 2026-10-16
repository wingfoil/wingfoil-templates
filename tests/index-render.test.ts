import { strict as assert } from 'node:assert';
import { describe, it } from 'node:test';

import type { CatalogIndex } from '../src/index-model';
import { cell, firstSentence, renderCatalog, renderJson, renderLlms } from '../src/index-render';

const AXES = ['methodology', 'phase', 'blueprint', 'governance', 'team-mode', 'stage'];
const FOUNDATION = ['base', 'software'];
const EMPTY: CatalogIndex = { format: 1, repository: 'wingfoil/wingfoil-templates', install: [],
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
});

describe('renderJson', () => {
  it('writes two-space JSON with a final newline', () => {
    assert.equal(renderJson(EMPTY), `${JSON.stringify(EMPTY, null, 2)}\n`);
  });
});
