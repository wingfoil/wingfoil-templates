// The line policy (F5.3, dl-002, pack-semver, task-016). Before WingFoil 1.0, one living line per
// pack: a version above every published one. From WingFoil 1.0, lines N and N-1: N-1 is the pack's
// previous major (the approver's reading of dl-002, 2026-10-10), on the branch
// `maint/<catalog pack id>/<major>.x` (spec-001 §4, dl-004 3(b)), which takes a patch or a minor
// above the line's newest version, with the line's formats and from a head that descends from that
// version's tag. "A fix, not a feature" stays the review's judgement (pack-semver).
import { compare, gt, major, valid } from 'semver';

export class LineError extends Error {}

export interface PublishedVersion {
  version: string;
  formats: Record<string, number>;
}

export interface LineInput {
  pack: string;
  version: string;
  formats: Record<string, number>;
  /** The checked-out branch, or '' when HEAD is detached. */
  branch: string;
  /**
   * The pack's published versions: main's catalog.yaml, and on the current line the working tree's
   * too.
   */
  published: PublishedVersion[];
  /** compat.yaml lists a WingFoil release 1.0.0 or later. */
  fromOne: boolean;
  /** Whether the branch's head descends from a tag. */
  descends: (tag: string) => boolean;
}

export type Line = { kind: 'current' } | { kind: 'maintenance'; major: number };

/** Any branch under maint/: a maintenance line, or a refusal, never the current line. */
export function isMaintenanceBranch(branch: string): boolean {
  return branch.startsWith('maint/');
}

/** The `line` field of the pack-release element: `current` or `<major>.x`. */
export function lineName(line: Line): string {
  return line.kind === 'current' ? 'current' : `${line.major}.x`;
}

const MAINTENANCE = /^maint\/(.+)\/(\d+)\.x$/;

function same(a: Record<string, number>, b: Record<string, number>): boolean {
  const keys = (doc: Record<string, number>): string => JSON.stringify(Object.entries(doc)
    .sort(([x], [y]) => (x < y ? -1 : x > y ? 1 : 0)));
  return keys(a) === keys(b);
}

export function decideLine(input: LineInput): Line {
  const { pack, version, branch } = input;
  const maintenance = MAINTENANCE.exec(branch);
  const onMaintenance = isMaintenanceBranch(branch);
  const published = input.published.filter((entry) => valid(entry.version) !== null)
    .sort((a, b) => compare(a.version, b.version));
  const newest = published[published.length - 1];
  if (!input.fromOne) {
    if (onMaintenance) {
      throw new LineError(`${branch}: maintenance lines start with WingFoil 1.0 (dl-002); `
        + 'before it a pack has one living line');
    }
  }
  if (onMaintenance && maintenance === null) {
    throw new LineError(`${branch} is not a maintenance branch name: maint/<catalog pack id>/`
      + '<major>.x (spec-001 §4)');
  }
  if (maintenance === null) {
    if (newest !== undefined && !gt(version, newest.version)) {
      throw new LineError(`${pack} ${version} is not above the published ${newest.version}: the `
        + 'current line takes a newer version'
        + (input.fromOne ? '; a fix to the previous major is published from maint/'
          + `${pack}/<major>.x` : ' (one living line before WingFoil 1.0)'));
    }
    return { kind: 'current' };
  }
  const [, branchPack, branchMajor] = maintenance;
  if (branchPack !== pack) {
    throw new LineError(`${branch} is a maintenance branch of ${String(branchPack)}, `
      + `not of ${pack}`);
  }
  const lineMajor = Number(branchMajor);
  if (major(version) !== lineMajor) {
    throw new LineError(`${pack} ${version} is not on the line ${lineMajor}.x of ${branch}`);
  }
  if (newest === undefined || major(newest.version) <= lineMajor) {
    throw new LineError(`${lineMajor}.x is not a previous line of ${pack}: no newer major is `
      + 'published');
  }
  const older = published.map((entry) => major(entry.version))
    .filter((value) => value < major(newest.version));
  if (older.length === 0) {
    throw new LineError(`${lineMajor}.x is not N-1 of ${pack}: N is ${major(newest.version)}.x `
      + 'and no older major is published');
  }
  const previousMajor = Math.max(...older);
  if (lineMajor !== previousMajor) {
    throw new LineError(`${lineMajor}.x is not N-1 of ${pack}: N is ${major(newest.version)}.x, `
      + `N-1 is ${previousMajor}.x (dl-002)`);
  }
  const lineNewest = published.filter((entry) => major(entry.version) === lineMajor).pop();
  if (lineNewest === undefined || !gt(version, lineNewest.version)) {
    throw new LineError(`${pack} ${version} is not above ${String(lineNewest?.version)}, `
      + `the newest of ${lineMajor}.x`);
  }
  if (!same(input.formats, lineNewest.formats)) {
    throw new LineError(`${pack} ${version} changes the formats of ${lineMajor}.x: a format `
      + 'move is a major (pack-semver), never a fix on N-1');
  }
  const tag = `${pack}@${lineNewest.version}`;
  if (!input.descends(tag)) {
    throw new LineError(`${branch} does not descend from ${tag}, the newest of its line`);
  }
  return { kind: 'maintenance', major: lineMajor };
}
