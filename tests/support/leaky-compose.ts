// A stand-in for the compose command (task-007) that writes what the LEAK variable names, so that
// tests can show the determinism check catching each input a composer must not read.
import { mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const LEAKS: Record<string, () => string> = {
  none: () => 'same',
  tz: () => String(new Date(0).getHours()),
  home: () => process.env['HOME'] ?? '',
  cwd: () => process.cwd(),
  umask: () => String(process.umask()),
  locale: () => Intl.DateTimeFormat().resolvedOptions().locale,
  tmpdir: () => tmpdir(),
};

export function runCompose(argv: string[]):
{ code: number; message?: string; notices?: string[] } {
  const leak = process.env['LEAK'] ?? 'none';
  if (leak === 'kill') process.kill(process.pid, 'SIGKILL');
  if (leak === 'io') return { code: 2, message: 'cannot write the output' };
  const out = argv[argv.indexOf('--out') + 1] ?? '';
  mkdirSync(out, { recursive: true });
  writeFileSync(join(out, 'leak.txt'), `${(LEAKS[leak] ?? LEAKS['none'])?.() ?? ''}\n`);
  // A tension's notice (spec-001 §17 step 8, task-084): the same in both runs, or one that reads
  // the home directory, which the second run changes.
  if (leak === 'notice') return { code: 0, notices: ['notice: a and b: c.'] };
  if (leak === 'notice-home') {
    return { code: 0, notices: [`notice: a and b: ${process.env['HOME'] ?? ''}`] };
  }
  return { code: 0 };
}
