// task-102 (plan-081, dl-046): `npm run check:texts`, the 100-character rule on the lines a diff
// adds to Markdown. Each test builds a throw-away git repository under the system's temporary
// directory.
import { strict as assert } from 'node:assert';
import { spawnSync } from 'node:child_process';
import { join } from 'node:path';
import { describe, it } from 'node:test';

import { checkTexts } from '../src/check-texts';
import { TestRepo, withRepo } from './support/git-repo';
import { REPO_ROOT } from './support/paths';

const CLI = join(REPO_ROOT, 'dist', 'src', 'check-texts-cli.js');
const ZEROS = '0'.repeat(40);

/** A line of `n` code points. */
function long(n: number, char = 'a'): string {
  return char.repeat(n);
}

function breach(path: string, line: number, length: number): string {
  return `${path}:${line}: ${length} characters (at most 100, dl-046)`;
}

function total(n: number): string {
  return `check:texts: ${n} lines over 100 characters`;
}

/** Commits `files` on top of HEAD and returns the commit. */
function commit(repo: TestRepo, files: Record<string, string>, message = 'change'): string {
  for (const [path, content] of Object.entries(files)) repo.write(path, content);
  return repo.commitAll(message);
}

/** The result of the lines one commit adds on top of a base commit, read with `--range`. */
function added(base: Record<string, string>, change: Record<string, string>):
ReturnType<typeof checkTexts> {
  let result: ReturnType<typeof checkTexts> | undefined;
  withRepo((repo) => {
    const a = commit(repo, base, 'base');
    const b = commit(repo, change);
    result = checkTexts(repo.dir, ['--range', `${a}..${b}`]);
  });
  assert.ok(result !== undefined);
  return result;
}

function assertPasses(result: ReturnType<typeof checkTexts>): void {
  assert.deepEqual(result, { code: 0, out: [], err: [] });
}

function assertBreaches(result: ReturnType<typeof checkTexts>, lines: string[]): void {
  assert.deepEqual(result, { code: 1, out: [...lines, total(lines.length)], err: [] });
}

describe('check:texts, the modes (task-102 criterion 1)', () => {
  it('reads the staged diff and the files from the index, whatever the working tree holds', () => {
    withRepo((repo) => {
      commit(repo, { 'README.md': 'short\n' }, 'base');
      repo.write('README.md', `short\n${long(101)}\n`);
      repo.git(['add', 'README.md']);
      repo.write('README.md', 'short\n');
      assertBreaches(checkTexts(repo.dir, []), [breach('README.md', 2, 101)]);
      repo.git(['add', 'README.md']);
      repo.write('README.md', `short\n${long(120)}\n`);
      assertPasses(checkTexts(repo.dir, []));
    });
  });

  it('reads --base from the merge base of the ref and HEAD to HEAD', () => {
    withRepo((repo) => {
      commit(repo, { 'a.md': 'short\n' }, 'base');
      repo.git(['checkout', '--quiet', '-b', 'feature']);
      commit(repo, { 'a.md': `short\n${long(101)}\n` });
      repo.git(['checkout', '--quiet', 'main']);
      commit(repo, { 'b.md': `${long(130)}\n` }, 'main moves on');
      repo.git(['checkout', '--quiet', 'feature']);
      assertBreaches(checkTexts(repo.dir, ['--base', 'main']), [breach('a.md', 2, 101)]);
    });
  });

  it('reads --range from <a> to <b>, the files from <b>', () => {
    withRepo((repo) => {
      commit(repo, { 'a.md': 'short\n' }, 'base');
      const a = commit(repo, { 'a.md': `short\n${long(101)}\n` });
      const b = commit(repo, { 'b.md': `${long(102)}\n` });
      commit(repo, { 'c.md': `${long(103)}\n` }, 'after the range');
      assertBreaches(checkTexts(repo.dir, ['--range', `${a}..${b}`]), [breach('b.md', 1, 102)]);
    });
  });

  const usage: [string, string[]][] = [
    ['an unknown argument', ['--all']],
    ['a mode without its value', ['--base']],
    ['two modes at once', ['--base', 'main', '--range', 'main..main']],
    ['a range with three dots', ['--range', 'main...main']],
    ['a range without two dots', ['--range', 'main']],
    ['a ref git cannot resolve', ['--base', 'nowhere']],
    ['a range end git cannot resolve', ['--range', 'main..nowhere']],
    ['an <a> of forty zeros', ['--range', `${ZEROS}..main`]],
  ];
  for (const [what, args] of usage) {
    it(`exits 2 with one line on standard error on ${what}`, () => {
      withRepo((repo) => {
        commit(repo, { 'a.md': `${long(101)}\n` }, 'base');
        const result = checkTexts(repo.dir, args);
        assert.equal(result.code, 2);
        assert.deepEqual(result.out, []);
        assert.equal(result.err.length, 1, result.err.join('\n'));
      });
    });
  }

  it('exits 2 with git\'s message when git fails', () => {
    withRepo((repo) => {
      const result = checkTexts(join(repo.home, 'not-a-repository'), []);
      assert.equal(result.code, 2);
      assert.deepEqual(result.out, []);
      assert.equal(result.err.length, 1);
      assert.match(result.err[0] ?? '', /git/);
    });
  });
});

