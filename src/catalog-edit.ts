// The one edit a publication makes to catalog.yaml (spec-001 §11, task-014): a version entry, and the
// pack entry the first time. Only the `packs:` block is rewritten, as a block sequence written by
// toYaml; every other byte of the file, comments included, is kept.
import { isMap, isScalar, parseDocument } from 'yaml';

import { toYaml } from './yaml-write';

type Doc = Record<string, unknown>;

export class CatalogEditError extends Error {}

/** The pack entry written the first time a pack is published (spec-001 §11). */
export function newPackEntry(packId: string): Doc {
  return { id: packId, path: `packs/${packId}`, catalog: 'official', status: 'active', versions: [] };
}

export function addVersion(text: string, packId: string, version: Doc): string {
  const document = parseDocument(text);
  const root = document.contents;
  if (!isMap(root)) throw new CatalogEditError('catalog.yaml is not a mapping');
  const pair = root.items.find((item) => isScalar(item.key) && item.key.value === 'packs');
  const keyStart = isScalar(pair?.key) ? pair.key.range?.[0] : undefined;
  const valueEnd = (pair?.value as { range?: [number, number, number] } | null)?.range?.[1];
  if (keyStart === undefined || valueEnd === undefined) {
    throw new CatalogEditError('catalog.yaml has no packs list');
  }
  // A comment inside the block would be lost in the rewrite: refused, never dropped silently.
  const lineEnd = text.indexOf('\n', valueEnd);
  const region = text.slice(keyStart, lineEnd === -1 ? text.length : lineEnd);
  if (/(^|\s)#/m.test(region)) {
    throw new CatalogEditError('catalog.yaml: the packs block holds a comment, which the '
      + 'publication would drop; move it above packs:');
  }
  const packs = (document.toJS() as Doc)['packs'];
  if (!Array.isArray(packs)) throw new CatalogEditError('catalog.yaml packs is not a list');
  const entries = packs as Doc[];
  let pack = entries.find((entry) => entry['id'] === packId);
  if (pack === undefined) {
    pack = newPackEntry(packId);
    entries.push(pack);
  }
  if (!Array.isArray(pack['versions'])) pack['versions'] = [];
  (pack['versions'] as Doc[]).push(version);
  // A planned pack becomes active with its first version (spec-001 §11).
  if (pack['status'] === 'planned') pack['status'] = 'active';
  // A block sequence's range runs past its last line break; the edit stops before it.
  let end = valueEnd;
  while (end > keyStart && text[end - 1] === '\n') end -= 1;
  const block = toYaml({ packs: entries }).replace(/\n$/, '');
  return `${text.slice(0, keyStart)}${block}${text.slice(end)}`;
}
