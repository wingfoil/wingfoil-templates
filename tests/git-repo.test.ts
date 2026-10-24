// The test repositories run git with their own configuration only (task-045): no variable of the
// caller's git environment reaches them, as `src/git.ts` keeps none for the tooling's own git.
import { strict as assert } from 'node:assert';
import { describe, it } from 'node:test';

import { TestRepo } from './support/git-repo';

const INHERITED: Record<string, string> = {
  GIT_AUTHOR_NAME: 'Caller', GIT_AUTHOR_EMAIL: 'caller@example.invalid',
  GIT_COMMITTER_NAME: 'Caller', GIT_COMMITTER_EMAIL: 'caller@example.invalid',
  GIT_CONFIG_PARAMETERS: "'commit.gpgsign=true' 'tag.gpgsign=true'",
  GIT_CONFIG_COUNT: '1', GIT_CONFIG_KEY_0: 'commit.gpgsign', GIT_CONFIG_VALUE_0: 'true',
};

describe('TestRepo and the caller\'s git environment (task-045)', () => {
  it('commits and tags as its own identity, with its own configuration, in its own repository',
    () => {
      const decoy = new TestRepo();
      const decoyHead = decoy.commitAll('decoy');
      const saved = { ...process.env };
      Object.assign(process.env, INHERITED, { GIT_DIR: `${decoy.dir}/.git` });
      let repo: TestRepo | undefined;
      try {
        repo = new TestRepo();
        repo.write('a.txt', 'a\n');
        repo.commitAll('a');
        repo.tag('a@1.0.0');
      } finally {
        for (const key of Object.keys(process.env)) {
          if (!(key in saved)) Reflect.deleteProperty(process.env, key);
        }
        Object.assign(process.env, saved);
      }
      try {
        assert.equal(repo.git(['log', '-1', '--format=%an <%ae>|%cn <%ce>']).trim(),
          'Test <test@example.invalid>|Test <test@example.invalid>');
        assert.equal(repo.git(['tag', '-l', '--format=%(taggername) %(taggeremail)', 'a@1.0.0'])
          .trim(), 'Test <test@example.invalid>');
        assert.equal(decoy.git(['rev-parse', 'HEAD']).trim(), decoyHead);
        assert.equal(decoy.git(['tag', '-l']).trim(), '');
      } finally {
        repo.dispose();
        decoy.dispose();
      }
    });
});
