// The computed WingFoil range of spec-001 §12 (dl-002): never written by hand.
import { gt, valid } from 'semver';

/** One `releases[]` entry of compat.yaml. */
export interface CompatRelease {
  wingfoil: string;
  format_key: boolean;
  reads: Record<string, number[]>;
  capabilities: string[];
}

/** What a pack version or a transition declares (§6.2, §14). */
export interface VersionRequirements {
  formats: Record<string, number>;
  requires_capabilities: string[];
}

/** The composed workflows.yaml is format 1 (spec-001 §7.7). */
const COMPOSED_WORKFLOWS_FORMAT = 1;

/** Own keys only: a kind named like an Object.prototype member is not read. */
function reads(release: CompatRelease, kind: string, format: number): boolean {
  return Object.hasOwn(release.reads, kind) && release.reads[kind]?.includes(format) === true;
}

/** `formatKey: false` drops the first condition only: the matrix's self-test mode (dl-009). */
export interface CompatibilityOptions {
  formatKey: boolean;
}

export function isCompatible(
  version: VersionRequirements,
  release: CompatRelease,
  options: CompatibilityOptions = { formatKey: true },
): boolean {
  return (release.format_key || !options.formatKey)
    && Object.entries(version.formats).every(([kind, format]) => reads(release, kind, format))
    && reads(release, 'workflows', COMPOSED_WORKFLOWS_FORMAT)
    && version.requires_capabilities.every((name) => release.capabilities.includes(name));
}

/** Every release a version, each greater than the one before: none repeated, none descending. */
export function checkAscending(releases: CompatRelease[]): void {
  releases.forEach((release, index) => {
    if (valid(release.wingfoil) === null) {
      throw new Error(`compat.yaml: ${JSON.stringify(release.wingfoil)} is not a version`);
    }
    const previous = releases[index - 1];
    if (previous !== undefined && !gt(release.wingfoil, previous.wingfoil)) {
      throw new Error(`compat.yaml: releases are not in ascending order at ${release.wingfoil}`);
    }
  });
}

/** Runs of releases consecutive in compat.yaml, `>=first <=last` or `first`, joined by ` || `. */
export function computeRange(version: VersionRequirements, releases: CompatRelease[]): string {
  checkAscending(releases);
  const runs: string[][] = [];
  let current: string[] = [];
  for (const release of releases) {
    if (isCompatible(version, release)) {
      current.push(release.wingfoil);
    } else if (current.length > 0) {
      runs.push(current);
      current = [];
    }
  }
  if (current.length > 0) runs.push(current);
  return runs
    .map((run) => {
      const first = run[0] ?? '';
      const last = run[run.length - 1] ?? '';
      return run.length === 1 ? first : `>=${first} <=${last}`;
    })
    .join(' || ');
}
