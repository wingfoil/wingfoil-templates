// The Markdown subset the README rules read (task-018 acceptance 4), with no Markdown library: a
// line scanner that classifies every line once, then the headings, code, code spans and links
// found in it. Block quotes and list items are containers: headings inside them are kept with
// their container, so that the rules can count the top-level ones only.

export type Container = 'top' | 'quote' | 'list';
/** `comment` opens an HTML comment; `comment-body` continues it, up to its closing line. */
export type LineKind = 'blank' | 'fence' | 'code' | 'comment' | 'comment-body' | 'marker' | 'text';

export interface MarkdownLine {
  /** 1-based. */
  line: number;
  /** The raw line, without its line ending. */
  raw: string;
  kind: LineKind;
  container: Container;
}

export interface MarkdownHeading {
  level: number;
  text: string;
  /** The heading's first line; for a setext heading, its text line. */
  line: number;
  /** Its last line: the underline of a setext heading, else `line`. */
  endLine: number;
  setext: boolean;
  container: Container;
}

export interface MarkdownText {
  line: number;
  text: string;
}

export interface MarkdownLink {
  line: number;
  target: string;
}

export interface MarkdownScan {
  lines: MarkdownLine[];
  headings: MarkdownHeading[];
  /** Lines of fenced and indented code blocks, without their container prefixes. */
  codeLines: MarkdownText[];
  codeSpans: MarkdownText[];
  links: MarkdownLink[];
}

/** A generated-section marker line (spec-002 §2.2): whole, top level, unindented. */
export const MARKER = /^<!-- generated:(begin|end) (\S+) -->$/;

