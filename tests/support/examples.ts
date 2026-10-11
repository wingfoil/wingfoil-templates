// Examples as fixtures in the scratch trees of the tests (task-022): one example `basic` per pack,
// with its fixture, once all packs are written, when the tree holds methodology/kanban; otherwise
// the README keeps the exemption line that writePack writes.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

import type { PackSpec } from './pack-tree';

export { EXEMPTION } from '../../src/examples';
import { EXEMPTION } from '../../src/examples';

function nameOf(id: string): string {
  return id.slice(id.lastIndexOf('/') + 1);
}

/** Section 7's body for one example of a pack, its fixture named. */
export function exampleSection(name: string, example = 'basic'): string {
  return `### ${example}\n\nFixture: tests/fixtures/examples/${name}/${example}/\n\n`
    + 'A fictional team adopts the pack with kanban.\n';
}

/** The example.yaml of a pack's `basic` example: the pack at its major, and kanban. */
export function exampleYaml(spec: PackSpec, example = 'basic'): string {
  const major = (spec.version ?? '1.0.0').split('.')[0] ?? '1';
  const packs = [`${spec.id}@^${major}`];
  if (!spec.id.startsWith('methodology/')) packs.push('methodology/kanban@^1');
  return `format: 1\nid: ${example}\ntitle: "Basic"\ndescription: "A fictional team."\n`
    + `packs:\n${packs.map((entry) => `  - ${entry}\n`).join('')}`;
}

export function writeExamples(root: string, specs: PackSpec[]): void {
  if (!specs.some((spec) => spec.id === 'methodology/kanban')) return;
  for (const spec of specs) {
    const name = nameOf(spec.id);
    const fixture = join(root, 'tests', 'fixtures', 'examples', name, 'basic', 'example.yaml');
    mkdirSync(dirname(fixture), { recursive: true });
    writeFileSync(fixture, exampleYaml(spec));
    const readme = join(root, 'packs', spec.id, 'README.md');
    if (!existsSync(readme)) continue;
    const text = readFileSync(readme, 'utf8');
    // A README the test wrote itself keeps its section 7.
    if (text.includes(`## Examples\n\n${EXEMPTION}\n`)) {
      writeFileSync(readme, text.replace(`## Examples\n\n${EXEMPTION}\n`,
        `## Examples\n\n${exampleSection(name)}`));
    }
  }
}
