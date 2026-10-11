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
      `${GITHUB}/tree/main/docs`]) {
      assert.equal(parseUrl(url), undefined, url);
    }
  });

  it('refuses a README link whose tag names another pack', () => {
    assert.equal(parseUrl(`${GITHUB}/blob/base@1.0.0/packs/stage/mvp/README.md`), undefined);
    assert.equal(parseUrl(`${RAW}/refs/tags/base@1.0.0/packs/stage/mvp/README.md`), undefined);
  });
});
