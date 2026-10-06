// Exact-pin check (adr-002, determinism directive): every dependency in package.json is pinned to
// an exact version, and package-lock.json resolves it to that same version.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const DEPENDENCY_FIELDS = [
  'dependencies',
  'devDependencies',
  'optionalDependencies',
  'peerDependencies',
] as const;

const EXACT_VERSION = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/;
const NPM_ALIAS = /^npm:((?:@[^/@]+\/)?[^@]+)@(.+)$/;

interface Pin {
  packageName: string;
  version: string;
}

export interface CheckResult {
  code: number;
  messages: string[];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/** The package and exact version a dependency spec pins, or undefined if it pins none. */
function parsePin(name: string, spec: string): Pin | undefined {
  const alias = NPM_ALIAS.exec(spec);
  if (alias) {
    const [, packageName = '', version = ''] = alias;
    return EXACT_VERSION.test(version) ? { packageName, version } : undefined;
  }
  return EXACT_VERSION.test(spec) ? { packageName: name, version: spec } : undefined;
}

function checkLocked(field: string, name: string, pin: Pin, lockfile: unknown): string | undefined {
  const packages = isRecord(lockfile) ? lockfile['packages'] : undefined;
  const entry = isRecord(packages) ? packages[`node_modules/${name}`] : undefined;
  if (!isRecord(entry)) {
    return `${field}.${name}: missing from package-lock.json`;
  }
  const lockedName = typeof entry['name'] === 'string' ? entry['name'] : name;
  if (lockedName !== pin.packageName || entry['version'] !== pin.version) {
    return `${field}.${name}: package-lock.json has ${lockedName}@${String(entry['version'])}, `
      + `package.json pins ${pin.packageName}@${pin.version}`;
  }
  return undefined;
}

/** Every problem found, sorted so that the output does not depend on key order. */
export function checkPins(manifest: unknown, lockfile: unknown): string[] {
  const problems: string[] = [];
  for (const field of DEPENDENCY_FIELDS) {
    const deps = isRecord(manifest) ? manifest[field] : undefined;
    if (!isRecord(deps)) continue;
    for (const [name, spec] of Object.entries(deps)) {
      const pin = typeof spec === 'string' ? parsePin(name, spec) : undefined;
      const problem = pin
        ? checkLocked(field, name, pin, lockfile)
        : `${field}.${name}: ${JSON.stringify(spec)} is not an exact version`;
      if (problem) problems.push(problem);
    }
  }
  return problems.sort();
}

function readJson(dir: string, file: string): unknown {
  return JSON.parse(readFileSync(join(dir, file), 'utf8'));
}

export function runCheckPins(dir: string): CheckResult {
  let manifest: unknown;
  let lockfile: unknown;
  try {
    manifest = readJson(dir, 'package.json');
    lockfile = readJson(dir, 'package-lock.json');
  } catch (error) {
    return { code: 2, messages: [error instanceof Error ? error.message : String(error)] };
  }
  if (!isRecord(manifest)) {
    return { code: 2, messages: ['package.json: not a JSON object'] };
  }
  if (!isRecord(lockfile) || !isRecord(lockfile['packages'])) {
    return { code: 2, messages: ['package-lock.json: no `packages` map (lockfileVersion < 2)'] };
  }
  const messages = checkPins(manifest, lockfile);
  return { code: messages.length > 0 ? 1 : 0, messages };
}

if (require.main === module) {
  const result = runCheckPins(process.cwd());
  for (const message of result.messages) process.stderr.write(`${message}\n`);
  process.exitCode = result.code;
}
