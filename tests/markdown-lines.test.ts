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

  it('reads setext headings after a paragraph, and `---` after a blank line as a break', () => {
    assert.deepEqual(headings('Title\n=====\n\nSub\n---\n\n---\n'),
      ['1 Title @1', '2 Sub @4']);
  });

  it('reads a four-space line after a blank line as code, after a paragraph as text', () => {
    const text = 'Para\n    # not code, not a heading\n\n    # code\n';
    assert.deepEqual(headings(text), []);
    assert.deepEqual(codeLines(text), ['4:# code']);
  });

  it('does not count headings in block quotes or list items as top level', () => {
    const scan = scanMarkdown('> ## Quoted\n\n- ## Listed\n  continued\n\n## Top\n');
    assert.deepEqual(scan.headings.map((heading) => `${heading.container} ${heading.text}`),
      ['quote Quoted', 'list Listed', 'top Top']);
  });

  it('closes a fence only on the same character, at least as long, or at the end', () => {
    const text = '````\n# in\n```\n~~~~\n````\n# out\n~~~\n# never closed\n';
    assert.deepEqual(headings(text), ['1 out @6']);
    assert.deepEqual(codeLines(text), ['2:# in', '3:```', '4:~~~~', '8:# never closed']);
  });

  it('hides headings in a multi-line HTML comment, but a marker line opens no comment', () => {
    assert.deepEqual(headings('<!-- a\n# hidden\n-->\n<!-- generated:begin title -->\n# Seen\n'),
      ['1 Seen @5']);
  });

  it('finds code lines inside block quotes and list items, without their prefixes', () => {
    assert.deepEqual(codeLines('> ```\n> $ wingfoil init\n> ```\n\n- step\n\n      run it\n'),
      ['2:$ wingfoil init', '7:run it']);
  });

  it('finds code spans of any backtick length, on one line, outside code blocks', () => {
    assert.deepEqual(spans('a `one` b ``two ` x`` c `open\n```\n`no`\n```\n- `listed`\n'),
      ['1:one', '1:two ` x', '5:listed']);
  });

  it('finds inline links, autolinks and reference links, at any depth, outside code', () => {
    const text = [
      '[a](CHANGELOG.md) [b](<./x.md> "title") <https://example.org/y>',
      '- [c][ref] and [ref]',
      '> [d](z.md)',
      '`[e](no.md)`',
      '```',
      '[f](no.md)',
      '```',
      '<!-- [g](no.md) -->',
      '',
      '[ref]: https://example.org/ref "T"',
      '',
    ].join('\n');
    assert.deepEqual(links(text), ['1:CHANGELOG.md', '1:./x.md', '1:https://example.org/y',
      '2:https://example.org/ref', '2:https://example.org/ref', '3:z.md']);
  });

  it('gives each heading the line after which its section starts', () => {
    const scan = scanMarkdown('Title\n===\nbody\n## ATX\n');
    assert.deepEqual(scan.headings.map((heading) => [heading.line, heading.endLine]),
      [[1, 2], [4, 4]]);
  });
});
