// Two feedback channels serving one target in one composition (task-093, spec-003 §5.2, §11):
// `validate` refuses the composition, `npm run compose` composes it; the helpers in
// tests/support/validate-harness.ts.
import { strict as assert } from 'node:assert';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, it } from 'node:test';

import { runCompose } from '../src/compose-cli';

import { writePack } from './support/pack-tree';
import type { PackSpec } from './support/pack-tree';
import { NAME, validate, withTree, replaceIn } from './support/validate-harness';

const channel = (id: string, target: string): PackSpec => ({ id: `governance/${id}`,
  requires: ['base@^1', 'governance/feedback@^1'], directives: [id], extraFiles: {
    [`directives/${id}.md`]: `---\nid: ${id}\nformat: 1\ntags: ["feedback-channel"]\n---\n`
      + `# ${id}\n\nServes the target \`${target}\`.\n` } });

/** Writes a preset and its index entry. */
function writePreset(tree: string, id: string, packs: string[]): void {
  writeFileSync(join(tree, 'presets', `${id}.yaml`), `format: 1\nid: ${id}\ntitle: "${id}"\n`
    + `description: "Channels."\npacks:\n${packs.map((pack) => `  - ${pack}\n`).join('')}`
    + 'parameters: {}\n');
  replaceIn(join(tree, 'catalog.yaml'), 'presets:\n',
    `presets:\n  - { id: ${id}, path: presets/${id}.yaml }\n`);
}

describe('npm run validate: one feedback channel per target (task-093, spec-003 §5.2)', () => {
  it('refuses a preset composing two channels for one target; compose composes it', () => {
    withTree((tree) => {
      writePack(tree, { id: 'governance/feedback', directives: ['feedback'] });
      writePack(tree, channel('up-a', 'upstream:vendor'));
      writePack(tree, channel('up-b', 'upstream:vendor'));
      writePack(tree, channel('up-c', 'upstream:other'));
      writePreset(tree, 'two-channels',
        ['methodology/kanban@^1', 'governance/up-a@^1', 'governance/up-b@^1']);
      writePreset(tree, 'two-targets',
        ['methodology/kanban@^1', 'governance/up-a@^1', 'governance/up-c@^1']);
    }, (tree) => {
      const result = validate(['--tree', tree, ...NAME]);
      const report = result.lines.join('\n');
      // The tree's new packs carry no README examples, so the lint reports them too: the
      // composition's own line is the evidence, not the exit code.
      const refused = result.lines.filter((line) => line.includes('feedback-channel-target'));
      assert.equal(refused.length, 1, report);
      assert.match(refused[0] ?? '', new RegExp('^composition [^:]*two-channels[^:]*: '
        + 'feedback-channel-target: 2 feedback-channel directives serve upstream:vendor: '
        + '.*up-a\\.md, .*up-b\\.md'), report);
      assert.ok(result.lines.some((line) => /^composition [^:]*two-targets[^:]*: composed twice/
        .test(line)), report);
      const out = mkdtempSync(join(tmpdir(), 'channels-'));
      try {
        const composed = runCompose(['--tree', tree, '--out', join(out, 'o'), ...NAME,
          'methodology/kanban', 'governance/up-a', 'governance/up-b']);
        assert.equal(composed.code, 0, composed.message);
      } finally {
        rmSync(out, { recursive: true, force: true });
      }
    }, true);
  });
});
