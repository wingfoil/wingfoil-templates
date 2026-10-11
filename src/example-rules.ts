// The lint rules of examples as fixtures (spec-002 §2.4, §6 CB-2; task-022): section 7 of every
// pack README (`example-section`) and the fixtures under tests/fixtures/examples/
// (`example-fixture`). A rule group of the tree: the composer, which composes packs, not examples,
// does not apply it.
import { existsSync, lstatSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

import type { LintContext } from './check-packs';
import { EXAMPLES, EXEMPTION } from './examples';
import { treeLayout } from './layout-rules';
import type { LintPack } from './pack-files';
import type { Problem } from './problems';
import { readmeOutline, sectionNumber } from './readme';
import type { ReadmeOutline } from './readme';
import { parseEntry } from './requirements';
import { repositorySchemas } from './schemas';
import { presetChecks } from './tree-rules';
import { YamlError, loadYamlFile } from './yaml-load';
import type { LoadedYaml } from './yaml-load';
import { yamlProblems } from './yaml-rules';

const NAME = /^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/;

type Doc = Record<string, unknown>;

function byBytes(a: string, b: string): number {
  return Buffer.compare(Buffer.from(a), Buffer.from(b));
}

function isDirectory(path: string): boolean {
  return existsSync(path) && lstatSync(path).isDirectory();
}

function isFile(path: string): boolean {
  return existsSync(path) && lstatSync(path).isFile();
}

interface Named {
  pack: LintPack;
  /** The examples its README names. */
  examples: Set<string>;
}

class Checker {
  readonly problems: Problem[] = [];
  /** Pack name → the pack and the examples its README names. */
  readonly named = new Map<string, Named>();

  /**
   * The names of the packs the lint skips as a whole (their pack.yaml fails its schema): their
   * examples are not judged either.
   */
  private readonly skipped: Set<string>;

  constructor(private readonly context: LintContext, private readonly holdsMethodology: boolean) {
    this.skipped = new Set(treeLayout(context.tree).packs.filter((id) => !context.packs.has(id))
      .map((id) => id.slice(id.lastIndexOf('/') + 1)));
  }

  private report(file: string, line: number | undefined, rule: string, message: string): void {
    this.problems.push(line === undefined ? { file, rule, message }
      : { file, line, column: 1, rule, message });
  }

  /** Section 7 of one pack's README (acceptance 3, 5). */
  section(pack: LintPack): void {
    const file = `${pack.path}/README.md`;
    const name = pack.manifest.name;
    // A pack with no README.md is the layout rule's: its examples are not judged.
    if (!isFile(join(this.context.tree, file))) {
      this.skipped.add(name);
      return;
    }
    this.named.set(name, { pack, examples: new Set() });
    const outline = readmeOutline(readFileSync(join(this.context.tree, file), 'utf8'));
    const section = outline.sections.find((entry) => sectionNumber(entry.heading) === 7);
    if (section === undefined) return;
    const inSection = (line: number): boolean => line > section.heading.endLine
      && line <= section.last;
    const examples = outline.scan.headings.filter((heading) => heading.level === 3
      && heading.container === 'top' && inSection(heading.line));
    const content = outline.scan.lines.filter((line) => inSection(line.line)
      && line.raw.trim() !== '' && line.kind !== 'marker');
    const say = (line: number, message: string): void => this.report(file, line, 'example-section',
      `${pack.id}: README.md: ${message} (spec-002 §2.4)`);
    const [first] = examples;
    if (first === undefined) {
      const [only] = content;
      if (content.length === 1 && only?.raw === EXEMPTION) {
        if (this.holdsMethodology) {
          say(only.line, 'the tree holds a methodology, so section 7 gives examples, not the '
            + 'exemption line');
        }
      } else {
        say(section.heading.line, `section 7 holds neither examples nor "${EXEMPTION}"`);
      }
      return;
    }
    const before = content.find((line) => line.line < first.line);
    if (before !== undefined) say(before.line, 'only blank lines come before the first example');
    const seen = new Set<string>();
    for (const heading of examples) {
      if (!NAME.test(heading.text)) {
        say(heading.line, `example "${heading.text}" is not a name of spec-001 §4's grammar`);
        continue;
      }
      if (seen.has(heading.text)) {
        say(heading.line, `example "${heading.text}" is duplicated`);
        continue;
      }
      seen.add(heading.text);
      this.fixtureLine(outline, pack, heading.text, heading.endLine, section.last);
    }
  }

  private fixtureLine(outline: ReadmeOutline, pack: LintPack, example: string, after: number,
    last: number): void {
    const file = `${pack.path}/README.md`;
    const name = pack.manifest.name;
    const expected = `Fixture: ${EXAMPLES}/${name}/${example}/`;
    const line = outline.scan.lines.find((entry) => entry.line > after && entry.line <= last
      && entry.raw.trim() !== '');
    if (line?.raw !== expected) {
      this.report(file, line?.line ?? after, 'example-section', `${pack.id}: README.md: example `
        + `"${example}" names its fixture on its first line: "${expected}" (spec-002 §2.4)`);
      return;
    }
    this.named.get(name)?.examples.add(example);
    if (!isFile(join(this.context.tree, EXAMPLES, name, example, 'example.yaml'))) {
      this.report(file, line.line, 'example-fixture', `${pack.id}: example "${example}" has no `
        + `fixture ${EXAMPLES}/${name}/${example}/example.yaml (spec-002 §6 CB-2)`);
    }
  }

  /** The layout of tests/fixtures/examples/ and every fixture in it (acceptance 4, 5). */
  layout(): void {
    const root = join(this.context.tree, EXAMPLES);
    if (!existsSync(root)) return;
    if (!isDirectory(root)) {
      this.report(EXAMPLES, undefined, 'example-fixture', `${EXAMPLES} is not a directory`);
      return;
    }
    for (const name of readdirSync(root).sort(byBytes)) {
      const rel = `${EXAMPLES}/${name}`;
      if (this.skipped.has(name)) continue;
      const named = this.named.get(name);
      if (!isDirectory(join(root, name)) || named === undefined) {
        this.report(rel, undefined, 'example-fixture', `${rel}: not the examples of a pack of the `
          + 'tree; tests/fixtures/examples/ holds <pack name>/<example>/ directories only');
        continue;
      }
      for (const example of readdirSync(join(root, name)).sort(byBytes)) {
        this.fixture(named, example);
      }
    }
  }

  private fixture(named: Named, example: string): void {
    const rel = `${EXAMPLES}/${named.pack.manifest.name}/${example}`;
    const dir = join(this.context.tree, rel);
    if (!isDirectory(dir) || !named.examples.has(example)) {
      this.report(rel, undefined, 'example-fixture', `${rel}: no example of ${named.pack.id}'s `
        + 'README names it (spec-002 §6 CB-2)');
      return;
    }
    for (const entry of readdirSync(dir).sort(byBytes)) {
      if (entry !== 'example.yaml') {
        this.report(`${rel}/${entry}`, undefined, 'example-fixture', `${rel}/${entry}: an example `
          + 'directory holds example.yaml only');
      }
    }
    const file = `${rel}/example.yaml`;
    if (isFile(join(dir, 'example.yaml'))) this.content(named.pack, example, file);
  }

  private content(pack: LintPack, example: string, file: string): void {
    let yaml: LoadedYaml;
    try {
      yaml = loadYamlFile(join(this.context.tree, file), file);
    } catch (error) {
      if (!(error instanceof YamlError) || error.reason === 'io') throw error;
      this.report(file, undefined, 'example-fixture', error.message);
      return;
    }
    const at = (pointer: string, message: string): void => {
      const { line, column } = yaml.positionOf(pointer);
      this.problems.push({ file, line, column, rule: 'example-fixture', message: `${file}: ${message}` });
    };
    const errors = repositorySchemas().validate('preset', yaml.data);
    for (const error of errors) at(error.instancePath, `${error.message} (schema/preset.schema.json)`);
    this.problems.push(...yamlProblems(file, yaml));
    if (errors.length > 0) return;
    const data = yaml.data as Doc;
    if (data['id'] !== example) at('/id', `id must be the example's name, ${example}`);
    if (Object.hasOwn(data, 'profile')) at('/profile', 'an example names no profile (spec-002 §2.4)');
    const ids = (Array.isArray(data['packs']) ? data['packs'] : []).flatMap((entry) => {
      try {
        return [parseEntry(String(entry), 'requires').id];
      } catch {
        return [];
      }
    });
    if (!ids.includes(pack.id)) at('/packs', `packs must contain ${pack.id}, the pack it shows`);
    this.problems.push(...presetChecks(this.context, yaml, 'example-fixture'));
  }
}

/** The rule group of this module, for check-packs.ts. */
export function exampleProblems(context: LintContext): Problem[] {
  const packs = [...context.packs.values()].sort((a, b) => byBytes(a.id, b.id));
  const checker = new Checker(context, packs.some((pack) => pack.id.startsWith('methodology/')));
  for (const pack of packs) checker.section(pack);
  checker.layout();
  return checker.problems;
}
