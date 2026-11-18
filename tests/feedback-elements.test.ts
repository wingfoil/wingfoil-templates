// task-098 (plan-076 point 5): the [E] criteria of governance/feedback's charter, FA-3 … FA-8. The
// fixture projects under tests/fixtures/feedback-elements/ hold Memory elements written by hand;
// each is composed here, committed in a scratch repository, and read by the generic checks of
// tests/support/fixture-elements.ts through the bindings below.
import { strict as assert } from 'node:assert';
import {
  cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, statSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, relative, sep } from 'node:path';
import { after, describe, it } from 'node:test';

import { loadCatalog } from '../src/catalog';
import { composeDocuments } from '../src/compose-documents';
import { readFrontmatter } from '../src/frontmatter';
import { treeLayout } from '../src/layout-rules';
import { planOutput, writeOutput } from '../src/output';
import { mergeOverlay, openOverlay } from '../src/overlay-tree';
import { loadYamlFile } from '../src/yaml-load';

import {
  allowedValueProblems, backReferenceProblems, listItems, readElements, referenceProblems,
  refusedItemProblems, requiredFieldProblems, stateFieldProblems,
} from './support/fixture-elements';
import type { FixtureElement } from './support/fixture-elements';
import { TestRepo } from './support/git-repo';
import { assertFields, assertSections } from './support/inbox';
import { FIXTURES, FIXTURE_CATALOG, REPO_ROOT } from './support/paths';

const ELEMENTS = join(FIXTURES, 'feedback-elements');
const COMMIT_TOKEN = '@commit@';
const VERSION = 'v1.0.0';
/** The outcomes closed with `n/a — <reason>`: the approver's ruling of 2026-11-18. */
const NO_ROUTE = ['declined', 'duplicate'];

interface Composition {
  packs: string[];
  parameters: Record<string, string | number | boolean>;
}

const PROJECTS: Record<string, { file: string; overlay?: string }> = {
  'defaults': { file: 'examples/feedback/defaults/example.yaml' },
  'with-software': { file: 'examples/feedback/with-software/example.yaml' },
  'added-outcome': { file: 'examples/feedback/added-outcome/example.yaml' },
  'upstream': { file: 'feedback-exit/compositions/upstream/example.yaml',
    overlay: 'tests/fixtures/feedback-exit' },
};

function compositionOf(name: string): Composition {
  const file = PROJECTS[name]?.file ?? '';
  return loadYamlFile(join(FIXTURES, file), file).data as Composition;
}

const scratch = mkdtempSync(join(tmpdir(), 'feedback-elements-'));
const composed = new Map<string, string>();
const repos: TestRepo[] = [];

after(() => {
  for (const repo of repos) repo.dispose();
  rmSync(scratch, { recursive: true, force: true });
});

/** The project's composed output, written once. */
function composedOutput(name: string): string {
  const known = composed.get(name);
  if (known !== undefined) return known;
  const { packs, parameters } = compositionOf(name);
  const catalog = loadCatalog(FIXTURE_CATALOG);
  const out = join(scratch, name);
  const given = PROJECTS[name]?.overlay;
  if (given === undefined) {
    writeOutput(out, planOutput(composeDocuments(REPO_ROOT, catalog, packs, parameters), catalog));
  } else {
    const overlay = openOverlay(REPO_ROOT, given);
    assert.ok('merged' in overlay, 'the overlay opens');
    try {
      overlay.packs = treeLayout(overlay.dir).packs;
      mergeOverlay(REPO_ROOT, overlay);
      writeOutput(out, planOutput(composeDocuments(overlay.merged, catalog, packs, parameters),
        catalog));
    } finally {
      rmSync(overlay.root, { recursive: true, force: true });
    }
  }
  composed.set(name, out);
  return out;
}

/** The files under a directory, relative to it, with `/` separators. */
function filesUnder(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const path = join(dir, entry);
    return statSync(path).isDirectory() ? filesUnder(path) : [path];
  }).map((path) => relative(dir, path).split(sep).join('/')).sort();
}

