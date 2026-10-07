import { strict as assert } from 'node:assert';
import { describe, it } from 'node:test';

import { REGION_BEGIN, REGION_END, agentsRegion } from '../src/output';

const BASE = { pack: 'base', text: '# Project\n\nRules for every agent.\n' };
const KANBAN = { pack: 'methodology/kanban', text: '## Kanban\n\nWIP limits.\n' };

describe('AGENTS region (spec-001 §10)', () => {
  it('is the two markers alone with no section', () => {
    assert.equal(agentsRegion([], 'base'), `${REGION_BEGIN}\n${REGION_END}\n`);
  });

  it('holds the sections in order, one blank line between them', () => {
    assert.equal(agentsRegion([BASE, KANBAN], 'base'), [
      REGION_BEGIN, '# Project', '', 'Rules for every agent.', '', '## Kanban', '', 'WIP limits.',
      REGION_END, '',
    ].join('\n'));
  });

  it('uses the provisional markers of spec-001 §10', () => {
    assert.equal(REGION_BEGIN, '<!-- wingfoil:generated:begin -->');
    assert.equal(REGION_END, '<!-- wingfoil:generated:end -->');
  });

  it('opens a section at its first non-blank line, CRLF and BOM read as text', () => {
    const text = '﻿\r\n\r\n## Kanban\r\nWIP.\r\n';
    assert.match(agentsRegion([{ pack: 'methodology/kanban', text }], 'base'),
      /^<!-- wingfoil:generated:begin -->\n## Kanban\nWIP\.\n<!--/);
  });

  const refused: [string, { pack: string; text: string }, RegExp][] = [
    ['a base section not opening with a level-1 heading',
      { pack: 'base', text: '## Project\n' }, /base.*level-1/],
    ['a base section opening with a comment',
      { pack: 'base', text: '<!-- note -->\n# Project\n' }, /base.*level-1/],
    ['another section opening with a level-1 heading',
      { pack: 'blueprint/x', text: '# X\n' }, /blueprint\/x.*level-2/],
    ['another section not opening with a heading',
      { pack: 'blueprint/x', text: 'Text.\n## X\n' }, /blueprint\/x.*level-2/],
    ['another section with a level-1 heading later',
      { pack: 'blueprint/x', text: '## X\n\n# Y\n' }, /blueprint\/x.*level-1/],
    ['a section opening with fenced code',
      { pack: 'blueprint/x', text: '```\n## X\n```\n' }, /blueprint\/x.*level-2/],
    ['a section holding the begin marker',
      { pack: 'blueprint/x', text: `## X\n${REGION_BEGIN}\n` }, /blueprint\/x.*marker/],
    ['a section holding the end marker',
      { pack: 'blueprint/x', text: `## X\n${REGION_END}\n` }, /blueprint\/x.*marker/],
  ];
  for (const [name, section, pattern] of refused) {
    it(`fails on ${name}`, () => assert.throws(() => agentsRegion([section], 'base'), pattern));
  }

  it('reads # inside fenced code as text, not as a heading', () => {
    const text = '## X\n\n```sh\n# a shell comment\n```\n~~~\n# another\n~~~\n';
    assert.match(agentsRegion([{ pack: 'blueprint/x', text }], 'base'), /# a shell comment/);
  });
});