describe('check:texts, what counts (task-102 criterion 2, dl-046 P1)', () => {
  it('passes a line of 100 code points and reports one of 101', () => {
    assertPasses(added({ 'a.md': 'x\n' }, { 'a.md': `x\n${long(100)}\n` }));
    assertBreaches(added({ 'a.md': 'x\n' }, { 'a.md': `x\n${long(101)}\n` }),
      [breach('a.md', 2, 101)]);
  });

  it('counts code points, not bytes or UTF-16 units', () => {
    assertPasses(added({ 'a.md': 'x\n' }, { 'a.md': `${long(100, 'é')}\n${long(100, '😀')}\n` }));
    assertBreaches(added({ 'a.md': 'x\n' }, { 'a.md': `${long(101, '😀')}\n` }),
      [breach('a.md', 1, 101)]);
  });

  it('reads Markdown files only', () => {
    assertPasses(added({ 'a.txt': 'x\n' }, { 'a.txt': `${long(150)}\n`, 'b.yaml': `${long(150)}\n`,
      'c.md.txt': `${long(150)}\n` }));
  });

  it('passes a long line already in the file that the diff does not add', () => {
    assertPasses(added({ 'a.md': `${long(150)}\nshort\n` }, { 'a.md': `${long(150)}\nshort\nmore\n` }));
  });

  it('reads every line of a new file and none of a deleted one', () => {
    assertBreaches(added({ 'a.md': 'x\n' }, { 'new.md': `${long(101)}\nshort\n${long(102)}\n` }),
      [breach('new.md', 1, 101), breach('new.md', 3, 102)]);
    withRepo((repo) => {
      const a = commit(repo, { 'a.md': `${long(150)}\n`, 'b.md': 'x\n' }, 'base');
      repo.git(['rm', '--quiet', 'a.md']);
      const b = repo.commitIndex('delete');
      assertPasses(checkTexts(repo.dir, ['--range', `${a}..${b}`]));
    });
  });

  it('reads only the lines a rename adds, at their numbers in the new file', () => {
    const body = ['# Title', long(150), ...Array.from({ length: 20 }, (_, i) => `line ${i}`)];
    withRepo((repo) => {
      const a = commit(repo, { 'old.md': `${body.join('\n')}\n` }, 'base');
      repo.git(['mv', 'old.md', 'new.md']);
      repo.write('new.md', `${[...body, 'one more'].join('\n')}\n`);
      const b = repo.commitAll('rename');
      assertPasses(checkTexts(repo.dir, ['--range', `${a}..${b}`]));
      repo.write('new.md', `${[...body, 'one more', long(101)].join('\n')}\n`);
      const c = repo.commitAll('a long line');
      assertBreaches(checkTexts(repo.dir, ['--range', `${a}..${c}`]),
        [breach('new.md', body.length + 2, 101)]);
    });
  });

  it('counts a line without its CRLF ending', () => {
    withRepo((repo) => {
      commit(repo, { 'a.md': 'x\n' }, 'base');
      repo.addBlob('a.md', Buffer.from(`x\r\n${long(100)}\r\n${long(101)}\r\n`));
      assertBreaches(checkTexts(repo.dir, []), [breach('a.md', 3, 101)]);
    });
  });

  it('reads a last line without a trailing newline', () => {
    assertPasses(added({ 'a.md': 'x\n' }, { 'a.md': `x\n${long(100)}` }));
    assertBreaches(added({ 'a.md': 'x\n' }, { 'a.md': `x\n${long(101)}` }),
      [breach('a.md', 2, 101)]);
  });

  it('reports the path git quotes, unquoted', () => {
    assertBreaches(added({ 'a.md': 'x\n' }, { 'dir with space/è "q".md': `${long(101)}\n` }),
      [breach('dir with space/è "q".md', 1, 101)]);
  });
});

