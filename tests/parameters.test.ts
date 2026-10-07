import { strict as assert } from 'node:assert';
import { describe, it } from 'node:test';

import { checkValue, fromText, substitute } from '../src/parameters';

describe('parameters: value checks (spec-001 §8.1, from the pack schema)', () => {
  const cases: [string, unknown, boolean][] = [
    ['string', 'plain text', true],
    ['string', 'tab\there', false],
    ['string', 'a "quote"', false],
    ['string', 'back\\slash', false],
    ['string', 'a {{b}}', false],
    ['string', 3, false],
    ['path', 'docs/memory/{release}/{id}.md', true],
    ['path', 'a..b/c', true],
    ['path', '/etc/x', false],
    ['path', 'docs/../x', false],
    ['path', '..', false],
    ['path', 'docs\\x', false],
    ['path', 'docs/{{x}}', false],
    ['pattern', 'plan-{n}-{slug}', true],
    ['pattern', 'a/b', false],
    ['pattern', 'a b', false],
    ['pattern', 'a{{b}}', false],
    ['integer', 3, true],
    ['integer', -2, true],
    ['integer', 2.5, false],
    ['integer', '3', false],
    ['integer', '0x10', false],
    ['boolean', true, true],
    ['boolean', 'true', false],
    ['boolean', 'yes', false],
  ];
  for (const [type, value, valid] of cases) {
    it(`${valid ? 'accepts' : 'refuses'} ${JSON.stringify(value)} as ${type}`, () => {
      assert.equal(checkValue(type, value) === undefined, valid, checkValue(type, value));
    });
  }
});

describe('parameters: substitution (spec-001 §8.2, §8.3)', () => {
  const values = new Map<string, string | number | boolean>([
    ['name', 'Demo'], ['wip', 3], ['a', '{'], ['strict', true],
  ]);
  const scope = new Set(['name', 'wip', 'a', 'strict']);
  const run = (text: string): string => substitute(text, values, scope, 'f.yaml', 'blueprint/x');

  it('replaces every {{name}} by its value, as text', () => {
    assert.equal(run('project: "{{name}}"\nwip: {{wip}}\nstrict: {{strict}}\n'),
      'project: "Demo"\nwip: 3\nstrict: true\n');
  });

  it('leaves other braces as they are', () => {
    const text = '{{ name }} {{other {{Name}} {id} {n} {slug} {release} {scope}';
    assert.equal(run(text), text);
  });

  it('is single-pass', () => {
    assert.equal(run('{{a}}{b}}'), '{{b}}');
  });

  it('fails on a name outside the scope, naming the file and the pack', () => {
    assert.throws(() => substitute('{{wip}}', values, new Set(['name']), 'f.yaml', 'blueprint/x'),
      /f\.yaml.*\{\{wip\}\}.*blueprint\/x/);
  });
});

describe('parameters: review cases', () => {
  it('substitutes every occurrence, also next to other braces', () => {
    const values = new Map<string, string | number | boolean>([['a', 'V']]);
    const scope = new Set(['a']);
    assert.equal(substitute('x: {k: {{a}}}', values, scope, 'f', 'p'), 'x: {k: V}');
    assert.equal(substitute('{{{a}}}', values, scope, 'f', 'p'), '{V}');
    assert.throws(() => substitute('x: {k: {{b}}}', values, scope, 'f', 'p'), /\{\{b\}\}/);
  });
});

describe('parameters: values given as text', () => {
  it('reads an integer, a boolean, and leaves anything else as text', () => {
    assert.equal(fromText('integer', '12'), 12);
    assert.equal(fromText('integer', '-3'), -3);
    assert.equal(fromText('integer', '012'), '012');
    assert.equal(fromText('integer', '1.0'), '1.0');
    assert.equal(fromText('boolean', 'true'), true);
    assert.equal(fromText('boolean', 'yes'), 'yes');
    assert.equal(fromText('string', '007'), '007');
    assert.equal(fromText('path', 'docs/x'), 'docs/x');
  });
});
