import { strict as assert } from 'node:assert';
import { appendFileSync, cpSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { after, describe, it } from 'node:test';

import { runCheckPacks } from '../src/check-packs';
import { runFeedbackNote } from '../src/feedback-note';
import { runPublish } from '../src/publish';
import { schemaListing } from '../src/schema-digest';
import type { TestRepo } from './support/git-repo';
import { assertInbox, notesOf } from './support/inbox';
import { BASE_COMPOSABLE, KANBAN } from './support/pack-tree';
import { REPO_ROOT } from './support/paths';
import { STUB_RELEASE, treeRepo } from './support/published-repo';
import { StubWingfoil } from './support/stub-wingfoil';

const INBOX = join('docs', 'wingfoil-feedback');

/** This repository's inbox, schemas and package.json, copied into a tree. */
function addRepositoryFiles(tree: string): void {
  cpSync(join(REPO_ROOT, INBOX), join(tree, INBOX), { recursive: true });
  cpSync(join(REPO_ROOT, 'schema'), join(tree, 'schema'), { recursive: true });
  cpSync(join(REPO_ROOT, 'package.json'), join(tree, 'package.json'));
}

function withTree(body: (tree: string) => void): void {
  const tree = mkdtempSync(join(tmpdir(), 'feedback-note-'));
  try {
    addRepositoryFiles(tree);
    cpSync(join(REPO_ROOT, 'catalog.yaml'), join(tree, 'catalog.yaml'));
    body(tree);
  } finally {
    rmSync(tree, { recursive: true, force: true });
  }
}

/** The number the tool gives the next note of this repository's inbox, which the tests copy:
 *  the highest number plus one (bug-002). */
const NEXT = `F-${String(Math.max(0, ...notesOf(join(REPO_ROOT, INBOX))
  .map((note) => Number(note.file.slice(2, 5)))) + 1).padStart(3, '0')}`;

const last = (tree: string): { file: string; body: string; title: string } => {
  const notes = notesOf(join(tree, INBOX));
  const note = notes[notes.length - 1];
  assert.ok(note !== undefined);
  return { file: note.file, body: note.body, title: String(note.fields['title']) };
};

describe('npm run feedback:note -- --schema (wingfoil-cli rule 8)', () => {
  it('writes nothing while schema/ is as F-017 records it (the baseline)', () => {
    withTree((tree) => {
      const result = runFeedbackNote(['--schema', '--from', 'task-015', '--tree', tree]);
      assert.equal(result.code, 0, result.lines.join('\n'));
      assert.match(result.lines.join('\n'), /no note written/);
      assert.equal(runCheckPacks(tree).code, 0, runCheckPacks(tree).lines.join('\n'));
    });
  });

  it('a schema change fails the lint until its note is written, which lists what changed', () => {
    withTree((tree) => {
      appendFileSync(join(tree, 'schema', 'pack.schema.json'), '\n');
      const lint = runCheckPacks(tree);
      assert.deepEqual(lint.problems.map((problem) => problem.rule), ['schema-note']);
      const result = runFeedbackNote(['--schema', '--from', 'task-015-feedback', '--tree', tree]);
      assert.equal(result.code, 0, result.lines.join('\n'));
      const note = last(tree);
      assert.match(note.file, new RegExp(`^${NEXT}-schema-[0-9a-f]{12}\\.md$`));
      assert.match(note.title, /^The pack schemas changed \(sha256:[0-9a-f]{12}\)$/);
      assert.match(note.body, /^\nNew note \(task-015\)\./);
      assert.match(note.body, /Changed since F-017:\n\n- changed: `schema\/pack\.schema\.json`/);
      assertInbox(join(tree, INBOX));
      assert.equal(runCheckPacks(tree).code, 0, runCheckPacks(tree).lines.join('\n'));
      assert.match(runFeedbackNote(['--schema', '--from', 'task-015', '--tree', tree]).lines
        .join('\n'), /no note written/, 'a second run writes nothing');
    });
  });
});

describe('the digest of schema/', () => {
  it('in a git repository, counts only the files git tracks (no editor swap file)', () => {
    const repo = treeRepo();
    try {
      addRepositoryFiles(repo.dir);
      repo.commitAll('inbox and schemas');
      const before = schemaListing(repo.dir)?.digest;
      writeFileSync(join(repo.dir, 'schema', '.pack.schema.json.swp'), 'junk');
      assert.equal(schemaListing(repo.dir)?.digest, before);
      assert.equal(runCheckPacks(repo.dir).code, 0, runCheckPacks(repo.dir).lines.join('\n'));
    } finally {
      repo.dispose();
    }
  });
});

describe('npm run feedback:note -- usage', () => {
  it('exits 3 on bad usage and 2 on a missing or malformed inbox', () => {
    withTree((tree) => {
      for (const argv of [[], ['--schema', '--published', 'base@1.0.0', '--from', 'task-015'],
        ['--published', 'base@1.0.0', '--from', 'prel-001'],
        ['--schema'], ['--schema', '--from', 'issue-1'], ['--schema', '--from', 'task-0159xyz'],
        ['--bogus']]) {
        assert.equal(runFeedbackNote([...argv, '--tree', tree]).code, 3, argv.join(' '));
      }
      appendFileSync(join(tree, 'schema', 'pack.schema.json'), '\n');
      writeFileSync(join(tree, INBOX, 'README.md'), '# inbox\n');
      assert.equal(runFeedbackNote(['--schema', '--from', 'task-015', '--tree', tree]).code, 2);
      rmSync(join(tree, INBOX), { recursive: true });
      assert.equal(runFeedbackNote(['--schema', '--from', 'task-015', '--tree', tree]).code, 2);
    });
  });
});

const RELEASE = new StubWingfoil({}, STUB_RELEASE);
after(() => RELEASE.dispose());

/** A repository like task-014's, with this repository's inbox and package.json committed. */
function publishRepository(): TestRepo {
  const repo = treeRepo([BASE_COMPOSABLE, KANBAN]);
  appendFileSync(join(repo.dir, 'packs', 'base', 'CHANGELOG.md'), '\n- 1.0.0: first version.\n');
  addRepositoryFiles(repo.dir);
  repo.commitAll('inbox, schemas, changelog');
  return repo;
}

function publish(repo: TestRepo, extra: string[]): ReturnType<typeof runPublish> {
  return runPublish(['--tree', repo.dir, '--pack', 'base', 'methodology/kanban', ...extra],
    { install: () => RELEASE.cli, env: repo.env });
}

describe('npm run publish:pack (F5.4, the W7 exit criterion; dl-021 R1)', () => {
  it('a publication produces tag, catalog entry and digest, and no note', () => {
    const repo = publishRepository();
    try {
      const notes = notesOf(join(repo.dir, INBOX)).length;
      const result = publish(repo, []);
      assert.equal(result.code, 0, result.lines.join('\n'));
      assert.ok(!result.lines.some((line) => line.startsWith('- Feedback note')),
        result.lines.join('\n'));
      assert.deepEqual(repo.git(['log', '-2', '--format=%s']).trim().split('\n'),
        ['catalog: base@1.0.0', 'inbox, schemas, changelog']);
      assert.equal(repo.git(['cat-file', '-t', 'refs/tags/base@1.0.0']).trim(), 'tag');
      // CB-5 (task-020): the catalog and its index, nothing under packs/ and no note.
      assert.deepEqual(repo.git(['diff', '--name-only', 'base@1.0.0', 'HEAD']).trim().split('\n'),
        ['CATALOG.md', 'catalog-index.json', 'catalog.yaml']);
      assert.equal(notesOf(join(repo.dir, INBOX)).length, notes);
      assert.equal(repo.git(['status', '--porcelain']).trim(), '');
    } finally {
      repo.dispose();
    }
  });

  it('refuses --bundled and --from (exit 3)', () => {
    const repo = publishRepository();
    try {
      for (const extra of [['--bundled'], ['--from', 'prel-001'],
        ['--bundled', '--from', 'prel-001'], ['--dry-run', '--bundled', '--from', 'prel-001']]) {
        assert.equal(publish(repo, extra).code, 3, extra.join(' '));
      }
      assert.equal(repo.git(['tag', '-l']).trim(), '');
    } finally {
      repo.dispose();
    }
  });

  it('a schema change fails the publication until its note is written and committed', () => {
    const repo = publishRepository();
    try {
      appendFileSync(join(repo.dir, 'schema', 'pack.schema.json'), '\n');
      repo.commitAll('a schema change');
      const refused = publish(repo, []);
      assert.equal(refused.code, 1, refused.lines.join('\n'));
      assert.match(refused.lines.join('\n'), /schema-note/);
      assert.equal(repo.git(['tag', '-l']).trim(), '');
      const note = runFeedbackNote(['--schema', '--from', 'task-029', '--tree', repo.dir]);
      assert.equal(note.code, 0, note.lines.join('\n'));
      repo.commitAll('the schema note');
      const result = publish(repo, []);
      assert.equal(result.code, 0, result.lines.join('\n'));
      assert.equal(repo.git(['cat-file', '-t', 'refs/tags/base@1.0.0']).trim(), 'tag');
    } finally {
      repo.dispose();
    }
  });
});
