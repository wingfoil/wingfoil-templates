import { strict as assert } from 'node:assert';
import { describe, it } from 'node:test';

import {
  checkValue, fromText, isListParameter, listItemProblem, misplacedReferences, substitute,
} from '../src/parameters';
import type { ScopedParameter } from '../src/parameters';

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

describe('parameters: list parameters (spec-003 §3.1, §3.2)', () => {
  it('a list parameter is a string whose description begins with "List of"', () => {
    assert.equal(isListParameter({ type: 'string', description: 'List of outcomes.' }), true);
    assert.equal(isListParameter({ type: 'string', description: 'The outcomes.' }), false);
    assert.equal(isListParameter({ type: 'string', description: 'A list of outcomes.' }), false);
    assert.equal(isListParameter({ type: 'path', description: 'List of paths.' }), false);
  });

  it('the item rule refuses what spec-003 §3.2 refuses, and accepts the rest', () => {
    for (const value of ['', '   ', 'task, task', 'x], kind: [defect', 'null, task', 'yes, task',
      'on', 'bug,', 'Yes', 'bug:', 'catalog/pack', 'a b', '1bug', 'bug:a:b', '~']) {
      assert.notEqual(listItemProblem(value), undefined, JSON.stringify(value));
    }
    for (const value of ['bug', 'bug, task', ' bug , upstream:plover-vendor ', 'a-1:b-2',
      'nulls', 'yesterday']) {
      assert.equal(listItemProblem(value), undefined, JSON.stringify(value));
    }
  });

  it('names the failure', () => {
    assert.match(listItemProblem('') ?? '', /no item/);
    assert.match(listItemProblem('bug,') ?? '', /empty item/);
    assert.match(listItemProblem('task, task') ?? '', /"task".*twice/);
    assert.match(listItemProblem('null, task') ?? '', /"null"/);
    assert.match(listItemProblem('catalog/pack') ?? '', /"catalog\/pack"/);
  });
});

