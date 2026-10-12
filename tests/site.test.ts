import { strict as assert } from 'node:assert';
import { createHash } from 'node:crypto';
import {
  cpSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { runInNewContext } from 'node:vm';
import { after, before, describe, it } from 'node:test';

import type { CatalogIndex } from '../src/index-model';
import { readmeOnGithub } from '../src/index-urls';
import { runSite } from '../src/site';
import type { TestRepo } from './support/git-repo';
import { indexCatalog } from './support/index-catalog';
import { REPO_ROOT } from './support/paths';

const FILES = ['catalog-index.json', 'index.html', 'llms.txt', 'search.js', 'site.css'];
const CSP = '<meta http-equiv="Content-Security-Policy" content="default-src \'none\'; '
  + 'script-src \'self\'; style-src \'self\'; img-src \'self\'; base-uri \'none\'; '
  + 'form-action \'none\'">';

interface Row {
  id: string;
  text: string;
  axis: string;
  slot: string;
  status: string;
  profiles: string[];
}

type Matches = (pack: Omit<Row, 'id'>, query: string,
  filters: Partial<Record<'axis' | 'slot' | 'profile' | 'status', string>>) => boolean;

function unescape(text: string): string {
  return text.replace(/&quot;/g, '"').replace(/&#39;/g, '\'').replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>').replace(/&amp;/g, '&');
}

function rows(html: string): Row[] {
  return [...html.matchAll(/<tr data-pack="([^"]*)"([^>]*)>/g)].map((match) => {
    const attribute = (name: string): string =>
      unescape(new RegExp(`data-${name}="([^"]*)"`).exec(match[2] ?? '')?.[1] ?? '');
    return { id: unescape(match[1] ?? ''), text: attribute('text'), axis: attribute('axis'),
      slot: attribute('slot'), status: attribute('status'),
      profiles: JSON.parse(attribute('profiles') || '[]') as string[] };
  });
}

function loadMatches(script: string): Matches {
  const context: { wingfoilSearch?: { matches: Matches } } = {};
  runInNewContext(script, context);
  assert.ok(context.wingfoilSearch !== undefined, 'globalThis.wingfoilSearch');
  return context.wingfoilSearch.matches;
}

