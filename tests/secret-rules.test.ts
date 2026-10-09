import { strict as assert } from 'node:assert';
import { describe, it } from 'node:test';

import { entropy, looksLikeSecret, secretProblems } from '../src/secret-rules';

/** Token-shaped test values are built at run time, so that no literal one is committed. */
const join = (...parts: string[]): string => parts.join('');
const ALNUM = 'aB3dE5fG7hJ9kL1mN2pQ4rS6tU8vW0xYz';

const FINDINGS: [string, string][] = [
  ['a private key block', join('-----BEGIN ', 'RSA PRIVATE', ' KEY-----')],
  ['a GitHub token', join('gh', 'p_', ALNUM, 'AbC')],
  ['a GitHub token', join('github', '_pat_', ALNUM)],
  ['a GitLab token', join('gl', 'pat-', ALNUM)],
  ['a Slack token', join('xo', 'xb-', '1234567890-abc')],
  ['an npm token', join('np', 'm_', ALNUM, 'AbC')],
  ['an AWS access key id', join('AK', 'IA', 'ABCDEFGH23456789')],
  ['an API secret key', join('s', 'k-', ALNUM)],
];

describe('secretProblems', () => {
  for (const [kind, value] of FINDINGS) {
    it(`finds ${kind}, naming the line and never the value`, () => {
      const problems = secretProblems('packs/x/README.md', `# x\n\nvalue: ${value}\n`);
      assert.equal(problems.length, 1, JSON.stringify(problems));
      const [problem] = problems;
      assert.equal(problem?.rule, 'secret');
      assert.equal(problem?.line, 3);
      assert.ok(problem?.message.includes(kind), problem?.message);
      assert.ok(!problem?.message.includes(value.slice(4)), 'the value is never shown');
    });
  }

  it('finds a high-entropy base64 scalar in YAML and a hex one in Markdown', () => {
    const base64 = join('Zm9vYmFyQmF6', 'cXV4MTIzNDU2', 'Nzg5MEFCQ0RFRkdI');
    assert.deepEqual(secretProblems('packs/x/fragments/dna.yaml', `format: 1\nkey: "${base64}"\n`)
      .map((problem) => problem.line), [2]);
    const hex = join('9f86d081884c7d65', '9a2feaa0c55ad015', 'a3bf4f1b2b0b822c');
    assert.equal(secretProblems('packs/x/README.md', `see ${hex}.\n`).length, 1);
  });

  it('leaves paths, identifiers, digests and parameter names alone', () => {
    const text = [
      'path: packs/methodology/kanban/workflows',
      'id: ComposeDeterministicWorkflowIdentifier',
      `digest: "sha256:${'ab12'.repeat(16)}"`,
      'parameters: { npm_registry: { type: string } }',
      'name: task-011-compatibility-matrix-and-the-real-compat',
      `commit: ${'0123456789abcdef'.repeat(2)}01234567`,
      `checksum: ${'9f86d081884c7d659a2feaa0c55ad015'.repeat(2)}`,
      'description: "A plain sentence with ordinary words in it, and nothing secret at all."',
    ].join('\n');
    assert.deepEqual(secretProblems('packs/x/pack.yaml', text), []);
    assert.deepEqual(secretProblems('packs/x/README.md', text), []);
  });
});

describe('looksLikeSecret and entropy', () => {
  it('needs 32 characters, no / . -, and the alphabet, case mix and entropy thresholds', () => {
    assert.equal(looksLikeSecret('aB3'.repeat(5)), false, 'too short');
    assert.equal(looksLikeSecret(`${ALNUM}/x`), false, 'a path');
    assert.equal(looksLikeSecret('abcdefghijklmnopqrstuvwxyzabcdefgh'), false, 'no digit, one case');
    assert.equal(looksLikeSecret('0'.repeat(40)), false, 'hex of low entropy');
  });

  it('computes Shannon entropy in bits per character', () => {
    assert.equal(entropy('aaaa'), 0);
    assert.equal(entropy('abab'), 1);
    assert.equal(entropy('abcd'), 2);
  });
});