describe('check:texts, the exemptions (task-102 criterion 2)', () => {
  it('exempts the frontmatter, first line `---` to the next `---`, both included', () => {
    assertPasses(added({ 'a.md': 'x\n' },
      { 'a.md': `---\ntitle: "${long(120)}"\n---\n\nbody\n` }));
  });

  it('opens no frontmatter with a `---` below line 1', () => {
    assertBreaches(added({ 'a.md': 'x\n' }, { 'a.md': `text\n---\n${long(101)}\n---\n` }),
      [breach('a.md', 3, 101)]);
  });

  it('blanks the frontmatter before it reads the fences', () => {
    assertBreaches(added({ 'a.md': 'x\n' }, { 'a.md': `---\nx: 1\n\`\`\`\n---\n${long(101)}\n` }),
      [breach('a.md', 5, 101)]);
  });

  it('exempts a table row, inside a block quote too, and not a table without a leading pipe', () => {
    assertBreaches(added({ 'a.md': 'x\n' }, { 'a.md': [`| ${long(120)} |`, `  | ${long(120)} |`,
      `> | ${long(120)} |`, `> > | ${long(120)} |`, `a | ${long(120)}`, ''].join('\n') }),
    [breach('a.md', 5, 124)]);
  });

  it('exempts a link reference line', () => {
    assertPasses(added({ 'a.md': 'x\n' }, { 'a.md': [`[one]: https://example.invalid/${long(100)}`,
      `   [two]: <https://example.invalid/${long(100)}>`, ''].join('\n') }));
    assertBreaches(added({ 'a.md': 'x\n' },
      { 'a.md': `    [four]: https://example.invalid/${long(100)}\n` }),
    [breach('a.md', 1, 136)]);
  });

  it('exempts fence lines and the code between them, backticks and tildes', () => {
    assertPasses(added({ 'a.md': 'x\n' }, { 'a.md': [`\`\`\`bash ${long(100)}`, long(150),
      '```', `~~~~ ${long(100)}`, long(150), '~~~~', ''].join('\n') }));
  });

  it('reads a fence opened above the hunk', () => {
    const open = ['# Title', '', '```', 'code', ...Array.from({ length: 10 }, (_, i) => `c${i}`)];
    assertPasses(added({ 'a.md': `${open.join('\n')}\n` },
      { 'a.md': `${[...open, long(150)].join('\n')}\n` }));
  });

  it('does not exempt an indented code block', () => {
    assertBreaches(added({ 'a.md': 'x\n' }, { 'a.md': `text\n\n    ${long(100)}\n` }),
      [breach('a.md', 3, 104)]);
  });

  it('counts a line after a closed fence', () => {
    assertBreaches(added({ 'a.md': 'x\n' }, { 'a.md': `\`\`\`\ncode\n\`\`\`\n${long(101)}\n` }),
      [breach('a.md', 4, 101)]);
  });

  it('exempts a generated region, its markers included', () => {
    assertBreaches(added({ 'a.md': 'x\n' }, { 'a.md': ['<!-- generated:begin pack-list -->',
      long(150), '<!-- generated:end pack-list -->', long(101), ''].join('\n') }),
    [breach('a.md', 4, 101)]);
  });

  it('runs an unmatched generated:begin to the end of the file', () => {
    assertPasses(added({ 'a.md': 'x\n' }, { 'a.md': ['<!-- generated:begin one -->', long(150),
      '<!-- generated:end other -->', long(150), ''].join('\n') }));
  });

  it('exempts the files under tests/fixtures/ and CATALOG.md at the root, nothing else', () => {
    assertBreaches(added({ 'a.md': 'x\n' }, { 'tests/fixtures/x/a.md': `${long(150)}\n`,
      'CATALOG.md': `${long(150)}\n`, 'docs/CATALOG.md': `${long(101)}\n`,
      'tests/fixtures.md': `${long(102)}\n` }),
    [breach('docs/CATALOG.md', 1, 101), breach('tests/fixtures.md', 1, 102)]);
  });
});

describe('check:texts, the report (task-102 criterion 3)', () => {
  it('sorts the breaches by path, then by line number', () => {
    const lines = Array.from({ length: 12 }, (_, i) => (i === 1 || i === 9 ? long(101) : `l${i}`));
    assertBreaches(added({ 'a.md': 'x\n' }, { 'b.md': `${lines.join('\n')}\n`,
      'a.md': `x\n${long(105)}\n` }),
    [breach('a.md', 2, 105), breach('b.md', 2, 101), breach('b.md', 10, 101)]);
  });

  it('runs as npm run check:texts does, on the working directory', () => {
    withRepo((repo) => {
      commit(repo, { 'a.md': 'x\n' }, 'base');
      repo.write('a.md', `x\n${long(101)}\n`);
      repo.git(['add', 'a.md']);
      const run = spawnSync(process.execPath, [CLI], { cwd: repo.dir, encoding: 'utf8',
        env: repo.env });
      assert.equal(run.status, 1, run.stderr);
      assert.equal(run.stdout, `${breach('a.md', 2, 101)}\n${total(1)}\n`);
      const usage = spawnSync(process.execPath, [CLI, '--all'], { cwd: repo.dir,
        encoding: 'utf8', env: repo.env });
      assert.equal(usage.status, 2);
      assert.equal(usage.stdout, '');
      assert.equal(usage.stderr.trim().split('\n').length, 1);
    });
  });
});
