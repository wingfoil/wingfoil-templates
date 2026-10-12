import { strict as assert } from 'node:assert';
import { existsSync, readFileSync } from 'node:fs';
import { join, normalize } from 'node:path';
import { describe, it } from 'node:test';

import { scanMarkdown } from '../src/markdown-lines';
import { REPO_ROOT } from './support/paths';

function readme(): string {
  return readFileSync(join(REPO_ROOT, 'README.md'), 'utf8');
}

describe('the root README.md (task-023)', () => {
  it('links only relative targets that exist in the repository (acceptance 4)', () => {
    const targets = scanMarkdown(readme()).links.map((link) => link.target);
    assert.ok(targets.length > 0);
    for (const target of targets) {
      assert.doesNotMatch(target, /^[a-z][a-z0-9+.-]*:/i, `${target}: a scheme`);
      assert.ok(!target.startsWith('/'), `${target}: an absolute path`);
      const path = target.replace(/#.*$/, '').replace(/\/$/, '');
      const resolved = normalize(path);
      assert.ok(resolved !== '..' && !resolved.startsWith('../'), `${target}: out of the root`);
      assert.ok(path === '' || existsSync(join(REPO_ROOT, path)), `${target}: no such file`);
    }
  });

  it('links CATALOG.md and llms.txt, and the two specifications', () => {
    const targets = scanMarkdown(readme()).links.map((link) => link.target);
    for (const expected of ['CATALOG.md', 'llms.txt']) assert.ok(targets.includes(expected), expected);
    assert.ok(targets.some((target) => target.includes('/spec-001-')));
    assert.ok(targets.some((target) => target.includes('/spec-002-')));
  });

  it('names only scripts of package.json, and no email address (acceptance 5)', () => {
    const scripts = (JSON.parse(readFileSync(join(REPO_ROOT, 'package.json'), 'utf8')) as
      { scripts: Record<string, string> }).scripts;
    const named = [...readme().matchAll(/npm run (?:-s )?([a-z][a-z:-]*)/g)].map((match) => match[1]);
    assert.ok(named.length >= 5, named.join(', '));
    for (const script of named) assert.ok(Object.hasOwn(scripts, script ?? ''), script);
    const prose = scanMarkdown(readme()).codeSpans.reduce((text, span) =>
      text.replace(`\`${span.text}\``, ''), readme());
    assert.doesNotMatch(prose, /\S+@\S+\.\S+/);
  });
});
