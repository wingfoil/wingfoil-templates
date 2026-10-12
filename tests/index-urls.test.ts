import { strict as assert } from 'node:assert';
import { describe, it } from 'node:test';

import { buildUrl, parseUrl } from '../src/index-urls';

const RAW = 'https://raw.githubusercontent.com/wingfoil/wingfoil-templates';
const GITHUB = 'https://github.com/wingfoil/wingfoil-templates';

describe('parseUrl and buildUrl (task-021 acceptance 4)', () => {
  const cases: [string, ReturnType<typeof parseUrl>][] = [
    [`${RAW}/main/catalog-index.json`, { form: 'raw-main', path: 'catalog-index.json' }],
    [`${RAW}/main/presets/small.yaml`, { form: 'raw-main', path: 'presets/small.yaml' }],
    [`${RAW}/refs/tags/methodology/kanban@1.1.0/packs/methodology/kanban/README.md`,
      { form: 'raw-tag', tag: 'methodology/kanban@1.1.0', path: 'packs/methodology/kanban/README.md' }],
    [`${RAW}/refs/tags/<catalog pack id>@<version>/packs/<catalog pack id>/pack.yaml`,
      { form: 'raw-tag', tag: '<catalog pack id>@<version>', path: 'packs/<catalog pack id>/pack.yaml' }],
    [`${GITHUB}/blob/phase/inception/lean@1.0.0/packs/phase/inception/lean/README.md`,
      { form: 'readme-github', tag: 'phase/inception/lean@1.0.0',
        path: 'packs/phase/inception/lean/README.md' }],
    [`${GITHUB}/blob/main/docs/memory/tech-spec/spec-002-pack-readme-and-catalog-index.md`,
      { form: 'github-main', path: 'docs/memory/tech-spec/spec-002-pack-readme-and-catalog-index.md' }],
  ];

  cases.push(
    ['https://wingfoil.github.io/wingfoil-templates/', { form: 'pages', path: '' }],
    ['https://wingfoil.github.io/wingfoil-templates/catalog-index.json',
      { form: 'pages', path: 'catalog-index.json' }],
    ['https://wingfoil.github.io/wingfoil-templates/llms.txt', { form: 'pages', path: 'llms.txt' }],
  );

  for (const [url, parsed] of cases) {
    it(`parses and rebuilds ${url.replace(/^https:\/\/[^/]+\/wingfoil\/wingfoil-templates/, '…')}`,
      () => {
        assert.deepEqual(parseUrl(url), parsed);
        const back = parseUrl(url);
        assert.ok(back !== undefined);
        assert.equal(buildUrl(back), url);
      });
  }

  it('refuses a URL of no form', () => {
    for (const url of ['https://example.org/x', `${RAW}/develop/catalog.yaml`,
      `${GITHUB}/blob/base@1.0.0/packs/base/pack.yaml`, `${RAW}/refs/tags/no-at/packs/x`,
      `${GITHUB}/tree/main/docs`, 'https://wingfoil.github.io/wingfoil-templates/index.html',
      'https://wingfoil.github.io/wingfoil-templates/catalog.yaml',
      'https://wingfoil.github.io/other/']) {
      assert.equal(parseUrl(url), undefined, url);
    }
  });

  it('refuses paths the index never emits, and empty or dot segments', () => {
    for (const url of [`${RAW}/refs/tags/base@1.0.0/catalog.yaml`,
      `${RAW}/refs/tags/base@1.0.0/packs/base/anything.txt`,
      `${RAW}/main/packs/methodology/kanban/README.md`, `${RAW}/main/../../etc/passwd`,
      `${RAW}/main/x?y=1`, `${RAW}/main/presets/a b.yaml`, `${RAW}/main/presets/../x.yaml`,
      `${GITHUB}/blob/main/a b`, `${GITHUB}/blob/main/README.md`,
      `${RAW}/refs/tags/@1.0/packs//README.md`, `${RAW}/refs/tags/base@/packs/base/README.md`,
      `${GITHUB}/blob/@1/packs//README.md`]) {
      assert.equal(parseUrl(url), undefined, url);
    }
  });

  it('accepts the files of main the index names, presets and transitions', () => {
    for (const path of ['catalog-index.json', 'CATALOG.md', 'catalog.yaml', 'compat.yaml',
      'presets/small-team.yaml', 'transitions/mvp-to-production.yaml', 'presets/<id>.yaml']) {
      assert.deepEqual(parseUrl(`${RAW}/main/${path}`), { form: 'raw-main', path });
    }
  });

  it('refuses a README link whose tag names another pack', () => {
    assert.equal(parseUrl(`${GITHUB}/blob/base@1.0.0/packs/stage/mvp/README.md`), undefined);
    assert.equal(parseUrl(`${RAW}/refs/tags/base@1.0.0/packs/stage/mvp/README.md`), undefined);
  });
});
