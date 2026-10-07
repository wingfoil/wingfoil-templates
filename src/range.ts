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

export function isCompatible(version: VersionRequirements, release: CompatRelease): boolean {
  return release.format_key
    && Object.entries(version.formats).every(([kind, format]) =>
      release.reads[kind]?.includes(format) === true)
    && release.reads['workflows']?.includes(COMPOSED_WORKFLOWS_FORMAT) === true
    && version.requires_capabilities.every((name) => release.capabilities.includes(name));
}

function checkAscending(releases: CompatRelease[]): void {
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