/** A project in a scratch repository: its elements and `cases`, committed, the commit token set. */
function project(name: string, cases: string[] = []): TestRepo {
  const repo = new TestRepo();
  repos.push(repo);
  cpSync(composedOutput(name), repo.dir, { recursive: true });
  const source = join(ELEMENTS, name);
  const own = filesUnder(source).filter((file) => !file.startsWith('custom/'));
  for (const file of own) repo.write(file, readFileSync(join(source, file)));
  for (const file of cases) {
    repo.write(`docs/memory/feedback/${file}`, readFileSync(join(ELEMENTS, 'invalid', file)));
  }
  const commit = repo.commitAll('the composed project and its elements');
  repo.tag(VERSION);
  for (const file of [...own, ...cases.map((each) => `docs/memory/feedback/${each}`)]) {
    const path = join(repo.dir, file);
    const content = readFileSync(path, 'utf8');
    if (content.includes(COMMIT_TOKEN)) {
      writeFileSync(path, content.replaceAll(COMMIT_TOKEN, commit));
    }
  }
  repo.commitAll('the references to a commit');
  return repo;
}

/** A list parameter's items: the composition's value, else the pack's default. */
function listOf(name: string, parameter: string): string[] {
  const given = compositionOf(name).parameters[parameter];
  if (given !== undefined) return listItems(String(given));
  const manifest = loadYamlFile(join(REPO_ROOT, 'packs', 'governance', 'feedback', 'pack.yaml'),
    'pack.yaml').data as { parameters: Record<string, { default: string }> };
  return listItems(manifest.parameters[parameter]?.default ?? '');
}

/** The composed workflows and their phases. */
function workflowsOf(dir: string): Record<string, string[]> {
  const root = join(dir, '.wingfoil', 'workflows');
  const entries = filesUnder(root).filter((file) => file.endsWith('.yaml')).map((file) => {
    const data = loadYamlFile(join(root, file), file).data as
      { name: string; phases: { name: string }[] };
    return [data.name, data.phases.map((phase) => phase.name)] as const;
  });
  return Object.fromEntries(entries);
}

const isItem = (element: FixtureElement): boolean => element.type === 'feedback';
/** A frontmatter field's text; a field that is no string reads as empty. */
function text(element: FixtureElement, field: string): string {
  const value = element.fields[field];
  return typeof value === 'string' ? value : '';
}
const outcomeOf = (element: FixtureElement): string => text(element, 'outcome');

/** Criterion 5: a declined or duplicate item closes with its reason, there and in its body. */
function declinedProblems(elements: FixtureElement[]): string[] {
  return elements.filter((element) => isItem(element) && element.status === 'closed'
    && NO_ROUTE.includes(outcomeOf(element))).flatMap((element) => {
    const reason = /^n\/a — (\S.*)$/.exec(text(element, 'resulting'))?.[1];
    if (reason === undefined) return [`${element.file}: resulting is not "n/a — <reason>"`];
    return element.body.includes(reason) ? [] : [`${element.file}: its body omits the reason`];
  });
}

type Checks = Record<'read' | 'required' | 'allowed' | 'references' | 'state' | 'back' | 'declined',
  string[]>;

/** Every check of the charter's [E] criteria on one project, by name. */
function checks(name: string, repo: TestRepo): { results: Checks; elements: FixtureElement[] } {
  const dir = repo.dir;
  const { elements, problems } = readElements(dir);
  const software = compositionOf(name).packs.some((pack) => pack.startsWith('software@'));
  const outcomes = [...listOf(name, 'feedback_outcomes'), ...software ? ['bug'] : []];
  const routed = elements.filter((element) => !isItem(element)
    || !NO_ROUTE.includes(outcomeOf(element)));
  const results: Checks = {
    read: problems,
    required: requiredFieldProblems(dir, elements),
    allowed: allowedValueProblems(dir, elements, [
      { type: 'feedback', field: 'kind', allowed: listOf(name, 'feedback_kinds') },
      { type: 'feedback', field: 'target', allowed: listOf(name, 'feedback_targets') },
      { type: 'feedback', field: 'outcome', allowed: outcomes },
    ]),
    references: referenceProblems(dir, elements, [{ type: 'feedback', field: 'context',
      kinds: ['element', 'workflow-phase', 'version', 'commit'], split: true, mode: 'every' }],
    { workflows: workflowsOf(dir), versions: repo.git(['tag', '--list']).split('\n')
      .filter((tag) => tag !== '') }),
    state: stateFieldProblems(dir, routed,
      [{ type: 'feedback', status: 'closed', fields: ['outcome', 'resulting'] }]),
    back: backReferenceProblems(dir, routed,
      [{ type: 'feedback', field: 'resulting', through: 'reported_by' }]),
    declined: declinedProblems(elements),
  };
  return { results, elements };
}

