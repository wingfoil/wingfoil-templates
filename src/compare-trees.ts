// Byte-for-byte comparison of two composed trees (F3.4): the file lists, then every file's bytes.
// Modes are not compared: they follow the umask of the process that wrote them.
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

/** Every file under a directory, relative to it with `/` separators, in byte order. */
export function listTree(dir: string, prefix = ''): string[] {
  const files: string[] = [];
  for (const entry of readdirSync(join(dir, prefix), { withFileTypes: true })) {
    const path = prefix === '' ? entry.name : `${prefix}/${entry.name}`;
    if (entry.isDirectory()) files.push(...listTree(dir, path));
    else files.push(path);
  }
  return files.sort((a, b) => Buffer.compare(Buffer.from(a), Buffer.from(b)));
}

/** One message per difference; none when the trees are byte-identical. */
export function compareTrees(first: string, second: string): string[] {
  const a = listTree(first);
  const b = listTree(second);
  const all = [...new Set([...a, ...b])]
    .sort((x, y) => Buffer.compare(Buffer.from(x), Buffer.from(y)));
  const differences: string[] = [];
  for (const path of all) {
    if (!b.includes(path)) differences.push(`${path}: only in the first composition`);
    else if (!a.includes(path)) differences.push(`${path}: only in the second composition`);
    else if (!readFileSync(join(first, path)).equals(readFileSync(join(second, path)))) {
      differences.push(`${path}: the bytes differ`);
    }
  }
  return differences;
}