describe('npm run site (task-024)', () => {
  let repo: TestRepo;
  let dir: string;
  let out: string;
  let html: string;
  let matches: Matches;
  const found = (query: string, filters: Parameters<Matches>[2] = {}): string[] =>
    rows(html).filter((row) => matches(row, query, filters)).map((row) => row.id);

  before(() => {
    repo = indexCatalog();
    dir = mkdtempSync(join(tmpdir(), 'site-'));
    out = join(dir, 'site');
    const result = runSite(['--tree', repo.dir, '--out', out]);
    assert.equal(result.code, 0, result.lines.join('\n'));
    html = readFileSync(join(out, 'index.html'), 'utf8');
    matches = loadMatches(readFileSync(join(out, 'search.js'), 'utf8'));
  });
  after(() => {
    repo.dispose();
    rmSync(dir, { recursive: true, force: true });
  });

  describe('the command (acceptance 3)', () => {
    it('writes exactly the five files, the index files as the tree holds them', () => {
      assert.deepEqual(readdirSync(out).sort(), FILES);
      for (const file of ['catalog-index.json', 'llms.txt']) {
        assert.ok(readFileSync(join(out, file)).equals(readFileSync(join(repo.dir, file))), file);
      }
    });

    it('builds byte-identical sites', () => {
      const again = join(dir, 'again');
      assert.equal(runSite(['--tree', repo.dir, '--out', again]).code, 0);
      for (const file of FILES) {
        assert.ok(readFileSync(join(out, file)).equals(readFileSync(join(again, file))), file);
      }
    });

    it('refuses an output that is not empty, a missing llms.txt, and bad usage', () => {
      assert.equal(runSite(['--tree', repo.dir, '--out', out]).code, 2);
      const tree = join(dir, 'no-llms');
      mkdirSync(tree);
      cpSync(join(repo.dir, 'catalog-index.json'), join(tree, 'catalog-index.json'));
      assert.equal(runSite(['--tree', tree, '--out', join(dir, 'x')]).code, 2);
      assert.equal(runSite(['--tree', repo.dir]).code, 3);
      assert.equal(runSite(['--nope']).code, 3);
    });

    it('lists every pack whatever the tree\'s catalog.yaml says: it reads only the index', () => {
      for (const catalog of [undefined, 'axes:\n  methodology: {}\n', 'not: [yaml']) {
        const tree = join(dir, `axes-${String(catalog?.length ?? 0)}`);
        mkdirSync(tree);
        for (const file of ['catalog-index.json', 'llms.txt']) cpSync(join(repo.dir, file), join(tree, file));
        if (catalog !== undefined) writeFileSync(join(tree, 'catalog.yaml'), catalog);
        const site = join(tree, 'site');
        assert.equal(runSite(['--tree', tree, '--out', site]).code, 0);
        assert.equal(readFileSync(join(site, 'index.html'), 'utf8'), html, String(catalog));
      }
    });

    it('writes LF endings and nothing of the tree\'s absolute path', () => {
      for (const file of FILES) {
        assert.ok(!readFileSync(join(out, file), 'utf8').includes('\r'), file);
      }
      assert.ok(!html.includes(repo.dir) && !html.includes(dir));
    });

    it('refuses an index whose latest version is not among its versions', () => {
      const tree = join(dir, 'no-latest');
      mkdirSync(tree);
      cpSync(join(repo.dir, 'llms.txt'), join(tree, 'llms.txt'));
      const index = JSON.parse(readFileSync(join(repo.dir, 'catalog-index.json'), 'utf8')) as
        CatalogIndex;
      const pack = index.packs[0];
      assert.ok(pack !== undefined);
      pack.latest = '9.9.9';
      writeFileSync(join(tree, 'catalog-index.json'), `${JSON.stringify(index, null, 2)}\n`);
      assert.equal(runSite(['--tree', tree, '--out', join(tree, 'site')]).code, 1);
    });

    it('refuses an index that breaks its schema', () => {
      const tree = join(dir, 'bad-index');
      mkdirSync(tree);
      cpSync(join(repo.dir, 'llms.txt'), join(tree, 'llms.txt'));
      writeFileSync(join(tree, 'catalog-index.json'), '{"format": 2}\n');
      assert.equal(runSite(['--tree', tree, '--out', join(dir, 'y')]).code, 1);
    });

    it('checks the vendored script against its sha256, and refuses a changed one', () => {
      const vendor = join(REPO_ROOT, 'index', 'vendor');
      const sum = readFileSync(join(vendor, 'search.js.sha256'), 'utf8');
      const actual = createHash('sha256').update(readFileSync(join(vendor, 'search.js')))
        .digest('hex');
      assert.equal(sum, `${actual}  search.js\n`);
      const copy = join(dir, 'vendor');
      cpSync(vendor, copy, { recursive: true });
      writeFileSync(join(copy, 'search.js'), `${readFileSync(join(copy, 'search.js'), 'utf8')}\n`);
      assert.equal(runSite(['--tree', repo.dir, '--out', join(dir, 'z')], { vendor: copy }).code, 1);
    });
  });

  describe('the page (acceptance 4, 6)', () => {
    it('lists every published pack without JavaScript, and nothing unreleased', () => {
      assert.deepEqual(rows(html).map((row) => row.id), ['base', 'methodology/kanban',
        'phase/inception/lean', 'stage/mvp', 'stage/production']);
      assert.ok(!html.includes('blueprint/web'));
      assert.ok(!html.includes('unreleased'));
      for (const heading of ['Presets', 'Transitions', 'Profiles']) {
        assert.ok(html.includes(`<h2>${heading}</h2>`), heading);
      }
      assert.ok(html.includes('href="llms.txt"') && html.includes('href="catalog-index.json"'));
    });

    it('starts its head with the charset and the CSP, with no inline script or style', () => {
      assert.ok(html.includes(`<head>\n<meta charset="utf-8">\n${CSP}\n`), html.slice(0, 600));
      assert.doesNotMatch(html, /<script>|<script(?![^>]*\ssrc=)[^>]*>|<style|\sstyle=/);
      assert.ok(html.includes('<script src="search.js"></script>'));
      assert.ok(html.includes('<link rel="stylesheet" href="site.css">'));
    });

    it('names no other origin than the README links on github.com', () => {
      const index = JSON.parse(readFileSync(join(repo.dir, 'catalog-index.json'), 'utf8')) as
        CatalogIndex;
      const allowed = new Set(index.packs.map((pack) => {
        const latest = pack.versions.find((version) => version.version === pack.latest);
        return readmeOnGithub(latest?.tag ?? '', pack.id);
      }));
      for (const url of html.match(/https?:\/\/[^"'\s<>]+/g) ?? []) {
        assert.ok(allowed.has(url), url);
      }
      assert.doesNotMatch(html, /["'(]\/\//);
      const css = readFileSync(join(out, 'site.css'), 'utf8');
      assert.doesNotMatch(css, /url\(|@import|\/\//);
    });

    it('escapes every text of the index, in text and in attributes', () => {
      const tree = join(dir, 'inject');
      mkdirSync(tree);
      cpSync(join(repo.dir, 'llms.txt'), join(tree, 'llms.txt'));
      const index = JSON.parse(readFileSync(join(repo.dir, 'catalog-index.json'), 'utf8')) as
        CatalogIndex;
      const pack = index.packs[1];
      assert.ok(pack !== undefined);
      pack.description = 'A "quoted" <script>alert(1)</script> & it\'s here.';
      pack.excerpt = '<b>bold</b> & "more"';
      writeFileSync(join(tree, 'catalog-index.json'), `${JSON.stringify(index, null, 2)}\n`);
      const site = join(dir, 'inject-site');
      assert.equal(runSite(['--tree', tree, '--out', site]).code, 0);
      const page = readFileSync(join(site, 'index.html'), 'utf8');
      assert.ok(!page.includes('<script>alert') && !page.includes('<b>bold'));
      assert.ok(page.includes('A &quot;quoted&quot; &lt;script&gt;alert(1)&lt;/script&gt; &amp; '
        + 'it&#39;s here.'));
      const row = rows(page).find((entry) => entry.id === pack.id);
      assert.ok(row?.text.includes('<b>bold</b> & "more"'), 'attributes decode to the text');
    });
  });

  describe('the search (acceptance 5, 6, CB-7)', () => {
    it('finds by text, case-insensitively, every word of the query', () => {
      assert.deepEqual(found('board'), ['methodology/kanban']);
      assert.deepEqual(found('BOARD'), ['methodology/kanban']);
      assert.deepEqual(found('board nothing-like-this'), []);
      assert.deepEqual(found('').length, 5);
    });

    it('searches titles and profiles too', () => {
      assert.deepEqual(found('KANBAN FLOW'), ['methodology/kanban']);
      assert.deepEqual(found('teams'), ['methodology/kanban', 'phase/inception/lean']);
    });

    it('filters by axis, slot and profile', () => {
      assert.deepEqual(found('', { axis: 'phase' }), ['phase/inception/lean']);
      assert.deepEqual(found('', { slot: 'inception' }), ['phase/inception/lean']);
      assert.deepEqual(found('', { profile: 'small teams' }), ['methodology/kanban',
        'phase/inception/lean']);
    });

    it('filters by status, and fails a profile filter on a pack with no profile', () => {
      const pack = { text: 'old pack', axis: 'blueprint', slot: '', status: 'deprecated',
        profiles: [] };
      assert.equal(matches(pack, '', { status: 'deprecated' }), true);
      assert.equal(matches(pack, '', { status: 'active' }), false);
      assert.equal(matches(pack, '', { profile: 'small teams' }), false);
      assert.equal(matches(pack, 'OLD', {}), true);
    });
  });

  describe('the wiring, on a fake document (acceptance 4)', () => {
    interface Fake {
      hidden: boolean;
      id?: string;
      value?: string;
      dataset?: Record<string, string>;
      listeners: Record<string, (event: { preventDefault: () => void }) => void>;
      addEventListener: (type: string, listener: (event: { preventDefault: () => void }) =>
        void) => void;
    }
    const element = (extra: Partial<Fake> = {}): Fake => {
      const fake: Fake = { hidden: false, listeners: {}, addEventListener: (type, listener) => {
        fake.listeners[type] = listener;
      }, ...extra };
      return fake;
    };

    it('shows the form, filters the rows, and keeps the form from submitting', () => {
      const parsed = rows(html);
      const trs = parsed.map((row) => element({ dataset: { pack: row.id, text: row.text,
        axis: row.axis, slot: row.slot, status: row.status,
        profiles: JSON.stringify(row.profiles) } }));
      const byId: Record<string, Fake> = { search: element({ hidden: true }),
        query: element({ value: '' }) };
      for (const name of ['axis', 'slot', 'profile', 'status']) byId[name] = element({ id: name, value: '' });
      const document = {
        getElementById: (id: string): Fake | undefined => byId[id],
        querySelectorAll: (): Fake[] => trs,
      };
      runInNewContext(readFileSync(join(out, 'search.js'), 'utf8'), { document });
      assert.equal(byId['search']?.hidden, false);
      let prevented = false;
      byId['search']?.listeners['submit']?.({ preventDefault: () => { prevented = true; } });
      assert.ok(prevented);
      const query = byId['query'];
      assert.ok(query !== undefined);
      query.value = 'board';
      query.listeners['input']?.({ preventDefault: () => undefined });
      assert.deepEqual(trs.filter((tr) => !tr.hidden).map((tr) => tr.dataset?.['pack']),
        ['methodology/kanban']);
      query.value = '';
      const axis = byId['axis'];
      assert.ok(axis !== undefined);
      axis.value = 'stage';
      axis.listeners['change']?.({ preventDefault: () => undefined });
      assert.deepEqual(trs.filter((tr) => !tr.hidden).map((tr) => tr.dataset?.['pack']),
        ['stage/mvp', 'stage/production']);
    });

    it('treats a malformed data-profiles as no profile', () => {
      const tr = element({ dataset: { pack: 'x', text: 'x', axis: '', slot: '', status: 'active',
        profiles: '{not json' } });
      const byId: Record<string, Fake> = { search: element({ hidden: true }), query: element({ value: '' }) };
      for (const name of ['axis', 'slot', 'profile', 'status']) byId[name] = element({ id: name, value: '' });
      const document = { getElementById: (id: string): Fake | undefined => byId[id],
        querySelectorAll: (): Fake[] => [tr] };
      assert.doesNotThrow(() => runInNewContext(readFileSync(join(out, 'search.js'), 'utf8'),
        { document }));
      assert.equal(byId['search']?.hidden, false);
    });
  });
});
