// task-096 (plan-076 point 8): the [V] checks of governance/feedback's charter on the composed
// output of its README examples: FA-3's required fields, FA-4's triage gate, FA-6's routing table
// and `bug` kept to the entry `with: software@^1`, FA-1's entry composed only with software.
import { strict as assert } from 'node:assert';
import { join } from 'node:path';
import { describe, it } from 'node:test';

import { loadCatalog } from '../src/catalog';
import { composeDocuments } from '../src/compose-documents';
import type { ComposedDocuments } from '../src/compose-documents';
import { listItems } from '../src/parameters';
import { loadYamlFile } from '../src/yaml-load';

import { REPO_ROOT } from './support/paths';

const PACK = 'governance/feedback';
const EXAMPLES = join(REPO_ROOT, 'tests', 'fixtures', 'examples', 'feedback');

interface Example {
  packs: string[];
  parameters: Record<string, string | number | boolean>;
}

function example(id: string): Example {
  return loadYamlFile(join(EXAMPLES, id, 'example.yaml'), `${id}/example.yaml`).data as Example;
}

function compose(id: string): ComposedDocuments {
  const data = example(id);
  return composeDocuments(REPO_ROOT, loadCatalog(join(REPO_ROOT, 'catalog.yaml')), data.packs,
    data.parameters);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function file(composed: ComposedDocuments, path: string): { text: string; data?: unknown;
  pack: string } | undefined {
  return composed.files.find((each) => each.pack === PACK && each.path === path);
}

function feedbackType(composed: ComposedDocuments): Record<string, unknown> {
  const types = composed.memory['types'];
  const type = isRecord(types) ? types['feedback'] : undefined;
  assert.ok(isRecord(type), 'the composed memory declares the feedback type');
  return type;
}

/** The resolved value of a parameter: the example's, else the pack's default. */
function resolved(id: string, name: string): string {
  const given = example(id).parameters[name];
  if (given !== undefined) return String(given);
  const manifest = loadYamlFile(join(REPO_ROOT, 'packs', PACK, 'pack.yaml'), 'pack.yaml')
    .data as { parameters: Record<string, { default: string }> };
  const declared = manifest.parameters[name];
  assert.ok(declared !== undefined, `${name} is declared`);
  return declared.default;
}

describe('governance/feedback on its README examples (task-096, plan-076 point 8)', () => {
  for (const id of ['defaults', 'with-software']) {
    describe(id, () => {
      it('FA-3: the feedback type requires kind, target, source and context', () => {
        const template = feedbackType(compose(id))['template'];
        const frontmatter = isRecord(template) ? template['frontmatter'] : undefined;
        const required = isRecord(frontmatter) ? frontmatter['required'] : undefined;
        assert.ok(Array.isArray(required), 'template.frontmatter.required is a list');
        for (const field of ['kind', 'target', 'source', 'context']) {
          assert.ok(required.includes(field), `${field} is required`);
        }
      });

      it('FA-4: the triage is the approver\'s gate, a reject back to draft', () => {
        const composed = compose(id);
        const states = feedbackType(composed)['states'];
        const gates = isRecord(states) ? states['gates'] : undefined;
        assert.deepEqual(isRecord(gates) ? gates['pending'] : undefined, { reject: 'draft' });
        const ingest = file(composed, 'workflows/feedback-ingest.yaml')?.data;
        const phases = isRecord(ingest) && Array.isArray(ingest['phases']) ? ingest['phases'] : [];
        const triage = phases.find((phase) => isRecord(phase) && phase['name'] === 'triage');
        assert.ok(isRecord(triage), 'feedback-ingest has a triage phase');
        assert.ok(Array.isArray(triage['actions']) && triage['actions'].includes('memory.approve'));
        assert.deepEqual(triage['approval'], { by_role: 'approver' });
      });

      it('FA-6: the routing table names only base\'s decision-log-ingest and governance-evolution',
        () => {
          const composed = compose(id);
          const directive = file(composed, 'directives/feedback.md')?.text ?? '';
          const start = directive.indexOf('\n## Routes\n');
          assert.ok(start >= 0, 'the feedback directive has a ## Routes section');
          const next = directive.indexOf('\n## ', start + 1);
          const section = directive.slice(start, next < 0 ? undefined : next);
          const workflows = new Map(composed.files.filter((each) => each.path.startsWith(
            'workflows/')).map((each) => [each.path.slice('workflows/'.length, -'.yaml'.length),
            each.pack]));
          const named = new Set([...section.matchAll(/`([^`]+)`/g)].map((match) => match[1] ?? '')
            .filter((token) => workflows.has(token)));
          assert.deepEqual([...named].sort(), ['decision-log-ingest', 'governance-evolution']);
          for (const name of named) assert.equal(workflows.get(name), 'base', name);
        });

      it('FA-6: bug is never an outcome feedback-review selects or the directive lists', () => {
        const composed = compose(id);
        const review = file(composed, 'workflows/feedback-review.yaml')?.data;
        const phases = isRecord(review) && Array.isArray(review['phases']) ? review['phases'] : [];
        const where = isRecord(phases[0]) ? phases[0]['where'] : undefined;
        const outcomes = isRecord(where) ? where['outcome'] : undefined;
        assert.ok(Array.isArray(outcomes) && outcomes.length > 0, 'where.outcome is a list');
        assert.ok(!outcomes.includes('bug'), 'no bug in feedback-review\'s where');
        const value = resolved(id, 'feedback_outcomes');
        assert.ok(!listItems(value).includes('bug'), 'no bug in feedback_outcomes');
        assert.ok((file(composed, 'directives/feedback.md')?.text ?? '').includes(value),
          'the directive lists the resolved feedback_outcomes');
      });
    });
  }

  it('FA-6: no file composed without software names bug-ingest', () => {
    const composed = compose('defaults');
    assert.ok(composed.files.length > 0);
    for (const each of composed.files) {
      assert.ok(!each.text.includes('bug-ingest'), `${each.pack}/${each.path} names bug-ingest`);
    }
  });

  it('FA-1: the entry with software is composed in with-software and absent from defaults', () => {
    const entry = ['workflows/feedback-bug-route.yaml', 'workflows/feedback-bug-item.yaml',
      'directives/feedback-bug-route.md'];
    const withSoftware = compose('with-software');
    for (const path of entry) assert.ok(file(withSoftware, path) !== undefined, path);
    const defaults = compose('defaults');
    for (const path of entry) assert.equal(file(defaults, path), undefined, path);
  });
});