const element = (elements: FixtureElement[], id: string): FixtureElement => {
  const found = elements.find((each) => each.id === id);
  assert.ok(found !== undefined, id);
  return found;
};

describe('the valid fixture projects of governance/feedback (task-098)', () => {
  for (const name of Object.keys(PROJECTS)) {
    it(`${name}: every check passes, and every context names something that resolves`, () => {
      const repo = project(name);
      const { results, elements } = checks(name, repo);
      for (const [check, problems] of Object.entries(results)) {
        assert.deepEqual(problems, [], check);
      }
      const items = elements.filter(isItem);
      assert.ok(items.length > 0, 'the project holds feedback items');
      const ids = elements.map((each) => each.id);
      for (const item of items) {
        const references = listItems(text(item, 'context'));
        assert.ok(references.length > 0, `${item.file}: FA-5, a context on every item`);
        for (const reference of references) {
          if (ids.includes(reference) || reference === VERSION
            || /^[0-9a-f]{40}$/.test(reference)) continue;
          assert.match(reference, /^[a-z-]+\.[a-z-]+$/, `${item.file}: a workflow and its phase`);
        }
      }
    });
  }

  it('together hold each state, each kind of reference and each closed route', () => {
    const all = Object.keys(PROJECTS).flatMap((name) => checks(name, project(name)).elements)
      .filter(isItem);
    assert.deepEqual([...new Set(all.map((item) => item.status))].sort(),
      ['closed', 'draft', 'pending', 'triaged']);
    const closed = all.filter((item) => item.status === 'closed').map(outcomeOf);
    for (const outcome of ['decision-log', 'task', 'declined', 'duplicate', 'upstream-note', 'bug',
      'deferred']) {
      assert.ok(closed.includes(outcome), `a closed item with outcome ${outcome}`);
    }
    const contexts = all.map((item) => listItems(text(item, 'context')));
    const flat = contexts.flat();
    assert.ok(flat.some((each) => /^[0-9a-f]{40}$/.test(each)), 'a commit');
    assert.ok(flat.includes(VERSION), 'a version');
    assert.ok(flat.some((each) => /^[a-z-]+\.[a-z-]+$/.test(each)), 'a workflow and phase');
    assert.ok(flat.some((each) => /^(dl|task|bug|feedback)-\d/.test(each)), 'an element');
    assert.ok(contexts.some((each) => each.length > 1), 'a context holding several');
  });

  it('routes the added outcome to a decision-log naming it (spec-003 §4.3)', () => {
    const { elements } = checks('added-outcome', project('added-outcome'));
    const item = elements.find((each) => isItem(each) && outcomeOf(each) === 'deferred');
    assert.ok(item !== undefined);
    const target = element(elements, text(item, 'resulting'));
    assert.equal(target.type, 'decision-log');
    assert.match(target.body, /deferred/);
  });
});

describe('the invalid fixture elements (task-098, FA-3 … FA-6)', () => {
  const CASES: [string, keyof Checks][] = [
    ['feedback-901-no-kind.md', 'required'],
    ['feedback-902-no-target.md', 'required'],
    ['feedback-903-no-source.md', 'required'],
    ['feedback-904-no-context.md', 'required'],
    ['feedback-905-kind-outside.md', 'allowed'],
    ['feedback-906-target-outside.md', 'allowed'],
    ['feedback-907-outcome-outside.md', 'allowed'],
    ['feedback-908-bug-without-software.md', 'allowed'],
    ['feedback-909-context-unresolved.md', 'references'],
    ['feedback-910-context-partly-unresolved.md', 'references'],
    ['feedback-911-no-resulting.md', 'state'],
    ['feedback-912-no-outcome.md', 'state'],
    ['feedback-913-not-cited.md', 'back'],
    ['feedback-914-names-nothing.md', 'back'],
    ['feedback-915-bare-not-applicable.md', 'declined'],
    ['feedback-916-no-reason-in-body.md', 'declined'],
  ];

  it('covers every file under invalid/', () => {
    assert.deepEqual(filesUnder(join(ELEMENTS, 'invalid')), CASES.map(([file]) => file).sort());
  });

  for (const [file, named] of CASES) {
    it(`${file}: reported by ${named} alone`, () => {
      const { results } = checks('defaults', project('defaults', [file]));
      for (const [check, problems] of Object.entries(results)) {
        if (check === named) {
          assert.equal(problems.length, 1, problems.join('\n'));
          assert.ok(problems[0]?.startsWith(`docs/memory/feedback/${file}: `), problems[0]);
        } else {
          assert.deepEqual(problems, [], check);
        }
      }
    });
  }
});

