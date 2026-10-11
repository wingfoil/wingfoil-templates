import { strict as assert } from 'node:assert';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { after, before, describe, it } from 'node:test';

import type { CatalogIndex, IndexPack } from '../src/index-model';
import { AGENT_STEPS } from '../src/index-render';
import { parseUrl } from '../src/index-urls';
import { scanMarkdown } from '../src/markdown-lines';
import { isCliCommand } from '../src/readme-rules';
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
  before(() => {
    repo = indexCatalog();
    index = JSON.parse(read(repo.dir, 'catalog-index.json')) as CatalogIndex;
  });
  after(() => repo.dispose());

  describe('the procedure (acceptance 3)', () => {
    it('gives the same numbered steps in CATALOG.md › For agents and in llms.txt', () => {
      const catalog = read(repo.dir, 'CATALOG.md');
      const agents = catalog.slice(catalog.indexOf('## For agents'));
      const llms = read(repo.dir, 'llms.txt');
      const detail = llms.slice(llms.indexOf('\n> '), llms.indexOf('## Index'));
      AGENT_STEPS.forEach((step, i) => {
        assert.ok(agents.includes(`${i + 1}. ${step}\n`), step);
        assert.ok(detail.includes(`${i + 1}. ${step}\n`), step);
      });
      assert.equal(AGENT_STEPS.length, 5);
    });

    it('keeps llms.txt\'s three sections, with no heading for the steps', () => {
      const headings = read(repo.dir, 'llms.txt').split('\n').filter((line) => line.startsWith('#'));
      assert.deepEqual(headings, ['# WingFoil template catalog', '## Index', '## Specifications',
        '## Reading a pack']);
    });

    it('says the files are anonymous, CORS-enabled, up to 5 minutes stale, with no server', () => {
      for (const file of ['CATALOG.md', 'llms.txt']) {
        const text = read(repo.dir, file);
        for (const words of ['anonymous', 'CORS', '5 minutes', 'no server', 'REST API',
          'code search', '`/` and `@`']) {
          assert.ok(text.includes(words), `${file}: ${words}`);
        }
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
    it('extracts the placeholder URLs whole', () => {
      const urls = urlsOf('llms.txt', read(repo.dir, 'llms.txt'));
      assert.ok(urls.includes('https://raw.githubusercontent.com/wingfoil/wingfoil-templates/refs/'
        + 'tags/<catalog pack id>@<version>/packs/<catalog pack id>/README.md'), urls.join('\n'));
      assert.ok(urls.includes('https://raw.githubusercontent.com/wingfoil/wingfoil-templates/main/'
        + 'presets/<id>.yaml'));
    });

    it('matches a form and resolves to a file, on the fixture catalog with tags', () => {
      let checked = 0;
      for (const file of FILES) {
        for (const url of urlsOf(file, read(repo.dir, file))) {
          assert.ok(parseUrl(url) !== undefined, `${file}: ${url} matches no form`);
          for (const concrete of filled(url, index)) {
            assert.ok(resolveOffline(concrete, repo.dir, REPO_ROOT, repo) !== undefined,
              `${file}: ${concrete} resolves to nothing`);
            checked += 1;
          }
        }
      }
      assert.ok(checked > 30, `${checked} URLs`);
    });

    it('names root files in its relative links', () => {
      for (const file of ['CATALOG.md', 'llms.txt']) {
        for (const target of relativeLinks(read(repo.dir, file))) {
          assert.ok(!target.includes('/'), target);
          assert.ok(resolveOffline(`https://raw.githubusercontent.com/wingfoil/wingfoil-templates/`
            + `main/${target}`, repo.dir, REPO_ROOT) !== undefined, target);
        }
      }
    });

    it('matches a form in this repository\'s files', () => {
      for (const file of FILES) {
        for (const url of urlsOf(file, read(REPO_ROOT, file))) {
          assert.ok(parseUrl(url) !== undefined, `${file}: ${url}`);
          if (!url.includes('<')) {
            assert.ok(resolveOffline(url, REPO_ROOT, REPO_ROOT) !== undefined, url);
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
        ['methodology/kanban']);
      assert.deepEqual(ids(found.packs.filter((pack) => pack.profiles.includes('small teams'))),
        ['methodology/kanban', 'phase/inception/lean']);
      const text = (pack: IndexPack): string =>
        `${pack.title} ${pack.description} ${pack.excerpt}`.toLowerCase();
      assert.deepEqual(ids(found.packs.filter((pack) => text(pack).includes('flow'))),
        ['methodology/kanban']);
      const kanban = found.packs.find((pack) => pack.id === 'methodology/kanban');
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
