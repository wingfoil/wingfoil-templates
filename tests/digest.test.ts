import { strict as assert } from 'node:assert';
import { createHash } from 'node:crypto';
import { readFileSync, readdirSync, symlinkSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, it } from 'node:test';

import {
  DigestError, digestOfListing, isCatalogPackId, listingOf, packDigest, transitionDigest,
} from '../src/digest';
import { REPO_ROOT } from './support/paths';
import { withRepo } from './support/git-repo';
import type { TestRepo } from './support/git-repo';

const VECTOR: Record<string, string> = {
  'CHANGELOG.md': '- 1.0.0: first version.\n',
  'README.md': 'Example pack.\n',
  'pack.yaml': 'format: 1\nid: governance/example\n',
  'workflows/example.yaml': 'name: example\n',
};

const VECTOR_LISTING = [
  'f6097182a7684de9c96e3e177f7093dae055078578b6d50ffc29113615496567  CHANGELOG.md',
  '084afaef62d7b533569e4e4b5c17209d72f7ab184b4b27de88ec6e514db5a44f  README.md',
  'd5c3f6446bebdb367c001944c80c553c1d220d5a3f3fff14430d09dbc0b12494  pack.yaml',
  '15fcc3870625980bf58f15ba904736b4ffa1a84495a8f4f51d781e211016e743  workflows/example.yaml',
  '',
].join('\n');

const VECTOR_DIGEST = 'sha256:77a8a72717b5c73b556af940449ff91a609796079139ade0cb98ddf2ca81bd1c';

function sha256(bytes: Buffer | string): string {
  return createHash('sha256').update(bytes).digest('hex');
}

function writePack(repo: TestRepo, id: string, files: Record<string, string>): void {
  for (const [path, text] of Object.entries(files)) repo.write(`packs/${id}/${path}`, text);
}

/** Runs body with environment variables set, restoring them afterwards. */
function withEnv(values: Record<string, string>, body: () => void): void {
  const saved = Object.fromEntries(Object.keys(values).map((name) => [name, process.env[name]]));
  Object.assign(process.env, values);
  try {
    body();
  } finally {
    for (const [name, value] of Object.entries(saved)) {
      if (value === undefined) delete process.env[name];
      else process.env[name] = value;
    }
  }
}

function digestError(fn: () => unknown): DigestError {
  try {
    fn();
  } catch (error) {
    if (error instanceof DigestError) return error;
    throw error;
  }
  assert.fail('expected a DigestError');
}

describe('listingOf and digestOfListing', () => {
  it('reproduce the spec-001 §13 test vector without git', () => {
    const files = Object.entries(VECTOR)
      .map(([path, text]) => ({ path, bytes: Buffer.from(text) }));
    const listing = listingOf(files.reverse());
    assert.equal(listing, VECTOR_LISTING);
    assert.equal(digestOfListing(listing), VECTOR_DIGEST);
  });
});

