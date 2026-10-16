import { strict as assert } from 'node:assert';
import { existsSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { after, before, describe, it } from 'node:test';

import type { CatalogIndex, IndexPack } from '../src/index-model';
import { AGENT_NOTES, AGENT_STEPS, URL_PATTERNS } from '../src/index-render';
import { parseUrl } from '../src/index-urls';
import { scanMarkdown } from '../src/markdown-lines';
import { isCliCommand } from '../src/readme-rules';
import { runSite } from '../src/site';
import { filled, relativeLinks, resolveOffline, urlsOf } from './support/agent-urls';
import type { TestRepo } from './support/git-repo';
import { indexCatalog } from './support/index-catalog';
import { REPO_ROOT } from './support/paths';

const FILES = ['catalog-index.json', 'CATALOG.md', 'llms.txt'];

function read(tree: string, file: string): string {
  return readFileSync(join(tree, file), 'utf8');
}

describe('the agent path (task-021, CB-6 offline)', () => {
  let repo: TestRepo;
  let index: CatalogIndex;
  let sites: string;
  let site: string;
  let repositorySite: string;
  before(() => {
    repo = indexCatalog();
    index = JSON.parse(read(repo.dir, 'catalog-index.json')) as CatalogIndex;
    // The search page each tree deploys, which the Pages URLs resolve to (task-024).
    sites = mkdtempSync(join(tmpdir(), 'agent-sites-'));
    site = join(sites, 'fixture');
    repositorySite = join(sites, 'repository');
    assert.equal(runSite(['--tree', repo.dir, '--out', site]).code, 0);
    assert.equal(runSite(['--tree', REPO_ROOT, '--out', repositorySite]).code, 0);
  });
  after(() => {
    repo.dispose();
    rmSync(sites, { recursive: true, force: true });
  });

  describe('the procedure (acceptance 3)', () => {
    it('gives the same numbered steps in CATALOG.md › For agents and in llms.txt', () => {
      const catalog = read(repo.dir, 'CATALOG.md');
      const agents = catalog.slice(catalog.indexOf('## For agents'));
      const llms = read(repo.dir, 'llms.txt');
      const detail = llms.slice(llms.indexOf('\n> '), llms.indexOf('## Index'));
      const block = [...AGENT_STEPS.map((step, i) => `${i + 1}. ${step}`), '', AGENT_NOTES]
        .join('\n');
      assert.equal(AGENT_STEPS.length, 5);
      // In CATALOG.md the steps and notes come before the URL patterns.
      assert.ok(agents.indexOf(block) >= 0 && agents.indexOf(block) < agents.indexOf(
        'The URL patterns:'), agents);
      // In llms.txt they are the whole detail block between the blockquote and ## Index.
      const blockquote = llms.split('\n').find((line) => line.startsWith('> ')) ?? '';
      assert.equal(llms.slice(llms.indexOf(blockquote) + blockquote.length, llms.indexOf('## Index')),
        `\n\n${block}\n\n`);
      assert.ok(detail.length > 0);
    });

    it('keeps llms.txt\'s three sections, with no heading for the steps', () => {
      const headings = read(repo.dir, 'llms.txt').split('\n').filter((line) => line.startsWith('#'));
      assert.deepEqual(headings, ['# WingFoil template catalog', '## Index', '## Specifications',
        '## Reading a pack']);
    });

    it('says the files are anonymous, CORS-enabled, up to 5 minutes stale, with no server', () => {
      for (const words of ['anonymous', 'CORS', '5 minutes', 'no server', 'REST API',
        'code search', '`/` and `@`']) {
        assert.ok(AGENT_NOTES.includes(words), words);
      }
    });

    it('holds no WingFoil CLI command (the readme-command detector)', () => {
      for (const file of ['CATALOG.md', 'llms.txt']) {
        const scan = scanMarkdown(read(repo.dir, file));
        assert.deepEqual(scan.codeLines.filter((line) => isCliCommand(line.text, true)), [], file);
        assert.deepEqual(scan.codeSpans.filter((span) => isCliCommand(span.text, false)), [], file);
      }
    });
  });

  describe('every URL the index files emit (acceptance 4)', () => {
    it('extracts the placeholder URLs whole, and every URL of the Markdown files', () => {
      const urls = urlsOf('llms.txt', read(repo.dir, 'llms.txt'));
      for (const pattern of URL_PATTERNS) assert.ok(urls.includes(pattern.url), pattern.url);
      for (const file of ['CATALOG.md', 'llms.txt']) {
        const text = read(repo.dir, file);
        assert.equal(urlsOf(file, text).length, text.split('https://').length - 1, file);
      }
    });

    it('matches a form and resolves to a file, on the fixture catalog with tags', () => {
      let checked = 0;
      for (const file of FILES) {
        for (const url of urlsOf(file, read(repo.dir, file))) {
          assert.ok(parseUrl(url) !== undefined, `${file}: ${url} matches no form`);
          for (const concrete of filled(url, index)) {
            assert.ok(resolveOffline(concrete, repo.dir, REPO_ROOT, repo, site) !== undefined,
              `${file}: ${concrete} resolves to nothing`);
            checked += 1;
          }
        }
      }
      assert.ok(checked > 30, `${checked} URLs`);
    });

    it('lists the search page\'s URLs, which serve main only (task-024)', () => {
      for (const file of ['CATALOG.md', 'llms.txt']) {
        const urls = urlsOf(file, read(repo.dir, file));
        for (const path of ['', 'catalog-index.json', 'llms.txt']) {
          assert.ok(urls.includes(`https://wingfoil.github.io/wingfoil-templates/${path}`),
            `${file}: ${path}`);
        }
        assert.match(read(repo.dir, file), /serves `main` only/);
      }
    });

    it('names root files in its relative links', () => {
      for (const file of ['CATALOG.md', 'llms.txt']) {
        for (const target of relativeLinks(read(repo.dir, file))) {
          assert.ok(!target.includes('/'), target);
          assert.ok(existsSync(join(repo.dir, target)), target);
        }
      }
    });

    it('matches a form in this repository\'s files', () => {
      for (const file of FILES) {
        for (const url of urlsOf(file, read(REPO_ROOT, file))) {
          assert.ok(parseUrl(url) !== undefined, `${file}: ${url}`);
          if (!url.includes('<')) {
            const body = resolveOffline(url, REPO_ROOT, REPO_ROOT, undefined, repositorySite);
            assert.ok(body !== undefined, url);
            const page = parseUrl(url);
            if (page?.form === 'pages') {
              assert.equal(body, page.path === '' ? read(repositorySite, 'index.html')
                : read(REPO_ROOT, page.path), url);
              if (page.path === '') assert.ok(body.startsWith('<!DOCTYPE html>'), url);
            }
          }
        }
      }
    });
  });

  describe('the path, simulated (acceptance 5)', () => {
    const fetch = (url: string): string => {
      const body = resolveOffline(url, repo.dir, REPO_ROOT, repo);
      assert.ok(body !== undefined, url);
      return body;
    };
    const ids = (packs: IndexPack[]): string[] => packs.map((pack) => pack.id);

    it('goes from llms.txt to one pack\'s README and pack.yaml at its tag', () => {
      const llms = scanMarkdown(read(repo.dir, 'llms.txt'));
      const section = llms.headings.find((heading) => heading.text === 'Index');
      const link = llms.links.find((entry) => entry.line > (section?.line ?? 0)
        && entry.target.endsWith('/catalog-index.json'));
      assert.ok(link !== undefined);
      const found = JSON.parse(fetch(link.target)) as CatalogIndex;
      assert.deepEqual(ids(found.packs.filter((pack) => pack.axis === 'methodology')),
        ['methodology/flow', 'methodology/kanban']);
      assert.deepEqual(ids(found.packs.filter((pack) => pack.profiles.includes('small teams'))),
        ['methodology/kanban', 'phase/inception/lean']);
      const text = (pack: IndexPack): string =>
        `${pack.title} ${pack.description} ${pack.excerpt}`.toLowerCase();
      // A term only kanban's excerpt holds: not its title or description, nor another pack's.
      assert.deepEqual(ids(found.packs.filter((pack) => text(pack).includes('board'))),
        ['methodology/kanban']);
      const kanban = found.packs.find((pack) => pack.id === 'methodology/kanban');
      assert.ok(!`${kanban?.title ?? ''} ${kanban?.description ?? ''}`.toLowerCase()
        .includes('board'));
      const latest = kanban?.versions.find((version) => version.version === kanban.latest);
      assert.equal(latest?.version, '1.1.0');
      const readme = fetch(latest?.readme_url ?? '');
      const manifest = fetch(latest?.manifest_url ?? '');
      assert.equal(readme, repo.git(['show', 'methodology/kanban@1.1.0:packs/methodology/kanban/README.md']));
      assert.equal(manifest, repo.git(['show', 'methodology/kanban@1.1.0:packs/methodology/kanban/pack.yaml']));
      assert.notEqual(readme, read(repo.dir, 'packs/methodology/kanban/README.md'));
      assert.notEqual(manifest, read(repo.dir, 'packs/methodology/kanban/pack.yaml'));
    });
  });
});