describe('parameters: the placement rule (spec-003 §3.1)', () => {
  const scope = new Map<string, ScopedParameter>([
    ['s', { type: 'string', list: false, pack: 'a/p' }],
    ['n', { type: 'integer', list: false, pack: 'a/p' }],
    ['b', { type: 'boolean', list: false, pack: 'a/p' }],
    ['l', { type: 'string', list: true, pack: 'a/p' }],
    ['q', { type: 'path', list: false, pack: 'a/p' }],
  ]);
  const placements = (text: string, path = 'workflows/w.yaml', own = 'a/p'): string[] =>
    misplacedReferences(text, path, scope, own).map((each) => `${each.name} ${each.placement}`);

  it('accepts a double-quoted scalar, an integer and a boolean, a list in its own pack', () => {
    for (const text of ['a: "{{s}}"\n', 'a: "x {{s}} y"\n', '"{{s}}": 1\n', 'a: {{n}}\n',
      'a: {{b}}\n', 'a: [{{l}}]\n', 'a: [ {{l}} ]\n', 'a: ["{{s}}", "{{q}}"]\n',
      'a: { k: "{{s}}" }\n', 'a: "x \\" {{s}}"\n', 'a: "x\\\\" # {{n}}\n',
      'a: {{unknown}}\n', "a: don't {{n}}\n", 'a: "x\n  {{s}}"\n']) {
      assert.deepEqual(placements(text), [], text);
    }
  });

  it('refuses every other placement', () => {
    assert.deepEqual(placements('a: {{s}}\n'), ['s plain']);
    assert.deepEqual(placements("a: '{{s}}'\n"), ['s single-quoted']);
    assert.deepEqual(placements('a: |\n  {{s}}\n'), ['s block scalar']);
    assert.deepEqual(placements('a: >-\n  x\n  {{s}}\nb: "{{s}}"\n'), ['s block scalar']);
    assert.deepEqual(placements('- |\n  {{s}}\n- "{{s}}"\n'), ['s block scalar']);
    assert.deepEqual(placements('a: "x" # {{s}}\n'), ['s comment']);
    assert.deepEqual(placements('# {{q}}\n'), ['q comment']);
    assert.deepEqual(placements('a: [{{l}}, x]\n'), ['l plain']);
    assert.deepEqual(placements('a: [{{s}}]\n'), ['s plain']);
    assert.deepEqual(placements('a: {{q}}\n'), ['q plain']);
    assert.deepEqual(placements('a: [{{l}}]\n', 'workflows/w.yaml', 'b/other'),
      ['l flow sequence outside the pack that declares it']);
  });

  it("reads a Markdown file's frontmatter only, and skips pack.yaml", () => {
    assert.deepEqual(placements('---\nid: {{s}}\n---\n\nText {{s}}.\n', 'directives/d.md'),
      ['s plain']);
    assert.deepEqual(placements('---\nid: "{{s}}"\n---\n\nText {{s}}: {{q}}.\n',
      'directives/d.md'), []);
    assert.deepEqual(placements('# Title\n\nText {{s}}.\n', 'agents/a.md'), []);
    assert.deepEqual(placements('a: {{s}}\n', 'pack.yaml'), []);
    assert.deepEqual(placements('a: {{s}}\n', 'README.txt'), []);
  });

  it('opens a quoted scalar only where a scalar starts (review S1)', () => {
    assert.deepEqual(placements('a: 12" screen\nb: "{{s}}"\n'), []);
    assert.deepEqual(placements("a: the '90s style\nb: \"{{s}}\"\n"), []);
    assert.deepEqual(placements('a: x "{{s}}" y\n'), ['s plain']);
    assert.deepEqual(placements('- "{{s}}"\n- [ "{{s}}", { k: "{{s}}" } ]\n? "{{s}}"\n: 1\n'), []);
    assert.deepEqual(placements('a: !!str "{{s}}"\nb: &x "{{s}}"\n'), []);
    // Outside a flow collection, `[`, `{` and `,` are a plain scalar's (re-review S-1, N-a).
    assert.deepEqual(placements('a: foo, "{{s}}" bar\n'), ['s plain']);
    assert.deepEqual(placements('a: x [ "{{s}}"\n'), ['s plain']);
    assert.deepEqual(placements('a: x, "y\nb: {{s}}\nc: "z"\nd: {{s}}\n'), ['s plain', 's plain']);
    assert.deepEqual(placements('a: {"k":"{{s}}", "j": ["{{s}}"]}\n'), []);
    assert.deepEqual(placements('a: [\n  "{{s}}",\n  {{s}}\n]\n'), ['s plain']);
  });

  it("closes a block scalar at its key's sibling, after a sequence dash (review S2)", () => {
    assert.deepEqual(placements('- k: >-\n    text\n  j: "{{s}}"\n'), []);
    assert.deepEqual(placements('- k: >-\n    {{s}}\n  j: "{{s}}"\n'), ['s block scalar']);
    assert.deepEqual(placements('- - k: |\n      {{s}}\n    j: "{{s}}"\n'), ['s block scalar']);
  });

  it('reads a frontmatter as src/frontmatter.ts does, CRLF and BOM included (review S3)', () => {
    assert.deepEqual(placements('---\r\nt: {{s}}\r\n---\r\nText {{s}}.\r\n', 'directives/d.md'),
      ['s plain']);
    assert.deepEqual(placements('\uFEFF---\nt: {{s}}\n---\nText {{s}}.\n', 'directives/d.md'),
      ['s plain']);
    assert.deepEqual(placements('---\nt: "x"\n----\nu: {{s}}\n---\n', 'directives/d.md'),
      ['s plain']);
  });

  it("gives each misplaced reference's offset", () => {
    const [first] = misplacedReferences('a: "ok"\nb: {{s}}\n', 'w.yaml', scope, 'a/p');
    assert.equal(first?.offset, 11);
  });
});
