// The checks of governance/feedback's upstream channels (spec-003 §5.1, §5.2, §11): a directive
// tagged `feedback-channel` comes from a pack that requires governance/feedback and states the one
// target it serves; no composition holds two channels serving one target. The pack id and the tag
// are that pack's (spec-003 §10.1): this module holds them, and nothing else in src/ names them.
import { readFrontmatter } from './frontmatter';
import type { Problem } from './problems';
import { YamlError } from './yaml-load';
import type { LoadedYaml } from './yaml-load';

export const FEEDBACK_PACK = 'governance/feedback';
export const CHANNEL_TAG = 'feedback-channel';
/** The per-composition rule id, as the lint and `validate` report it. */
export const CHANNEL_TARGET_RULE = 'feedback-channel-target';

/** The line a channel states its target on, exactly (spec-003 §5.1). */
const SERVES = /^Serves the target `upstream:([a-z0-9-]+)`\.$/;

/** A directive file, as the lint and the composer have it. */
export interface DirectiveFile {
  /** Relative to the pack. */
  path: string;
  /** Relative to the tree, or the label to report. */
  file: string;
  text: string;
  yaml?: LoadedYaml;
}

/**
 * The targets a directive's body states, one per line matching exactly; a line in the frontmatter
 * or in a fenced code block states none.
 */
export function servedTargets(text: string): string[] {
  const lines = text.replace(/^\uFEFF/, '').replace(/\r\n?/g, '\n').split('\n');
  const close = lines[0] === '---' ? lines.indexOf('---', 1) : -1;
  /** The open fence's run (its character, at least its length), or undefined. */
  let fence: string | undefined;
  const targets: string[] = [];
  for (const line of lines.slice(close + 1)) {
    const run = /^ {0,3}(`{3,}|~{3,})(.*)$/.exec(line);
    // A backtick fence's info string holds no backtick (CommonMark): such a line is text.
    if (run !== null && !(run[1]?.startsWith('`') === true && (run[2] ?? '').includes('`'))) {
      const [, marks = '', info = ''] = run;
      if (fence === undefined) {
        fence = marks;
        continue;
      }
      if (marks[0] === fence[0] && marks.length >= fence.length && info.trim() === '') {
        fence = undefined;
        continue;
      }
    }
    const match = fence !== undefined ? null : SERVES.exec(line);
    if (match !== null) targets.push(`upstream:${match[1] ?? ''}`);
  }
  return targets;
}

function frontmatterOf(file: DirectiveFile): LoadedYaml | undefined {
  if (file.yaml !== undefined) return file.yaml;
  try {
    return readFrontmatter(file.text, file.file);
  } catch (error) {
    if (error instanceof YamlError) return undefined;
    throw error;
  }
}

/** Whether a file is a directive tagged `feedback-channel`. */
export function isChannel(file: DirectiveFile): boolean {
  if (!file.path.startsWith('directives/') || !file.path.endsWith('.md')) return false;
  const data = frontmatterOf(file)?.data;
  if (typeof data !== 'object' || data === null || Array.isArray(data)) return false;
  const tags = (data as Record<string, unknown>)['tags'];
  return Array.isArray(tags) && tags.includes(CHANNEL_TAG);
}

/** The per-pack rule `feedback-channel` on one pack's files (spec-003 §5.1, §5.2). */
export function channelProblems(pack: { id: string; requiredIds: string[] },
  files: DirectiveFile[]): Problem[] {
  const problems: Problem[] = [];
  for (const file of files.filter(isChannel)) {
    if (!pack.requiredIds.includes(FEEDBACK_PACK)) {
      problems.push({ file: file.file, rule: 'feedback-channel', message: `${file.file}: a `
        + `${CHANNEL_TAG} directive comes from a pack that requires ${FEEDBACK_PACK}; ${pack.id} `
        + 'does not (spec-003 §5.2)' });
    }
    const targets = servedTargets(file.text);
    if (targets.length !== 1) {
      problems.push({ file: file.file, rule: 'feedback-channel', message: `${file.file}: a `
        + `${CHANNEL_TAG} directive holds exactly one line `
        + `"Serves the target \`upstream:<name>\`."; it holds ${String(targets.length)} `
        + '(spec-003 §5.1)' });
    }
  }
  return problems;
}

/**
 * The per-composition rule (CHANNEL_TARGET_RULE): each target two or more channel directives of
 * one composition serve, as one message naming the target and the directives (spec-003 §5.2).
 */
export function channelConflicts(files: DirectiveFile[]): string[] {
  const byTarget = new Map<string, string[]>();
  for (const file of files.filter(isChannel)) {
    for (const target of new Set(servedTargets(file.text))) {
      byTarget.set(target, [...(byTarget.get(target) ?? []), file.file]);
    }
  }
  return [...byTarget].filter(([, serving]) => serving.length > 1)
    .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
    .map(([target, serving]) => `${String(serving.length)} ${CHANNEL_TAG} directives serve `
      + `${target}: ${serving.sort().join(', ')} (spec-003 §5.2)`);
}
