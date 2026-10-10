import { strict as assert } from 'node:assert';
import { appendFileSync, cpSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
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
import { STUB_RELEASE, publishByHand, treeRepo } from './support/published-repo';
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
      assert.match(note.file, /^F-022-schema-[0-9a-f]{12}\.md$/);
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

describe('npm run feedback:note -- --published', () => {
  it('writes the note of a published version, read from catalog.yaml', () => {
    const repo = treeRepo();
    try {
      publishByHand(repo, 'base');
      addRepositoryFiles(repo.dir);
      const result = runFeedbackNote(['--published', 'base@1.0.0', '--from', 'prel-001',
        '--tree', repo.dir]);
      assert.equal(result.code, 0, result.lines.join('\n'));
      const note = last(repo.dir);
      assert.equal(note.file, 'F-022-pack-base-1.0.0-published.md');
      assert.equal(note.title, 'Pack `base@1.0.0` published, for the bundled copy');
      assert.match(note.body, /^\nNew note \(prel-001\)\./);
      assert.match(note.body, new RegExp(`computed WingFoil range \`${STUB_RELEASE}\``));
      assertInbox(join(repo.dir, INBOX));
      assert.equal(runFeedbackNote(['--published', 'base@9.9.9', '--from', 'prel-001',
        '--tree', repo.dir]).code, 1, 'a version catalog.yaml does not list');
    } finally {
      repo.dispose();
    }
  });

  it('exits 3 on bad usage and 2 on a missing or malformed inbox', () => {
    withTree((tree) => {
      for (const argv of [[], ['--schema', '--published', 'base@1.0.0', '--from', 'task-015'],
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
function bundledRepository(): TestRepo {
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

describe('npm run publish:pack -- --bundled (F5.4; the W7 exit criterion)', () => {
  it('the dry-run publication produces tag, catalog entry, digest and note', () => {
    const repo = bundledRepository();
    try {
      const result = publish(repo, ['--bundled', '--from', 'prel-001']);
      assert.equal(result.code, 0, result.lines.join('\n'));
      assert.ok(result.lines.includes('- Feedback note: F-022'), result.lines.join('\n'));
      assert.deepEqual(repo.git(['log', '-3', '--format=%s']).trim().split('\n'),
        ['feedback: F-022 base@1.0.0', 'catalog: base@1.0.0', 'inbox, schemas, changelog']);
      assert.equal(repo.git(['cat-file', '-t', 'refs/tags/base@1.0.0']).trim(), 'tag');
      assertInbox(join(repo.dir, INBOX));
      assert.equal(runCheckPacks(repo.dir).code, 0, runCheckPacks(repo.dir).lines.join('\n'));
      assert.equal(repo.git(['status', '--porcelain']).trim(), '');
    } finally {
      repo.dispose();
    }
  });

  it('writes no note without --bundled, and needs --from with it', () => {
    const repo = bundledRepository();
    try {
      assert.equal(publish(repo, ['--bundled']).code, 3);
      assert.equal(publish(repo, ['--bundled', '--from', 'task-015']).code, 3,
        'a publication note comes from a pack-release');
      assert.equal(publish(repo, ['--dry-run', '--bundled', '--from', 'prel-001']).code, 0);
      assert.equal(publish(repo, []).code, 0);
      assert.equal(repo.git(['log', '-1', '--format=%s']).trim(), 'catalog: base@1.0.0');
    } finally {
      repo.dispose();
    }
  });

  it('a failure after the catalog commit resets the branch and removes the tag', () => {
    const repo = bundledRepository();
    try {
      const readme = join(repo.dir, INBOX, 'README.md');
      writeFileSync(readme, readFileSync(readme, 'utf8').replace(/^\| \[F-.*\n/gm, ''));
      repo.commitAll('a ledger with no row');
      const head = repo.git(['rev-parse', 'HEAD']).trim();
      const result = publish(repo, ['--bundled', '--from', 'prel-001']);
      assert.equal(result.code, 2, result.lines.join('\n'));
      assert.match(result.lines.join('\n'), /branch reset to its head before the tag/);
      assert.equal(repo.git(['rev-parse', 'HEAD']).trim(), head);
      assert.equal(repo.git(['tag', '-l']).trim(), '');
      assert.equal(repo.git(['status', '--porcelain']).trim(), '');
    } finally {
      repo.dispose();
    }
  });
});
