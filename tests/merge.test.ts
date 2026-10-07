import { strict as assert } from 'node:assert';
import { describe, it } from 'node:test';
import { parse } from 'yaml';

import { CompositionError } from '../src/composition-error';
import { checkDnaFragment, checkRoleDirectives, mergeFragments } from '../src/merge';
import type { FragmentKind } from '../src/merge';
import { BUILTIN_DIRECTIVE_IDS } from '../src/wingfoil-builtins';

type Doc = Record<string, unknown>;

function merge(kind: FragmentKind, ...texts: string[]): Doc {
  return mergeFragments(kind, texts.map((text, index) => ({
    pack: `pack-${index}`, data: parse(text) as Doc,
  })));
}

function fails(pattern: RegExp, kind: FragmentKind, ...texts: string[]): void {
  assert.throws(() => merge(kind, ...texts), (error: unknown) => {
    assert.ok(error instanceof CompositionError, String(error));
    assert.match(error.message, pattern);
    return true;
  });
}

describe('merge: general rules (spec-001 §7.2)', () => {
  it('appends new keys in the incoming order, keeping the base order', () => {
    const doc = merge('dna', 'project: { name: x }\nb: 1\n',
      'z: 1\nproject: { license: MIT }\na: 1\n');
    assert.deepEqual(Object.keys(doc), ['project', 'b', 'z', 'a']);
    assert.deepEqual(Object.keys(doc['project'] as Doc), ['name', 'license']);
  });

  it('accepts equal scalars and refuses unequal ones', () => {
    merge('dna', 'project: { name: x }\n', 'project: { name: x }\n');
    fails(/dna\.yaml, project\.name, from pack-1/, 'dna', 'project: { name: x }\n',
      'project: { name: y }\n');
  });

  it('merges a set: base items first, then the new ones', () => {
    const doc = merge('dna', 'paths: { docs: [README.md, docs] }\n',
      'paths: { docs: [docs, NOTES.md] }\n');
    assert.deepEqual((doc['paths'] as Doc)['docs'], ['README.md', 'docs', 'NOTES.md']);
  });

  it('refuses a mapping in a set', () => {
    fails(/paths\.docs.*scalar/, 'dna', 'paths: { docs: [a] }\n', 'paths: { docs: [{ x: 1 }] }\n');
  });

  it('tells 1 from "1" in a set', () => {
    const doc = merge('dna', 'paths: { docs: [1] }\n', 'paths: { docs: ["1"] }\n');
    assert.deepEqual((doc['paths'] as Doc)['docs'], [1, '1']);
  });

  it('merges a keyed list by name, and appends a new name', () => {
    const doc = merge('dna',
      'modules:\n  - { name: a, path: a }\n',
      'modules:\n  - { name: b, path: b }\n  - { name: a, description: A }\n');
    assert.deepEqual(doc['modules'], [
      { name: 'a', path: 'a', description: 'A' }, { name: 'b', path: 'b' },
    ]);
  });

  it('refuses a keyed-list item without name, and a duplicate name in one fragment', () => {
    fails(/modules.*name/, 'dna', 'modules:\n  - { path: a }\n');
    fails(/modules.*duplicate.*a/, 'dna', 'modules:\n  - { name: a }\n  - { name: a }\n');
  });

  it('refuses a kind mismatch', () => {
    fails(/project.*mapping.*list/, 'dna', 'project: { name: x }\n', 'project: [x]\n');
  });

  it('compares an undeclared list as a scalar', () => {
    merge('dna', 'other: [a, b]\n', 'other: [a, b]\n');
    fails(/other/, 'dna', 'other: [a, b]\n', 'other: [b, a]\n');
  });
});

describe('merge: dna.yaml (spec-001 §7.3)', () => {
  it('keys team lists by name, with roles and executes_as as sets', () => {
    const doc = merge('dna',
      'team:\n  agents:\n    - { name: claude, executes_as: [developer] }\n'
        + '  members:\n    - { name: R, roles: [approver] }\n',
      'team:\n  agents:\n    - { name: claude, executes_as: [reviewer, developer] }\n'
        + '  members:\n    - { name: R, roles: [tech-lead] }\n');
    const team = doc['team'] as Record<string, Doc[]>;
    assert.deepEqual(team['agents'], [{ name: 'claude', executes_as: ['developer', 'reviewer'] }]);
    assert.deepEqual(team['members'], [{ name: 'R', roles: ['approver', 'tech-lead'] }]);
  });

  it('keys stacks by name', () => {
    const doc = merge('dna', 'stacks:\n  technologies:\n    - { name: YAML }\n',
      'stacks:\n  technologies:\n    - { name: Markdown }\n'
        + '    - { name: YAML, category: format }\n');
    assert.deepEqual((doc['stacks'] as Doc)['technologies'],
      [{ name: 'YAML', category: 'format' }, { name: 'Markdown' }]);
  });

  it('refuses an agent with approval authority, in any pack', () => {
    const agent = (authority: boolean): Doc => parse('team:\n  agents:\n'
      + `    - { name: claude, approval_authority: ${String(authority)} }\n`) as Doc;
    assert.throws(() => checkDnaFragment('governance/x', agent(true)),
      /governance\/x.*claude.*approval_authority/);
    checkDnaFragment('governance/x', agent(false));
  });
});

describe('merge: roles.yaml (spec-001 §7.4)', () => {
  it('merges assignments and global as sets', () => {
    const doc = merge('roles', 'assignments:\n  developer: [testing]\nglobal: [security]\n',
      'assignments:\n  developer: [code-quality, testing]\n  reviewer: [code-review]\n'
        + 'global: [x]\n');
    assert.deepEqual(doc, {
      assignments: { developer: ['testing', 'code-quality'], reviewer: ['code-review'] },
      global: ['security', 'x'],
    });
  });

  it('accepts directive ids shipped by a pack or built into WingFoil, and refuses others', () => {
    const doc = merge('roles',
      'assignments:\n  developer: [testing, wip-limits]\nglobal: [security]\n');
    checkRoleDirectives(doc, new Set(['wip-limits']));
    assert.throws(() => checkRoleDirectives(doc, new Set()), /wip-limits/);
  });

  it('names WingFoil 0.2.2 built-in directives', () => {
    assert.deepEqual([...BUILTIN_DIRECTIVE_IDS],
      ['architecture', 'code-quality', 'code-review', 'documentation', 'security', 'testing']);
  });
});

describe('merge: review cases', () => {
  it('handles keys named like Object.prototype members as plain keys', () => {
    const doc = merge('dna', 'project: { name: x }\n', 'project: { constructor: y }\n');
    assert.deepEqual(doc['project'], { name: 'x', constructor: 'y' });
  });

  it('refuses a scalar where a set or a keyed list is declared', () => {
    fails(/global.*must be a list/, 'roles', 'global: nonexistent\n');
    fails(/assignments\.dev.*must be a list/, 'roles', 'assignments: { dev: [a] }\n',
      'assignments: { dev: nonexistent }\n');
    fails(/modules.*must be a list/, 'dna', 'modules: { name: a }\n');
  });

  it('dedupes and checks a set that arrives without a base side', () => {
    assert.deepEqual((merge('dna', 'paths: { x: [a, a] }\n')['paths'] as Doc)['x'], ['a']);
    fails(/paths\.x.*scalar/, 'dna', 'paths: { x: [{ k: 1 }] }\n');
  });

  it('names the role of an unknown directive', () => {
    const doc = merge('roles', 'assignments:\n  developer: [nope]\n');
    assert.throws(() => checkRoleDirectives(doc, new Set()), /assignments\.developer.*nope/);
  });
});
