// `requires` and `conflicts` entries (spec-001 §6.3): `<catalog pack id>@<range>`, the range a
// subset of node-semver. The grammar is the pack schema's, the contract with WingFoil; `semver`
// only evaluates a range the grammar accepted (adr-003).
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { satisfies as semverSatisfies } from 'semver';

import { SCHEMA_DIR } from './schemas';

export interface Entry {
  id: string;
  /** Absent only in a `conflicts` entry, where it means every version. */
  range?: string;
}

export type EntryKind = 'requires' | 'conflicts';

let patterns: Record<EntryKind, RegExp> | undefined;

function patternFor(kind: EntryKind): RegExp {
  if (patterns === undefined) {
    const schema = JSON.parse(readFileSync(join(SCHEMA_DIR, 'pack.schema.json'), 'utf8')) as {
      $defs: Record<'requiresEntry' | 'conflictsEntry', { pattern: string }>;
    };
    patterns = {
      requires: new RegExp(schema.$defs.requiresEntry.pattern),
      conflicts: new RegExp(schema.$defs.conflictsEntry.pattern),
    };
  }
  return patterns[kind];
}

export function parseEntry(entry: string, kind: EntryKind): Entry {
  if (!patternFor(kind).test(entry)) {
    throw new Error(`${JSON.stringify(entry)} is not a valid ${kind} entry (spec-001 §6.3)`);
  }
  const at = entry.indexOf('@');
  return at < 0 ? { id: entry } : { id: entry.slice(0, at), range: entry.slice(at + 1) };
}

/** Whether a release version is in a range; no loose parsing, no prerelease ever matches. */
export function satisfies(version: string, range: string): boolean {
  return semverSatisfies(version, range, { loose: false, includePrerelease: false });
}
