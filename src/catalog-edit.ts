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
  const packs = (document.toJS() as Doc)['packs'];
  if (!Array.isArray(packs)) throw new CatalogEditError('catalog.yaml packs is not a list');
  const entries = packs as Doc[];
  let pack = entries.find((entry) => entry['id'] === packId);
  if (pack === undefined) {
    pack = newPackEntry(packId);
    entries.push(pack);
  }
  (pack['versions'] as Doc[]).push(version);
  // A block sequence's range runs past its last line break; the edit stops before it.
  let end = valueEnd;
  while (end > keyStart && text[end - 1] === '\n') end -= 1;
  const block = toYaml({ packs: entries }).replace(/\n$/, '');
  return `${text.slice(0, keyStart)}${block}${text.slice(end)}`;
}
