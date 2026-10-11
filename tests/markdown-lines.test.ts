import { strict as assert } from 'node:assert';
import { describe, it } from 'node:test';

import { scanMarkdown } from '../src/markdown-lines';

/** The top-level headings as `<level> <text> @<line>`. */
function headings(text: string): string[] {
  return scanMarkdown(text).headings.filter((heading) => heading.container === 'top')
    .map((heading) => `${heading.level} ${heading.text} @${heading.line}`);
}

function codeLines(text: string): string[] {
  return scanMarkdown(text).codeLines.map((code) => `${code.line}:${code.text}`);
}

function spans(text: string): string[] {
  return scanMarkdown(text).codeSpans.map((code) => `${code.line}:${code.text}`);
}

function links(text: string): string[] {
  return scanMarkdown(text).links.map((link) => `${link.line}:${link.target}`);
}

describe('scanMarkdown (task-018 acceptance 4)', () => {
  it('reads ATX headings with up to three spaces, a closing sequence and trailing spaces', () => {
    assert.deepEqual(headings('# One\n\n   ## Two ##  \n\n## Three #\n###### Six\n'),
      ['1 One @1', '2 Two @3', '2 Three @5', '6 Six @6']);
  });

  it('does not read `#x`, an empty text is empty', () => {
    assert.deepEqual(headings('#x\n\n#\n'), ['1  @3']);
  });

  it('reads setext headings after a paragraph', () => {
    assert.deepEqual(headings('Title\n=====\n\nSub\n---\n'), ['1 Title @1', '2 Sub @4']);
  });

  it('reads `---` after a blank line as a thematic break', () => {
    assert.deepEqual(headings('Para\n\n---\n'), []);
  });

  it('does not take an underline as a lazy line of a list item or a quote', () => {
    assert.deepEqual(scanMarkdown('- a\n---\n').headings, []);
    assert.deepEqual(scanMarkdown('> para\ncontinued\n---\n').headings, []);
  });

  it('reads a four-space line after a blank line as code', () => {
    assert.deepEqual(codeLines('Para\n\n    # code\n'), ['3:# code']);
  });

  it('reads a four-space line after a paragraph line as text', () => {
    const text = 'Para\n    # not code, not a heading\n';
    assert.deepEqual(headings(text), []);
    assert.deepEqual(codeLines(text), []);
  });

  it('reads a four-space line after a heading, a closed fence or a break as code', () => {
    assert.deepEqual(codeLines('### Run\n    a\n'), ['2:a']);
    assert.deepEqual(codeLines('```\n```\n    b\n'), ['3:b']);
    assert.deepEqual(codeLines('***\n    c\n'), ['2:c']);
  });

  it('does not count headings in block quotes as top level', () => {
    assert.deepEqual(scanMarkdown('> ## Quoted\n').headings.map((heading) => heading.container),
      ['quote']);
  });

  it('does not count headings in list items as top level', () => {
    assert.deepEqual(scanMarkdown('- ## Listed\n').headings.map((heading) => heading.container),
      ['list']);
  });

  it('continues a list item on indented lines and on lazy lines', () => {
    const scan = scanMarkdown('- a\n  b\nlazy\n');
    assert.deepEqual(scan.lines.map((line) => line.container), ['list', 'list', 'list']);
  });

  it('ends a list item at a blank line followed by an unindented line', () => {
    const scan = scanMarkdown('- a\n\n## Top\n');
    assert.deepEqual(scan.headings.map((heading) => `${heading.container} ${heading.text}`),
      ['top Top']);
  });

  it('does not take a comment line as a lazy line of a list item', () => {
    const scan = scanMarkdown('- a\n<!--generated:begin x-->\n');
    assert.equal(scan.lines[1]?.container, 'top');
  });

  it('closes a fence only on the same character, at least as long, or at the end', () => {
    const text = '````\n# in\n```\n~~~~\n````\n# out\n~~~\n# never closed\n';
    assert.deepEqual(headings(text), ['1 out @6']);
    assert.deepEqual(codeLines(text), ['2:# in', '3:```', '4:~~~~', '8:# never closed']);
  });

  it('closes a fence opened in a quote when the quote ends', () => {
    const text = '> ```\n> x\n\n## After\n';
    assert.deepEqual(headings(text), ['2 After @4']);
    assert.deepEqual(codeLines(text), ['2:x']);
  });

  it('closes a fence opened in a list item when the item ends', () => {
    const text = '- a\n\n  ```\n  x\n\n## After\n';
    assert.deepEqual(headings(text), ['2 After @6']);
    // The blank line belongs to the fence while the item may still continue.
    assert.deepEqual(codeLines(text), ['4:x', '5:']);
  });

  it('hides headings in a multi-line HTML comment', () => {
    const scan = scanMarkdown('<!-- a\n# hidden\n-->\n# Seen\n');
    assert.deepEqual(scan.headings.map((heading) => heading.text), ['Seen']);
    assert.deepEqual(scan.lines.map((line) => line.kind),
      ['comment', 'comment-body', 'comment-body', 'text']);
  });

  it('opens no comment on a marker line', () => {
    assert.deepEqual(headings('<!-- generated:begin title -->\n# Seen\n'), ['1 Seen @2']);
  });

  it('finds fenced code lines inside block quotes, without their prefixes', () => {
    assert.deepEqual(codeLines('> ```\n> $ wingfoil init\n> ```\n'), ['2:$ wingfoil init']);
  });

  it('finds indented code in a quote after a bare `>` line', () => {
    assert.deepEqual(codeLines('> Run:\n>\n>     wingfoil compose x\n'),
      ['3:wingfoil compose x']);
  });

  it('finds indented code inside list items, without the item indent', () => {
    assert.deepEqual(codeLines('- step\n\n      run it\n'), ['3:run it']);
  });

  it('finds code spans of any backtick length, on one line, outside code blocks', () => {
    assert.deepEqual(spans('a `one` b ``two ` x`` c `open\n```\n`no`\n```\n- `listed`\n'),
      ['1:one', '1:two ` x', '5:listed']);
  });

  it('finds inline links, with a title, nested brackets or parentheses in the target', () => {
    assert.deepEqual(links('[a](CHANGELOG.md) [b](<./x.md> "title")\n'
      + '[a [b] c](CATALOG.md) [d](https://x/(y)/CATALOG.md)\n'),
    ['1:CHANGELOG.md', '1:./x.md', '2:CATALOG.md', '2:https://x/(y)/CATALOG.md']);
  });

  it('finds autolinks', () => {
    assert.deepEqual(links('See <https://example.org/y>.\n'), ['1:https://example.org/y']);
  });

  it('finds reference links through their definitions, at any depth', () => {
    assert.deepEqual(links('- [c][ref] and [ref]\n> [d][Ref]\n\n[ref]: https://example.org/r "T"\n'),
      ['1:https://example.org/r', '1:https://example.org/r', '2:https://example.org/r']);
  });

  it('finds no link in code spans, code blocks or comments', () => {
    assert.deepEqual(links('`[e](no.md)`\n```\n[f](no.md)\n```\n<!-- [g](no.md) -->\n'), []);
  });

  it('reads CRLF line endings as LF', () => {
    assert.deepEqual(headings('# One\r\n\r\n## Two\r\n'), ['1 One @1', '2 Two @3']);
  });

  it('gives each heading the line after which its section starts', () => {
    const scan = scanMarkdown('Title\n===\nbody\n## ATX\n');
    assert.deepEqual(scan.headings.map((heading) => [heading.line, heading.endLine]),
      [[1, 2], [4, 4]]);
  });
});
