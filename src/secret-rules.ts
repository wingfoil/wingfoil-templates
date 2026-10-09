// F3.5, no secrets (task-012, acceptance 11; `security-secrets`): a PEM private key block, a token
// with a known prefix and its full body, or a long high-entropy string, in a file under packs/,
// presets/ or transitions/. A finding names the file, the line and the kind, never the value.
import { isScalar, visit } from 'yaml';

import type { Problem } from './problems';
import { YamlError, parseYaml } from './yaml-load';

const PRIVATE_KEY = /-----BEGIN [A-Z ]*PRIVATE KEY-----/g;

const TOKENS: { kind: string; pattern: RegExp }[] = [
  { kind: 'a GitHub token', pattern: /(?<![A-Za-z0-9_])gh[pousr]_[A-Za-z0-9]{36}(?![A-Za-z0-9])/g },
  { kind: 'a GitHub token', pattern: /(?<![A-Za-z0-9_])github_pat_[A-Za-z0-9_]{22,}/g },
  { kind: 'a GitLab token', pattern: /(?<![A-Za-z0-9_])glpat-[A-Za-z0-9_-]{20,}/g },
  { kind: 'a Slack token', pattern: /(?<![A-Za-z0-9_])xox[abpr]-[A-Za-z0-9-]{10,}/g },
  { kind: 'an npm token', pattern: /(?<![A-Za-z0-9_])npm_[A-Za-z0-9]{36}(?![A-Za-z0-9])/g },
  { kind: 'an AWS access key id', pattern: /(?<![A-Za-z0-9_])AKIA[0-9A-Z]{16}(?![A-Za-z0-9])/g },
  { kind: 'an API secret key', pattern: /(?<![A-Za-z0-9_-])sk-[A-Za-z0-9]{20,}/g },
];

const MIN_LENGTH = 32;
const BASE64 = /^[A-Za-z0-9+=_]+$/;
const HEX = /^[0-9a-fA-F]+$/;
const OBJECT_ID_LENGTHS = [40, 64];
/** Words that present a 40- or 64-character hex string as a reference on its line. */
const REFERENCE_WORDS = /\b(?:commit|commits|sha|sha1|sha256|digest|hash|checksum|object|revision)\b/i;

/** Shannon entropy in bits per character. */
export function entropy(text: string): number {
  const counts = new Map<string, number>();
  for (const char of text) counts.set(char, (counts.get(char) ?? 0) + 1);
  let bits = 0;
  for (const count of counts.values()) {
    const p = count / text.length;
    bits -= p * Math.log2(p);
  }
  return bits;
}

/**
 * A string of 32 or more characters with no `/`, `.` or `-`: base64 with an entropy of at least
 * 4.5 bits per character, a digit and both cases; or hex with an entropy of at least 3.0. A hex
 * string of 40 or 64 characters on a line that names it a commit, sha, digest or hash is a git
 * object id or a SHA-256 digest, not a secret; the same shape alone stays a finding, since some
 * tokens are 40 or 64 hex characters. A `sha256:` digest holds a `:`, so it is never one.
 */
export function looksLikeSecret(value: string, line = ''): boolean {
  if (value.length < MIN_LENGTH || /[/.-]/.test(value)) return false;
  if (HEX.test(value)) {
    const reference = OBJECT_ID_LENGTHS.includes(value.length) && REFERENCE_WORDS.test(line);
    return !reference && entropy(value) >= 3.0;
  }
  return BASE64.test(value) && /[0-9]/.test(value) && /[a-z]/.test(value) && /[A-Z]/.test(value)
    && entropy(value) >= 4.5;
}

function lineAt(text: string, offset: number): number {
  return text.slice(0, offset).split('\n').length;
}

/** The text of the line holding an offset. */
function lineTextAt(text: string, offset: number): string {
  const start = text.lastIndexOf('\n', offset - 1) + 1;
  const end = text.indexOf('\n', offset);
  return text.slice(start, end === -1 ? text.length : end);
}

function finding(file: string, line: number, kind: string): Problem {
  return { file, line, column: 1, rule: 'secret', message: `${file}: ${kind}; never commit `
    + 'credentials or secrets (security-secrets)' };
}

/** The high-entropy scalars of a YAML text, or undefined when it does not parse. */
function yamlStrings(text: string, file: string): { value: string; offset: number }[] | undefined {
  try {
    const yaml = parseYaml(text, file);
    const found: { value: string; offset: number }[] = [];
    visit(yaml.document, {
      Scalar(_key, node) {
        if (isScalar(node) && typeof node.value === 'string') {
          found.push({ value: node.value, offset: node.range?.[0] ?? 0 });
        }
      },
    });
    return found;
  } catch (error) {
    if (error instanceof YamlError) return undefined;
    throw error;
  }
}

/** Each whitespace-separated token, without the quotes and punctuation around it. */
function tokens(text: string): { value: string; offset: number }[] {
  return [...text.matchAll(/\S+/g)].map((match) => ({
    value: match[0].replace(/^["'`(<[{]+|["'`)>\]},;:.!?]+$/g, ''), offset: match.index,
  }));
}

/** Every secret finding of one file, its text as written (the lint and the composer alike). */
export function secretProblems(file: string, text: string): Problem[] {
  const problems: Problem[] = [];
  for (const match of text.matchAll(PRIVATE_KEY)) {
    problems.push(finding(file, lineAt(text, match.index), 'a private key block'));
  }
  for (const { kind, pattern } of TOKENS) {
    for (const match of text.matchAll(pattern)) {
      problems.push(finding(file, lineAt(text, match.index), kind));
    }
  }
  // A line already reported for a key or a token is not reported again for its entropy.
  const reported = new Set(problems.map((problem) => problem.line));
  const strings = (file.endsWith('.yaml') ? yamlStrings(text, file) : undefined) ?? tokens(text);
  for (const { value, offset } of strings) {
    if (looksLikeSecret(value, lineTextAt(text, offset)) && !reported.has(lineAt(text, offset))) {
      problems.push(finding(file, lineAt(text, offset), `a high-entropy string of ${value.length} `
        + 'characters'));
    }
  }
  return problems;
}
