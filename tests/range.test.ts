import { strict as assert } from 'node:assert';
import { describe, it } from 'node:test';

import { computeRange, isCompatible } from '../src/range';
import type { CompatRelease, VersionRequirements } from '../src/range';

const READS_ALL: CompatRelease['reads'] = {
  dna: [1], memory: [1], roles: [1], workflows: [1], workflow: [1], directive: [1],
  'memory-template': [1],
};

function release(wingfoil: string, changes: Partial<CompatRelease> = {}): CompatRelease {
  return { wingfoil, format_key: true, reads: READS_ALL, capabilities: [], ...changes };
}

const EMPTY: VersionRequirements = { formats: {}, requires_capabilities: [] };

const KANBAN: VersionRequirements = {
  formats: { memory: 1, roles: 1, workflow: 1, directive: 1 },
  requires_capabilities: [],
};

describe('isCompatible', () => {
  it('needs format_key', () => {
    assert.equal(isCompatible(KANBAN, release('0.3.0', { format_key: false })), false);
  });

  it('needs every kind of formats in reads', () => {
    const reads = { ...READS_ALL };
    delete reads['directive'];
    assert.equal(isCompatible(KANBAN, release('0.3.0', { reads })), false);
  });

  it('needs the format in the kind list', () => {
    const reads = { ...READS_ALL, memory: [2] };
    assert.equal(isCompatible(KANBAN, release('0.3.0', { reads })), false);
  });

  it('needs reads.workflows to contain 1 (the composed workflows.yaml, spec-001 §7.7)', () => {
    const reads = { ...READS_ALL, workflows: [2] };
    assert.equal(isCompatible(EMPTY, release('0.3.0', { reads })), false);
  });

  it('needs every required capability', () => {
    const version = { ...KANBAN, requires_capabilities: ['pack-install'] };
    assert.equal(isCompatible(version, release('0.3.0')), false);
    assert.equal(isCompatible(version, release('0.4.0', { capabilities: ['pack-install'] })), true);
  });

  it('accepts empty formats and capabilities on any release with the key and workflows 1', () => {
    const reads = { workflows: [1] };
    assert.equal(isCompatible(EMPTY, release('0.3.0', { reads })), true);
  });
});

describe('computeRange', () => {
  const off = { format_key: false };

  it('is "" when nothing is compatible', () => {
    assert.equal(computeRange(KANBAN, [release('0.2.2', off)]), '');
    assert.equal(computeRange(KANBAN, []), '');
  });

  it('is the version alone for one release', () => {
    assert.equal(computeRange(KANBAN, [release('0.2.2', off), release('0.3.0')]), '0.3.0');
  });

  it('is a closed range for a run', () => {
    const releases = [release('0.2.2', off), release('0.3.0'), release('0.3.1'), release('0.3.2')];
    assert.equal(computeRange(KANBAN, releases), '>=0.3.0 <=0.3.2');
  });

  it('joins runs with ||', () => {
    const releases = [release('0.3.0'), release('0.3.1'), release('0.3.2', off), release('0.4.0')];
    assert.equal(computeRange(KANBAN, releases), '>=0.3.0 <=0.3.1 || 0.4.0');
  });

  it('follows adjacency in compat.yaml, not semver', () => {
    assert.equal(computeRange(KANBAN, [release('0.3.0'), release('0.3.2')]), '>=0.3.0 <=0.3.2');
  });

  it('refuses releases that are not in ascending order', () => {
    assert.throws(() => computeRange(KANBAN, [release('0.3.1'), release('0.3.0')]), /ascending/);
    assert.throws(() => computeRange(KANBAN, [release('0.3.0'), release('0.3.0')]), /ascending/);
  });
});
