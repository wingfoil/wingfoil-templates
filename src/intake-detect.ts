// Intake detection (task-078, plan-065): the `wingfoil` versions published on npm and missing from
// compat.yaml, each classed against its predecessor. A pure function of the registry's answer to
// `npm view wingfoil versions time --json` and of the versions compat.yaml records.
import semver from 'semver';

export interface DetectReport {
  /** 0: none missing; 1: one or more missing; 2: the answer is refused. */
  code: number;
  /** The report's lines, in semver order, or `no missing version`. */
  lines: string[];
  /** Why the answer is refused; never a raw string from it. */
  errors: string[];
}

/** Strict `X.Y.Z`, checked before a version reaches an output line. */
const STRICT = /^(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)$/;

function refused(message: string): DetectReport {
  return { code: 2, lines: [], errors: [message] };
}

/** The published stable versions, or a refusal: a pre-release is ignored, any other non-strict
 * entry refuses the whole answer. `versions` is the source; `time`'s other keys are ignored. */
function published(registry: unknown): string[] | DetectReport {
  if (typeof registry !== 'object' || registry === null || Array.isArray(registry)) {
    return refused('the registry answer is not an object');
  }
  const raw = (registry as Record<string, unknown>)['versions'];
  const list: unknown[] = typeof raw === 'string' ? [raw] : Array.isArray(raw) ? raw : [];
  if (raw === undefined || list.length === 0) {
    return refused('the registry answer lists no versions');
  }
  const stable: string[] = [];
  let bad = 0;
  for (const entry of list) {
    if (typeof entry === 'string' && STRICT.test(entry)) {
      stable.push(entry);
    } else if (typeof entry === 'string' && semver.valid(entry) !== null
      && semver.prerelease(entry) !== null) {
      continue;
    } else {
      bad += 1;
    }
  }
  if (bad > 0) {
    return refused(`the registry answer holds ${String(bad)} `
      + `${bad === 1 ? 'entry that is not a version' : 'entries that are not versions'}`);
  }
  return stable;
}

function classOf(version: string, predecessor: string): string {
  const [x, y] = [semver.major(version), semver.minor(version)];
  const [px, py] = [semver.major(predecessor), semver.minor(predecessor)];
  if (x !== px) return 'major';
  if (y !== py) return x === 0 ? 'minor, breaking in 0.x' : 'minor';
  return 'patch';
}

export function detectMissing(registry: unknown, recorded: readonly string[]): DetectReport {
  const versions = published(registry);
  if (!Array.isArray(versions)) return versions;
  const known = [...recorded].sort(semver.compare);
  const oldest = known[0];
  const newest = known[known.length - 1];
  if (oldest === undefined || newest === undefined) {
    return refused('compat.yaml records no release');
  }
  const recordedSet = new Set(known);
  const all = [...new Set([...versions, ...known])].sort(semver.compare);
  const lines: string[] = [];
  for (const version of [...new Set(versions)].sort(semver.compare)) {
    if (recordedSet.has(version) || semver.lt(version, oldest)) continue;
    if (semver.lt(version, newest)) {
      lines.push(`${version} backport (below ${newest})`);
      continue;
    }
    // Defensive: a version above the newest recorded always has a predecessor in `all`.
    const predecessor = all.filter((v) => semver.lt(v, version)).pop() ?? newest;
    lines.push(`${version} ${classOf(version, predecessor)} (against ${predecessor})`);
  }
  if (lines.length === 0) return { code: 0, lines: ['no missing version'], errors: [] };
  return { code: 1, lines, errors: [] };
}
