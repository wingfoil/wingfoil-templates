// task-104 (plan-086 point 2): the [V] checks of governance/wingfoil-dogfood's charter on its files
// and on the composed output of its README examples: WD-2 (no project value, no WingFoil command in
// the directives as written, two parameter sets), WD-3 (spec-003 §11's channel checks) and the
// roles bindings (spec-001 §7.4).
import { strict as assert } from 'node:assert';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, it } from 'node:test';

import { loadCatalog } from '../src/catalog';
import { composeDocuments } from '../src/compose-documents';
import type { ComposedDocuments } from '../src/compose-documents';
import {
  channelConflicts, channelProblems, isChannel, servedTargets,
} from '../src/feedback-channel';
import type { DirectiveFile } from '../src/feedback-channel';
import { scanMarkdown } from '../src/markdown-lines';
import { isCliCommand } from '../src/readme-rules';
import { loadYamlFile } from '../src/yaml-load';

import { FIXTURE_CATALOG, REPO_ROOT } from './support/paths';

const PACK = 'governance/wingfoil-dogfood';
const PACK_DIR = join(REPO_ROOT, 'packs', PACK);
const EXAMPLES = join(REPO_ROOT, 'tests', 'fixtures', 'examples', 'wingfoil-dogfood');
const IDS = ['defaults', 'with-software'];
/** This repository's own values, which no default and no directive text may hold (WD-2). */
const PROJECT_VALUES = ['svc-018'];

interface Example {
  packs: string[];
  parameters: Record<string, string | number | boolean>;
}

interface Manifest {
  requires: string[];
  parameters: Record<string, { type: string; default?: string }>;
}

function example(id: string): Example {
  return loadYamlFile(join(EXAMPLES, id, 'example.yaml'), `${id}/example.yaml`).data as Example;
}

function manifest(): Manifest {
  return loadYamlFile(join(PACK_DIR, 'pack.yaml'), 'pack.yaml').data as Manifest;
}

function compose(id: string): ComposedDocuments {
  const data = example(id);
  return composeDocuments(REPO_ROOT, loadCatalog(FIXTURE_CATALOG), data.packs, data.parameters);
}

/** The pack's directive files as written, before substitution. */
function directiveFiles(): DirectiveFile[] {
  return readdirSync(join(PACK_DIR, 'directives')).filter((name) => name.endsWith('.md')).sort()
    .map((name) => ({ path: `directives/${name}`, file: `packs/${PACK}/directives/${name}`,
      text: readFileSync(join(PACK_DIR, 'directives', name), 'utf8') }));
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

describe('governance/wingfoil-dogfood on its files and README examples (task-104)', () => {
  it('WD-2: wingfoil_command has no default, and no default is a project value or a command',
    () => {
      const parameters = manifest().parameters;
      assert.ok(parameters['wingfoil_command'] !== undefined, 'wingfoil_command is declared');
      assert.equal(parameters['wingfoil_command'].default, undefined);
      for (const [name, declared] of Object.entries(parameters)) {
        const value = declared.default ?? '';
        for (const project of PROJECT_VALUES) {
          assert.ok(!value.includes(project), `${name}'s default holds ${project}`);
        }
        assert.ok(!isCliCommand(value, false), `${name}'s default is a WingFoil command`);
      }
    });

  it('WD-2: the directives as written hold no project value and no WingFoil command', () => {
    const files = directiveFiles();
    assert.deepEqual(files.map((each) => each.path),
      ['directives/wingfoil-channel.md', 'directives/wingfoil-cli.md']);
    for (const each of files) {
      for (const project of PROJECT_VALUES) {
        assert.ok(!each.text.includes(project), `${each.path} holds ${project}`);
      }
      const scan = scanMarkdown(each.text);
      for (const span of scan.codeSpans) {
        assert.ok(!isCliCommand(span.text, false),
          `${each.path}:${String(span.line)}: a code span is a WingFoil command`);
      }
      for (const line of scan.codeLines) {
        assert.ok(!isCliCommand(line.text, true),
          `${each.path}:${String(line.line)}: a code line is a WingFoil command`);
      }
    }
  });

  it('WD-2: the two examples set different parameter values, and both compose', () => {
    const [first, second] = IDS.map((id) => example(id).parameters);
    assert.ok(first !== undefined && second !== undefined);
    const names = ['wingfoil_inbox_path', 'wingfoil_known_behaviours_path'];
    assert.ok(names.some((name) => first[name] !== second[name]),
      'the examples differ in a path parameter of the pack');
    for (const id of IDS) {
      const composed = compose(id);
      assert.ok(composed.files.some((each) => each.pack === PACK), `${id} composes the pack`);
      for (const project of PROJECT_VALUES) {
        for (const each of composed.files.filter((file) => file.pack === PACK)) {
          assert.ok(!each.text.includes(project), `${id}: ${each.path} holds ${project}`);
        }
      }
    }
  });

  it('WD-3: the pack\'s channel passes the per-pack rule and serves upstream:wingfoil alone',
    () => {
      const requiredIds = manifest().requires.map((entry) => entry.split('@')[0] ?? entry);
      assert.deepEqual(requiredIds, ['base', 'governance/feedback']);
      const files = directiveFiles();
      assert.deepEqual(channelProblems({ id: PACK, requiredIds }, files), []);
      const channels = files.filter(isChannel);
      assert.deepEqual(channels.map((each) => each.path), ['directives/wingfoil-channel.md']);
      assert.deepEqual(servedTargets(channels[0]?.text ?? ''), ['upstream:wingfoil']);
    });

  for (const id of IDS) {
    describe(id, () => {
      it('WD-3: no two channels of the composition serve one target', () => {
        // As `validate` maps the composed `.wingfoil/directives/built-in/*.md` (src/validate.ts).
        const files = compose(id).files.filter((each) => each.path.startsWith('directives/')
          && each.path.endsWith('.md')).map((each) => ({ path: each.path,
          file: `directives/built-in/${each.path.slice('directives/'.length)}`,
          text: each.text }));
        assert.ok(files.some(isChannel), 'the composition holds a channel');
        assert.deepEqual(channelConflicts(files), []);
      });

      it('the bindings: wingfoil-cli global, wingfoil-channel under facilitator', () => {
        const roles = compose(id).roles;
        const global = roles['global'];
        assert.ok(Array.isArray(global) && global.includes('wingfoil-cli'),
          'wingfoil-cli is in global');
        const assignments = roles['assignments'];
        const facilitator = isRecord(assignments) ? assignments['facilitator'] : undefined;
        assert.ok(Array.isArray(facilitator) && facilitator.includes('wingfoil-channel'),
          'wingfoil-channel is assigned to facilitator');
      });
    });
  }
});