describe('packDigest', () => {
  it('gives the spec-001 §13 test vector at an annotated tag', () => {
    withRepo((repo) => {
      writePack(repo, 'governance/example', VECTOR);
      repo.commitAll('example');
      repo.tag('governance/example@1.0.0');
      const result = packDigest(repo.dir, 'governance/example@1.0.0', 'governance/example');
      assert.equal(result.listing, VECTOR_LISTING);
      assert.equal(result.digest, VECTOR_DIGEST);
    });
  });

  it('refuses a symbolic link, naming it', () => {
    withRepo((repo) => {
      writePack(repo, 'base', { 'pack.yaml': 'x\n' });
      symlinkSync('pack.yaml', join(repo.dir, 'packs/base/link.yaml'));
      repo.commitAll('link');
      assert.match(digestError(() => packDigest(repo.dir, 'HEAD', 'base')).message, /link\.yaml/);
    });
  });

  it('refuses a submodule entry, naming it', () => {
    withRepo((repo) => {
      writePack(repo, 'base', { 'pack.yaml': 'x\n' });
      const first = repo.commitAll('one');
      repo.addGitlink('packs/base/sub', first);
      repo.commitIndex('gitlink');
      assert.match(digestError(() => packDigest(repo.dir, 'HEAD', 'base')).message, /sub/);
    });
  });

  it('ignores the executable bit', () => {
    withRepo((repo) => {
      writePack(repo, 'base', { 'run.sh': 'echo\n' });
      repo.commitAll('plain');
      const plain = packDigest(repo.dir, 'HEAD', 'base').digest;
      repo.git(['update-index', '--chmod=+x', 'packs/base/run.sh']);
      repo.commitIndex('executable');
      assert.match(repo.git(['ls-tree', 'HEAD', 'packs/base/run.sh']), /^100755 /);
      assert.equal(packDigest(repo.dir, 'HEAD', 'base').digest, plain);
    });
  });

  it('hashes blob bytes as committed, CR included', () => {
    withRepo((repo) => {
      const bytes = Buffer.from('a\r\nb\r\n');
      repo.addBlob('packs/base/crlf.md', bytes);
      repo.commitIndex('crlf');
      const { listing } = packDigest(repo.dir, 'HEAD', 'base');
      assert.equal(listing, `${sha256(bytes)}  crlf.md\n`);
    });
  });

  for (const bad of ['a b.md', '.hidden', 'dir/-x.md']) {
    it(`refuses the path ${JSON.stringify(bad)}`, () => {
      withRepo((repo) => {
        writePack(repo, 'base', { 'pack.yaml': 'x\n', [bad]: 'x\n' });
        repo.commitAll('bad path');
        assert.match(digestError(() => packDigest(repo.dir, 'HEAD', 'base')).message, /path/);
      });
    });
  }

  it('sorts by the bytes of the whole path', () => {
    withRepo((repo) => {
      writePack(repo, 'base', { 'a0.md': '', 'a/x.md': '', 'a.md': '', 'a-b.md': '', 'B.md': '' });
      repo.commitAll('order');
      const paths = packDigest(repo.dir, 'HEAD', 'base').listing.trimEnd().split('\n')
        .map((line) => line.slice(66));
      assert.deepEqual(paths, ['B.md', 'a-b.md', 'a.md', 'a/x.md', 'a0.md']);
    });
  });

  it('keeps a sibling directory with the same prefix out', () => {
    withRepo((repo) => {
      writePack(repo, 'base', { 'pack.yaml': 'base\n' });
      writePack(repo, 'base-x', { 'pack.yaml': 'other\n', 'extra.md': 'x\n' });
      repo.commitAll('siblings');
      const { listing } = packDigest(repo.dir, 'HEAD', 'base');
      assert.equal(listing, `${sha256('base\n')}  pack.yaml\n`);
    });
  });

  it('fails when no file is under the pack directory at the ref', () => {
    withRepo((repo) => {
      writePack(repo, 'base', { 'pack.yaml': 'x\n' });
      repo.commitAll('base only');
      const error = digestError(() => packDigest(repo.dir, 'HEAD', 'stage/prod'));
      assert.match(error.message, /no file/);
    });
  });

  it('does not depend on the working tree', () => {
    withRepo((repo) => {
      writePack(repo, 'base', { 'pack.yaml': 'x\n' });
      repo.commitAll('one');
      const committed = packDigest(repo.dir, 'HEAD', 'base').digest;
      repo.write('packs/base/pack.yaml', 'changed\n');
      repo.write('packs/base/new.md', 'new\n');
      assert.equal(packDigest(repo.dir, 'HEAD', 'base').digest, committed);
    });
  });

  it('does not depend on core.autocrlf, global or in the repository', () => {
    withRepo((repo) => {
      repo.addBlob('packs/base/crlf.md', Buffer.from('a\r\n'));
      repo.addBlob('packs/base/lf.md', Buffer.from('a\n'));
      repo.commitIndex('line endings');
      const plain = packDigest(repo.dir, 'HEAD', 'base').digest;
      const config = join(repo.home, 'autocrlf');
      writeFileSync(config, '[core]\n\tautocrlf = true\n');
      withEnv({ GIT_CONFIG_GLOBAL: config }, () => {
        assert.equal(packDigest(repo.dir, 'HEAD', 'base').digest, plain);
      });
      repo.git(['config', 'core.autocrlf', 'true']);
      assert.equal(packDigest(repo.dir, 'HEAD', 'base').digest, plain);
    });
  });

  it('ignores the caller GIT_DIR, as when run from a git hook', () => {
    withRepo((repo) => {
      writePack(repo, 'base', { 'pack.yaml': 'real\n' });
      repo.commitAll('real');
      const real = packDigest(repo.dir, 'HEAD', 'base').digest;
      withRepo((decoy) => {
        writePack(decoy, 'base', { 'pack.yaml': 'decoy\n' });
        decoy.commitAll('decoy');
        withEnv({ GIT_DIR: join(decoy.dir, '.git') }, () => {
          assert.equal(packDigest(repo.dir, 'HEAD', 'base').digest, real);
        });
      });
    });
  });

  it('ignores replace objects', () => {
    withRepo((repo) => {
      writePack(repo, 'base', { 'pack.yaml': 'real\n' });
      repo.commitAll('real');
      const real = packDigest(repo.dir, 'HEAD', 'base').digest;
      const blob = repo.git(['rev-parse', 'HEAD:packs/base/pack.yaml']).trim();
      const other = repo.git(['hash-object', '-w', '--stdin'], Buffer.from('replaced\n')).trim();
      repo.git(['replace', blob, other]);
      assert.equal(packDigest(repo.dir, 'HEAD', 'base').digest, real);
    });
  });

  for (const name of ['GIT_GLOB_PATHSPECS', 'GIT_ICASE_PATHSPECS', 'GIT_LITERAL_PATHSPECS']) {
    it(`ignores ${name}`, () => {
      withRepo((repo) => {
        writePack(repo, 'base', { 'pack.yaml': 'x\n' });
        repo.commitAll('one');
        const plain = packDigest(repo.dir, 'HEAD', 'base').digest;
        withEnv({ [name]: '1' }, () => {
          assert.equal(packDigest(repo.dir, 'HEAD', 'base').digest, plain);
        });
      });
    });
  }

  it('refuses an id that is not a catalog pack id', () => {
    withRepo((repo) => {
      writePack(repo, 'base', { 'pack.yaml': 'x\n' });
      repo.commitAll('one');
      assert.throws(() => packDigest(repo.dir, 'HEAD', '../x'), /catalog pack id/);
    });
  });
});