const QUOTE = /^ {0,3}> ?/;
const LIST_ITEM = /^( {0,3})([-*+]|\d{1,9}[.)])( +|$)/;
const THEMATIC_BREAK = /^ {0,3}([-*_])(?: *\1){2,} *$/;
const FENCE = /^ {0,3}(`{3,}|~{3,})(.*)$/;
const ATX = /^ {0,3}(#{1,6})(?:[ \t]+(.*?))?[ \t]*$/;
const SETEXT = /^ {0,3}(=+|-+)[ \t]*$/;
const DEFINITION = /^ {0,3}\[([^\]]+)\]:[ \t]*(<[^>]*>|\S+)/;

interface Fence {
  char: string;
  length: number;
  container: Container;
  /** The list content indent the fence was opened at, to strip from its lines. */
  indent: number;
}

interface Paragraph {
  lines: MarkdownText[];
  container: Container;
}

interface State {
  fence: Fence | undefined;
  /** The container of the open HTML comment, if any. */
  comment: Container | undefined;
  /** The content indent of the open list item, if any. */
  list: number | undefined;
  /** A blank line was seen inside the open list item. */
  listBlank: boolean;
  paragraph: Paragraph | undefined;
}

function indentOf(text: string): number {
  return text.length - text.trimStart().length;
}

function stripQuote(raw: string): string {
  let content = raw;
  while (QUOTE.test(content)) content = content.replace(QUOTE, '');
  return content;
}

/** A line that can continue an open paragraph lazily: one that starts no other block. */
function lazyLine(raw: string): boolean {
  return ![FENCE, ATX, LIST_ITEM, THEMATIC_BREAK, SETEXT, QUOTE].some((block) => block.test(raw))
    && !raw.trimStart().startsWith('<!--');
}

/** The container of a non-blank line and its content without the container's prefix. */
function containerOf(raw: string, state: State): { container: Container; content: string } {
  if (QUOTE.test(raw)) return { container: 'quote', content: stripQuote(raw) };
  if (state.list !== undefined) {
    if (indentOf(raw) >= state.list) return { container: 'list', content: raw.slice(state.list) };
    if (!state.listBlank && state.paragraph?.container === 'list' && lazyLine(raw)) {
      return { container: 'list', content: raw.trimStart() };
    }
  }
  if (state.paragraph?.container === 'quote' && lazyLine(raw)) {
    return { container: 'quote', content: raw.trimStart() };
  }
  const item = LIST_ITEM.exec(raw);
  if (item !== null && !THEMATIC_BREAK.test(raw)) {
    const marker = (item[1] ?? '').length + (item[2] ?? '').length;
    const spaces = (item[3] ?? '').length;
    state.list = marker + (spaces === 0 || spaces > 4 ? 1 : spaces);
    state.listBlank = false;
    state.paragraph = undefined;
    return { container: 'list', content: raw.slice(Math.min(raw.length, state.list)) };
  }
  state.list = undefined;
  return { container: 'top', content: raw };
}

function closesFence(content: string, fence: Fence): boolean {
  const match = FENCE.exec(content);
  if (match === null) return false;
  const run = match[1] ?? '';
  return run.startsWith(fence.char) && run.length >= fence.length && (match[2] ?? '').trim() === '';
}

/** A fence opened in a quote or a list item closes with its container (it takes no lazy line). */
function containerEnds(raw: string, fence: Fence): boolean {
  if (fence.container === 'quote') return !QUOTE.test(raw);
  return fence.container === 'list' && raw.trim() !== '' && indentOf(raw) < fence.indent;
}

function fenceContent(raw: string, fence: Fence): string {
  if (fence.container === 'quote') return stripQuote(raw);
  if (fence.container === 'list') return raw.slice(Math.min(indentOf(raw), fence.indent));
  return raw;
}

/** The text of an ATX heading: closing `#` sequence and surrounding whitespace removed. */
function atxText(rest: string): string {
  return rest.replace(/(^|[ \t])#+[ \t]*$/, '').trim();
}

class Scanner {
  readonly scan: MarkdownScan = { lines: [], headings: [], codeLines: [], codeSpans: [],
    links: [] };

  private readonly state: State = { fence: undefined, comment: undefined, list: undefined,
    listBlank: false, paragraph: undefined };

  /** Text lines and their content, for code spans and links once every line is classified. */
  private readonly texts: MarkdownText[] = [];

  private push(line: number, raw: string, kind: LineKind, container: Container): void {
    this.scan.lines.push({ line, raw, kind, container });
  }

  line(line: number, raw: string): void {
    const state = this.state;
    if (state.fence !== undefined && containerEnds(raw, state.fence)) {
      if (state.fence.container === 'list') state.list = undefined;
      state.fence = undefined;
    }
    if (state.fence !== undefined) {
      const fence = state.fence;
      const content = fenceContent(raw, fence);
      if (closesFence(content, fence)) {
        state.fence = undefined;
        this.push(line, raw, 'fence', fence.container);
      } else {
        this.push(line, raw, 'code', fence.container);
        this.scan.codeLines.push({ line, text: content });
      }
      return;
    }
    if (state.comment !== undefined) {
      this.push(line, raw, 'comment-body', state.comment);
      if (raw.includes('-->')) state.comment = undefined;
      return;
    }
    if (raw.trim() === '') {
      if (state.list !== undefined) state.listBlank = true;
      state.paragraph = undefined;
      this.push(line, raw, 'blank', state.list === undefined ? 'top' : 'list');
      return;
    }
    if (MARKER.test(raw)) {
      state.list = undefined;
      state.paragraph = undefined;
      this.push(line, raw, 'marker', 'top');
      return;
    }
    const { container, content } = containerOf(raw, state);
    if (container === 'list' && indentOf(raw) >= (state.list ?? 0)) state.listBlank = false;
    if (content.trim() === '') {
      state.paragraph = undefined;
      this.push(line, raw, 'blank', container);
      return;
    }
    this.block(line, raw, container, content);
  }

  private block(line: number, raw: string, container: Container, content: string): void {
    const state = this.state;
    const paragraph = state.paragraph?.container === container ? state.paragraph : undefined;
    if (indentOf(content) >= 4 && paragraph === undefined) {
      this.push(line, raw, 'code', container);
      this.scan.codeLines.push({ line, text: content.replace(/^ {4}/, '') });
      return;
    }
    const fence = FENCE.exec(content);
    if (fence !== null && !(fence[1]?.startsWith('`') === true && (fence[2] ?? '').includes('`'))) {
      const run = fence[1] ?? '';
      state.fence = { char: run.charAt(0), length: run.length, container,
        indent: container === 'list' ? (state.list ?? 0) : 0 };
      state.paragraph = undefined;
      this.push(line, raw, 'fence', container);
      return;
    }
    if (content.trimStart().startsWith('<!--')) {
      const rest = content.slice(content.indexOf('<!--') + 4);
      if (!rest.includes('-->')) state.comment = container;
      state.paragraph = undefined;
      this.push(line, raw, 'comment', container);
      return;
    }
    const setext = SETEXT.exec(content);
    if (setext !== null && paragraph !== undefined) {
      const first = paragraph.lines[0];
      if (first !== undefined) {
        this.scan.headings.push({ level: setext[1]?.startsWith('=') === true ? 1 : 2,
          text: paragraph.lines.map((part) => part.text.trim()).join(' '), line: first.line,
          endLine: line, setext: true, container });
      }
      state.paragraph = undefined;
      this.push(line, raw, 'text', container);
      return;
    }
    const atx = ATX.exec(content);
    if (atx !== null) {
      this.scan.headings.push({ level: (atx[1] ?? '').length, text: atxText(atx[2] ?? ''), line,
        endLine: line, setext: false, container });
      state.paragraph = undefined;
      this.push(line, raw, 'text', container);
      this.texts.push({ line, text: content });
      return;
    }
    if (THEMATIC_BREAK.test(content)) {
      state.paragraph = undefined;
      this.push(line, raw, 'text', container);
      return;
    }
    if (paragraph === undefined) state.paragraph = { lines: [], container };
    state.paragraph?.lines.push({ line, text: content });
    this.push(line, raw, 'text', container);
    this.texts.push({ line, text: content });
  }

  finish(): MarkdownScan {
    const definitions = new Map<string, string>();
    for (const text of this.texts) {
      const definition = DEFINITION.exec(text.text);
      if (definition !== null) {
        definitions.set(label(definition[1] ?? ''), unwrap(definition[2] ?? ''));
      }
    }
    for (const text of this.texts) {
      const { spans, rest } = codeSpans(text.text);
      for (const span of spans) this.scan.codeSpans.push({ line: text.line, text: span });
      if (DEFINITION.test(text.text)) continue;
      for (const target of linkTargets(rest, definitions)) {
        this.scan.links.push({ line: text.line, target });
      }
    }
    return this.scan;
  }
}

function label(text: string): string {
  return text.trim().replace(/\s+/g, ' ').toLowerCase();
}

function unwrap(target: string): string {
  return target.startsWith('<') && target.endsWith('>') ? target.slice(1, -1) : target;
}

/** The code spans of a line, and the line with each span blanked out. */
function codeSpans(text: string): { spans: string[]; rest: string } {
  const spans: string[] = [];
  let rest = text;
  const runs = [...text.matchAll(/`+/g)];
  for (let i = 0; i < runs.length; i += 1) {
    const open = runs[i];
    if (open === undefined) continue;
    const closeAt = runs.findIndex((run, j) => j > i && run[0] === open[0]);
    const close = runs[closeAt];
    if (close === undefined) continue;
    const start = open.index + open[0].length;
    let span = text.slice(start, close.index);
    if (span.length > 1 && span.startsWith(' ') && span.endsWith(' ') && span.trim() !== '') {
      span = span.slice(1, -1);
    }
    spans.push(span);
    rest = rest.slice(0, open.index) + ' '.repeat(close.index + close[0].length - open.index)
      + rest.slice(close.index + close[0].length);
    i = closeAt;
  }
  return { spans, rest };
}

const INLINE = /\[(?:[^[\]]|\[[^[\]]*\])*\]\([ \t]*(<[^>]*>|(?:[^\s()]|\([^\s()]*\))+)(?:[ \t]+(?:"[^"]*"|'[^']*'|\([^)]*\)))?[ \t]*\)/g;
const AUTOLINK = /<([A-Za-z][A-Za-z0-9+.-]{1,31}:[^\s<>]*)>/g;
const REFERENCE = /\[([^\]]+)\](?:\[([^\]]*)\])?(?![(:[])/g;

/** Link targets in reading order: inline links, autolinks and resolved reference links. */
function linkTargets(text: string, definitions: Map<string, string>): string[] {
  const found: { at: number; target: string }[] = [];
  let rest = text;
  for (const match of text.matchAll(INLINE)) {
    found.push({ at: match.index, target: unwrap(match[1] ?? '') });
    rest = rest.slice(0, match.index) + ' '.repeat(match[0].length)
      + rest.slice(match.index + match[0].length);
  }
  for (const match of rest.matchAll(AUTOLINK)) {
    found.push({ at: match.index, target: match[1] ?? '' });
  }
  for (const match of rest.matchAll(REFERENCE)) {
    const name = match[2] === undefined || match[2] === '' ? match[1] : match[2];
    const target = definitions.get(label(name ?? ''));
    if (target !== undefined) found.push({ at: match.index, target });
  }
  return found.sort((a, b) => a.at - b.at).map((entry) => entry.target);
}

export function scanMarkdown(text: string): MarkdownScan {
  const scanner = new Scanner();
  const lines = text.split('\n');
  if (lines[lines.length - 1] === '') lines.pop();
  lines.forEach((raw, index) => scanner.line(index + 1, raw.replace(/\r$/, '')));
  return scanner.finish();
}
