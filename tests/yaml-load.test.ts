import { strict as assert } from 'node:assert';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, it } from 'node:test';
import { isScalar } from 'yaml';

import { YamlError, loadYamlFile, parseYaml } from '../src/yaml-load';

function yamlError(fn: () => unknown): YamlError {
  try {
    fn();
  } catch (error) {
    if (error instanceof YamlError) return error;
    throw error;
  }
  assert.fail('expected a YamlError');
}

describe('parseYaml', () => {
  it('returns the data and the position of every value', () => {
    const loaded = parseYaml('format: 1\npacks:\n  - id: base\n    path: packs/base\n', 'c.yaml');
    assert.deepEqual(loaded.data, { format: 1, packs: [{ id: 'base', path: 'packs/base' }] });
    assert.deepEqual(loaded.positionOf('/format'), { line: 1, column: 9 });
    assert.deepEqual(loaded.positionOf('/packs/0/path'), { line: 4, column: 11 });
  });

  it('gives the enclosing mapping for a key error, and 1:1 for the root', () => {
    const loaded = parseYaml('format: 1\nreleases:\n  - wingfoil: 0.2.2\n', 'c.yaml');
    assert.deepEqual(loaded.positionOf('/releases/0'), { line: 3, column: 5 });
    assert.deepEqual(loaded.positionOf(''), { line: 1, column: 1 });
    assert.deepEqual(loaded.positionOf('/missing/deep'), { line: 1, column: 1 });
  });

  it('keeps the source text of a scalar', () => {
    const loaded = parseYaml('format: 1.0\n', 'p.yaml');
    const node = loaded.document.get('format', true);
    assert.ok(isScalar(node));
    assert.equal(node.source, '1.0');
    assert.deepEqual(loaded.data, { format: 1 });
  });

  it('refuses aliases', () => {
    const error = yamlError(() => parseYaml('a: &x 1\nb: *x\n', 'p.yaml'));
    assert.equal(error.reason, 'syntax');
  });

  it('reads JSON pointer escapes', () => {
    const loaded = parseYaml('"a/b":\n  "c~d": 1\n', 'x.yaml');
    assert.deepEqual(loaded.positionOf('/a~1b/c~0d'), { line: 2, column: 10 });
  });

  it('fails with file, line and column on a syntax error', () => {
    const error = yamlError(() => parseYaml('format: 1\nid: [unclosed\n', 'p.yaml'));
    assert.equal(error.reason, 'syntax');
    assert.equal(error.file, 'p.yaml');
    assert.ok(error.message.startsWith('p.yaml:3:1: '), error.message);
    assert.ok(!error.message.endsWith(':'), error.message);
  });

  it('puts the root at 1:1 even after leading comments', () => {
    const loaded = parseYaml('# header\n\nformat: 1\n', 'c.yaml');
    assert.deepEqual(loaded.positionOf(''), { line: 1, column: 1 });
    assert.deepEqual(loaded.positionOf('/format'), { line: 3, column: 9 });
  });

  const empty: [string, string][] = [['an empty file', ''], ['a comment-only file', '# nothing\n']];
  for (const [name, text] of empty) {
    it(`fails on ${name}`, () => {
      const error = yamlError(() => parseYaml(text, 'p.yaml'));
      assert.equal(error.reason, 'syntax');
      assert.match(error.message, /^p\.yaml:1:1: no YAML document$/);
    });
  }

  it('fails on a duplicate key, at the duplicate', () => {
    const error = yamlError(() => parseYaml('format: 1\nid: a\nid: b\n', 'p.yaml'));
    assert.equal(error.reason, 'syntax');
    assert.deepEqual(error.position, { line: 3, column: 1 });
    assert.match(error.message, /duplicate|unique/i);
  });

  it('fails on a multi-document file, at the second document', () => {
    const error = yamlError(() => parseYaml('format: 1\n---\nformat: 1\n', 'p.yaml'));
    assert.equal(error.reason, 'syntax');
    assert.equal(error.position.line, 2);
    assert.match(error.message, /more than one YAML document/);
  });
});

describe('loadYamlFile', () => {
  function withFile(bytes: Buffer, body: (path: string) => void): void {
    const dir = mkdtempSync(join(tmpdir(), 'yaml-load-'));
    try {
      const path = join(dir, 'f.yaml');
      writeFileSync(path, bytes);
      body(path);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  }

  it('reads a UTF-8 file', () => {
    withFile(Buffer.from('title: "Città"\n', 'utf8'), (path) => {
      assert.deepEqual(loadYamlFile(path, 'f.yaml').data, { title: 'Città' });
    });
  });

  it('reads a UTF-8 file that starts with a byte order mark', () => {
    withFile(Buffer.from('\ufefftitle: "x"\n', 'utf8'), (path) => {
      assert.deepEqual(loadYamlFile(path, 'f.yaml').data, { title: 'x' });
    });
  });

  it('fails on bytes that are not UTF-8', () => {
    withFile(Buffer.from([0x74, 0x3a, 0x20, 0xff, 0x0a]), (path) => {
      assert.equal(yamlError(() => loadYamlFile(path, 'f.yaml')).reason, 'encoding');
    });
  });

  it('fails on a path that cannot be read', () => {
    withFile(Buffer.from(''), (path) => {
      assert.equal(yamlError(() => loadYamlFile(join(path, '..', 'nope'), 'nope')).reason, 'io');
    });
  });
});