describe('transitionDigest', () => {
  it('refuses a file outside transitions/<id>.yaml', () => {
    withRepo((repo) => {
      repo.write('README.md', 'x\n');
      repo.commitAll('none');
      digestError(() => transitionDigest(repo.dir, 'HEAD', 'README.md'));
      digestError(() => transitionDigest(repo.dir, 'HEAD', 'transitions/../README.md'));
    });
  });

  it('lists the file under its base name', () => {
    withRepo((repo) => {
      const text = 'format: 1\nid: prototype-to-production\n';
      repo.write('transitions/prototype-to-production.yaml', text);
      repo.commitAll('transition');
      const result = transitionDigest(repo.dir, 'HEAD', 'transitions/prototype-to-production.yaml');
      const listing = `${sha256(text)}  prototype-to-production.yaml\n`;
      assert.equal(result.listing, listing);
      assert.equal(result.digest, `sha256:${sha256(listing)}`);
    });
  });

  it('fails on a missing transition file', () => {
    withRepo((repo) => {
      repo.write('README.md', 'x\n');
      repo.commitAll('none');
      digestError(() => transitionDigest(repo.dir, 'HEAD', 'transitions/x-to-y.yaml'));
    });
  });
});

describe('isCatalogPackId', () => {
  for (const id of ['base', 'methodology/kanban', 'phase/inception/lean-inception', 'stage/mvp']) {
    it(`accepts ${id}`, () => assert.equal(isCatalogPackId(id), true));
  }
  for (const id of ['phase/inception', '../x', 'methodology/../base', 'operations/x', 'Base', '']) {
    it(`refuses ${JSON.stringify(id)}`, () => assert.equal(isCatalogPackId(id), false));
  }
});

describe('src/ runs no shell', () => {
  it('calls neither exec nor execSync of child_process, nor sets shell: true', () => {
    const dir = join(REPO_ROOT, 'src');
    for (const name of readdirSync(dir).sort()) {
      const text = readFileSync(join(dir, name), 'utf8');
      // `.exec(` is RegExp.prototype.exec, not child_process.
      assert.doesNotMatch(text, /(?<![.\w])exec(?:Sync)?\(|shell:\s*true/, name);
    }
  });
});
