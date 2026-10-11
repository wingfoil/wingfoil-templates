// Examples as fixtures (spec-002 §2.4, task-022): every example of a pack README is a preset-format
// file under the tree's tests/fixtures/examples/<pack name>/<example>/, which the validation
// command composes like a preset and the publication counts as one of its compositions.
import { existsSync, lstatSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

export const EXAMPLES = 'tests/fixtures/examples';
/** Section 7 of a pack with no example, while the tree holds no methodology. */
export const EXEMPTION = 'None yet: no methodology pack is published.';

function byBytes(a: string, b: string): number {
  return Buffer.compare(Buffer.from(a), Buffer.from(b));
}

function directories(tree: string, rel: string): string[] {
  const dir = join(tree, rel);
  if (!existsSync(dir) || !lstatSync(dir).isDirectory()) return [];
  return readdirSync(dir).filter((name) => lstatSync(join(dir, name)).isDirectory()).sort(byBytes);
}

/** The example.yaml files of the tree, `<pack name>/<example>/example.yaml`, in byte order. */
export function exampleFiles(tree: string): string[] {
  return directories(tree, EXAMPLES).flatMap((pack) => directories(tree, `${EXAMPLES}/${pack}`)
    .map((example) => `${EXAMPLES}/${pack}/${example}/example.yaml`))
    .filter((file) => existsSync(join(tree, file)) && lstatSync(join(tree, file)).isFile())
    .sort(byBytes);
}
