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

export function runCompose(argv: string[]): { code: number; message?: string } {
  const leak = process.env['LEAK'] ?? 'none';
  if (leak === 'kill') process.kill(process.pid, 'SIGKILL');
  if (leak === 'io') return { code: 2, message: 'cannot write the output' };
  const out = argv[argv.indexOf('--out') + 1] ?? '';
  mkdirSync(out, { recursive: true });
  writeFileSync(join(out, 'leak.txt'), `${(LEAKS[leak] ?? LEAKS['none'])?.() ?? ''}\n`);
  return { code: 0 };
}
