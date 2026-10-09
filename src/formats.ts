// The `format:` key of a file a pack ships (spec-001 §5, §18): present, written as a positive
// YAML integer, and equal to the pack's `formats` entry for its kind.
import { CompositionError } from './composition-error';

/** A format counter as written in YAML: a positive base-10 integer. */
const FORMAT_SOURCE = /^[1-9][0-9]*$/;

export interface FormatCheck {
  /** `<pack>: <path>`, for messages. */
  label: string;
  /** The file kind of spec-001 §12: dna, roles, memory, workflow, directive, memory-template. */
  kind: string;
  declared: unknown;
  /** The value's source text, when the file was YAML. */
  source: string | undefined;
  /** The pack's `formats` entry for the kind. */
  expected: number | undefined;
}

/** Why a file's format does not hold, or undefined when it does; the lint reports it (task-012). */
export function formatMessage(check: FormatCheck): string | undefined {
  const { label, kind, declared, source, expected } = check;
  if (typeof declared !== 'number' || !Number.isInteger(declared)) {
    return `${label} must declare format: (spec-001 §5)`;
  }
  if (source !== undefined && !FORMAT_SOURCE.test(source)) {
    return `${label}: format is written ${source}; it must be a YAML integer (spec-001 §18)`;
  }
  if (declared !== expected) {
    return `${label}: format ${declared}, but its pack.yaml formats.${kind} is ${String(expected)}`;
  }
  return undefined;
}

export function checkFormat(check: FormatCheck): number {
  const message = formatMessage(check);
  if (message !== undefined) throw new CompositionError(message);
  return check.declared as number;
}