describe('bug refused in feedback_outcomes (task-098, spec-003 §11)', () => {
  const binding = [{ parameter: 'feedback_outcomes', item: 'bug' }];

  it('in none of this repository\'s presets and examples', () => {
    assert.deepEqual(refusedItemProblems(REPO_ROOT, binding), []);
  });

  it('in an example that adds it', () => {
    const tree = join(scratch, 'refused');
    const file = join(tree, 'tests', 'fixtures', 'examples', 'pack', 'one', 'example.yaml');
    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(file, 'parameters:\n  feedback_outcomes: "decision-log, bug"\n');
    const problems = refusedItemProblems(tree, binding);
    assert.equal(problems.length, 1, problems.join('\n'));
    assert.match(problems[0] ?? '', /example\.yaml: parameter feedback_outcomes holds bug/);
  });
});

describe('FA-7: feedback evolves the governance and the product (task-098)', () => {
  it('governance: an item, governance-evolution\'s decision-log, a custom/ change citing it',
    () => {
    const repo = project('defaults');
    const { elements } = checks('defaults', repo);
    const item = element(elements, 'feedback-004-triage-rule');
    const log = element(elements, text(item, 'resulting'));
    assert.equal(log.type, 'decision-log');
    assert.ok(log.body.includes(item.id), 'the decision-log cites the item');
    assert.ok(log.body.includes('governance-evolution.propose'), 'and comes from that step');

    const custom = join(ELEMENTS, 'defaults', 'custom');
    const path = '.wingfoil/directives/custom/triage-rule.md';
    const directive = readFileSync(join(custom, 'triage-rule.md'), 'utf8');
    assert.ok(directive.includes(log.id), 'the custom directive cites the decision-log');
    repo.write(path, directive);
    repo.commitAll(readFileSync(join(custom, 'commit-message.txt'), 'utf8').trim());
    assert.ok(repo.git(['log', '--format=%B', '--', path]).includes(log.id),
      'the commit touching the file cites the decision-log');
  });

  it('product, with software: an item routed to a bug that cites it', () => {
    const { elements } = checks('with-software', project('with-software'));
    const item = element(elements, 'feedback-001-export-crash');
    assert.equal(outcomeOf(item), 'bug');
    const bug = element(elements, text(item, 'resulting'));
    assert.equal(bug.type, 'bug');
    assert.ok(bug.body.includes(item.id), 'the bug cites the item');
  });

  it('without software: a decision-log, both naming the would-be bug', () => {
    const { elements } = checks('defaults', project('defaults'));
    const item = element(elements, 'feedback-005-would-be-bug');
    assert.equal(outcomeOf(item), 'decision-log');
    const log = element(elements, text(item, 'resulting'));
    assert.equal(log.type, 'decision-log');
    assert.ok(log.body.includes(item.id), 'the decision-log cites the item');
    for (const body of [item.body, log.body]) assert.match(body, /would-be bug/);
  });
});

describe('FA-8: the upstream note (task-098)', () => {
  it('holds dl-163\'s subset at the path the channel states, and cites the item', () => {
    const repo = project('upstream');
    const { results, elements } = checks('upstream', repo);
    assert.deepEqual(results.back, []);
    const item = elements.find((each) => isItem(each) && outcomeOf(each) === 'upstream-note');
    assert.ok(item !== undefined);
    assert.equal(item.status, 'closed');
    assert.equal(item.fields['target'], 'upstream:plover-vendor');
    const file = `docs/upstream/plover/${item.id}.md`;
    assert.equal(item.fields['resulting'], file);
    assert.ok(existsSync(join(repo.dir, file)), file);
    const note = readFileSync(join(repo.dir, file), 'utf8');
    const fields = readFrontmatter(note, file)?.data as Record<string, unknown> | undefined;
    assert.ok(fields !== undefined, 'the note has a frontmatter');
    const body = note.slice(note.indexOf('\n---\n', 4) + 5);
    const notes = [{ file, fields, body }];
    assertFields(notes);
    assertSections(notes);
    assert.ok(body.includes(item.id), 'its body cites the item');
  });
});
