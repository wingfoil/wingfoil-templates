// The evidence of a pack-release (F5.1): the `## Validation` section of the element, written from a
// validate result in publication mode only (dl-009). A self-test result, a result that applied the
// self-test tolerance, or a run that failed is refused, so evidence is never read as a clean run.
import type { ValidateResult } from './validate';

export class EvidenceError extends Error {}

export interface EvidenceContext {
  /** The commit the validation ran on (`HEAD` of the tree). */
  commit: string;
  /** The command as typed, for the record. */
  command: string;
}

const MATRIX_LINE = /^matrix \S+ wingfoil@(\S+) /;
const COMPOSITION_LINE = /^composition (\S+): composed twice/;

function unique(values: string[]): string[] {
  return [...new Set(values)];
}

export function writeEvidence(result: ValidateResult, context: EvidenceContext): string {
  if (result.mode !== 'publication') {
    throw new EvidenceError(`a ${result.mode} result is not evidence (dl-009)`);
  }
  if (result.tolerated.length > 0) {
    throw new EvidenceError(`the tolerance was applied for ${result.tolerated.join(', ')}; `
      + 'such a result is not evidence (dl-009)');
  }
  if (result.code !== 0) {
    throw new EvidenceError(`the validation exited ${result.code}`);
  }
  const releases = unique(result.lines.flatMap((line) => MATRIX_LINE.exec(line)?.[1] ?? []));
  const compositions = unique(result.lines.flatMap((line) => COMPOSITION_LINE.exec(line)?.[1] ?? []));
  return [
    '## Validation',
    '',
    `- Commit: \`${context.commit}\``,
    `- Command: \`${context.command}\``,
    `- Mode: ${result.mode}`,
    `- Exit code: ${result.code}`,
    `- WingFoil releases: ${releases.join(', ')}`,
    `- Compositions: ${compositions.join(', ')}`,
    '',
    'Report:',
    '',
    '```text',
    ...result.lines,
    '```',
    '',
  ].join('\n');
}
