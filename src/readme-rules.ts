// The README lint rules of spec-002 §2 and §6 CB-1, CB-3 (task-018): headings, generated markers,
// no WingFoil CLI command, the temporary mark, and the links to CATALOG.md. Every rule returns all
// its problems, each with a line; the composer throws the first (spec-001 §18).
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

import { CompatError, loadCompat } from './compat';
import {
  CATALOG_URL, GENERATED_SECTIONS, README_HEADINGS, TEMPORARY_MARK, packAnchor, readmeOutline,
  sectionNumber,
} from './readme';
import type { ReadmeOutline, ReadmeSection } from './readme';
import type { Problem } from './problems';
import { YamlError } from './yaml-load';

interface Reporter {
  (line: number, rule: string, message: string): void;
}

/** True when the tree's compat.yaml loads and one of its releases provides pack-install. */
export function installListed(tree: string): boolean {
  const path = join(tree, 'compat.yaml');
  if (!existsSync(path)) return false;
  try {
    return loadCompat(path).releases.some((release) => release.capabilities.includes('pack-install'));
  } catch (error) {
    if (error instanceof CompatError || error instanceof YamlError) return false;
    throw error;
  }
}

function headingName(number: number): string {
  return number === 1 ? '# <title>' : `## ${README_HEADINGS[number - 2] ?? ''}`;
}

function shown(section: ReadmeSection): string {
  return `${'#'.repeat(section.heading.level)} ${section.heading.text}`.trimEnd();
}

/** Acceptance 5: the nine headings, in order, nothing else, nothing before the title. */
function headingRule(outline: ReadmeOutline, report: Reporter): void {
  const numbered = outline.sections.map((section) => ({ section,
    number: sectionNumber(section.heading) }));
  for (const { section, number } of numbered) {
    if (number === undefined) {
      report(section.heading.line, 'readme-heading', `heading "${shown(section)}" is not one of `
        + 'spec-002 §2.1');
    } else if (number === 1 && section.heading.text === '') {
      report(section.heading.line, 'readme-heading', 'the level-1 heading has no text');
    }
  }
  const seen = new Set<number>();
  let highest = 0;
  for (const { section, number } of numbered) {
    if (number === undefined) continue;
    if (seen.has(number)) {
      report(section.heading.line, 'readme-heading', `heading "${shown(section)}" is duplicated`);
    } else if (number < highest) {
      report(section.heading.line, 'readme-heading', `heading "${shown(section)}" is out of `
        + `order: section ${number} comes before "${headingName(highest)}" (spec-002 §2.1)`);
    }
    seen.add(number);
    highest = Math.max(highest, number);
  }
  for (let number = 1; number <= README_HEADINGS.length + 1; number += 1) {
    if (seen.has(number)) continue;
    const after = numbered.find((entry) => entry.number === undefined || entry.number > number);
    const line = after?.section.heading.line ?? outline.lineCount;
    report(Math.max(line, 1), 'readme-heading', `heading "${headingName(number)}" is missing `
      + '(spec-002 §2.1)');
  }
  const title = numbered.find((entry) => entry.number === 1)?.section.heading;
  if (title === undefined) return;
  const before = outline.scan.lines.find((line) => line.line < title.line
    && line.kind !== 'blank' && line.kind !== 'marker');
  if (before !== undefined) {
    report(before.line, 'readme-heading', 'content comes before the level-1 heading');
  }
}

/** Acceptance 6, malformed lines: a top-level line that looks like a marker and is not one. */
function malformedMarkers(outline: ReadmeOutline, report: Reporter): void {
  for (const line of outline.scan.lines) {
    if (line.container !== 'top' || line.kind === 'code' || line.kind === 'fence'
      || line.kind === 'marker') continue;
    const text = line.raw.trimStart();
    if (text.startsWith('<!-- generated') || text.startsWith('<!--generated')) {
      report(line.line, 'readme-marker', `malformed marker "${line.raw.trim()}": a marker is `
        + '"<!-- generated:begin <name> -->" or "<!-- generated:end <name> -->" (spec-002 §2.2)');
    }
  }
}

interface Pair {
  name: string;
  begin: number;
  end: number;
}

/** Acceptance 6, pairing: known names, no duplicate, no nesting, every begin closed. */
function pairs(outline: ReadmeOutline, report: Reporter): Pair[] {
  const found: Pair[] = [];
  const begun = new Set<string>();
  let open: { name: string; line: number } | undefined;
  for (const marker of outline.markers) {
    const tag = `generated:${marker.verb} ${marker.name}`;
    if (!GENERATED_SECTIONS.has(marker.name)) {
      report(marker.line, 'readme-marker', `marker "${tag}" names no generated section `
        + `(${[...GENERATED_SECTIONS.keys()].join(', ')}; spec-002 §2.2)`);
      continue;
    }
    if (marker.verb === 'begin') {
      if (open !== undefined) {
        report(marker.line, 'readme-marker', `marker "${tag}" is nested in "${open.name}"`);
      } else if (begun.has(marker.name)) {
        report(marker.line, 'readme-marker', `marker "${tag}" is duplicated`);
      } else {
        open = { name: marker.name, line: marker.line };
      }
      begun.add(marker.name);
    } else if (open?.name === marker.name) {
      found.push({ name: open.name, begin: open.line, end: marker.line });
      open = undefined;
    } else {
      report(marker.line, 'readme-marker', `marker "${tag}" closes no open "${marker.name}"`);
    }
  }
  if (open !== undefined) {
    report(open.line, 'readme-marker', `marker "generated:begin ${open.name}" is never closed`);
  }
  return found;
}

/** Acceptance 6, placement: each pair encloses its own heading and the whole of its section. */
function placement(outline: ReadmeOutline, pair: Pair, report: Reporter): boolean {
  const number = GENERATED_SECTIONS.get(pair.name);
  const inside = outline.sections.filter((section) => section.heading.line > pair.begin
    && section.heading.line < pair.end);
  const [own] = inside;
  if (inside.length !== 1 || own === undefined || sectionNumber(own.heading) !== number) {
    report(pair.begin, 'readme-marker', `the "${pair.name}" pair must enclose exactly the heading `
      + `"${headingName(number ?? 0)}" (spec-002 §2.2)`);
    return false;
  }
  const filler = (from: number, to: number): number | undefined => outline.scan.lines
    .find((line) => line.line > from && line.line < to && line.kind !== 'blank'
      && line.kind !== 'marker')?.line;
  const beforeHeading = filler(pair.begin, own.heading.line);
  if (beforeHeading !== undefined) {
    report(beforeHeading, 'readme-marker', `only blank lines may come between "generated:begin `
      + `${pair.name}" and its heading`);
  }
  const afterEnd = filler(pair.end, own.last + 1);
  if (afterEnd !== undefined) {
    report(afterEnd, 'readme-marker', `content after "generated:end ${pair.name}" belongs to the `
      + 'generated section: move it inside the pair or into a written section');
  }
  return true;
}

function markerRule(outline: ReadmeOutline, report: Reporter): void {
  malformedMarkers(outline, report);
  const placed = new Set(pairs(outline, report).filter((pair) => placement(outline, pair, report))
    .map((pair) => pair.name));
  for (const [name, number] of GENERATED_SECTIONS) {
    if (placed.has(name)) continue;
    const section = outline.sections.find((entry) => sectionNumber(entry.heading) === number);
    if (section !== undefined) {
      report(section.heading.line, 'readme-marker', `section "${headingName(number)}" is not `
        + `enclosed by its "${name}" markers (spec-002 §2.2)`);
    }
  }
}

const COMMANDS = ['wingfoil ', 'npx wingfoil', 'npm exec wingfoil', 'npm run wingfoil',
  'npm run -s wingfoil'];
const BARE = new Set(['wingfoil', ...COMMANDS.map((command) => command.trim())]);

function command(text: string): string {
  return text.trimStart().replace(/^\$ /, '');
}

/** Acceptance 7: no WingFoil CLI command in code blocks or code spans. */
function commandRule(outline: ReadmeOutline, report: Reporter): void {
  const message = 'a README holds no WingFoil CLI command; name files and keys (spec-002 §2.3)';
  for (const code of outline.scan.codeLines) {
    const text = command(code.text);
    if (COMMANDS.some((prefix) => text.startsWith(prefix)) || BARE.has(text.trimEnd())) {
      report(code.line, 'readme-command', message);
    }
  }
  for (const span of outline.scan.codeSpans) {
    if (COMMANDS.some((prefix) => command(span.text).startsWith(prefix))) {
      report(span.line, 'readme-command', message);
    }
  }
}

function section(outline: ReadmeOutline, number: number): ReadmeSection | undefined {
  return outline.sections.find((entry) => sectionNumber(entry.heading) === number);
}

/** Acceptance 8: the temporary mark opens section 3 while no release provides pack-install. */
function installMarkRule(outline: ReadmeOutline, listed: boolean, report: Reporter): void {
  const install = section(outline, 3);
  if (listed || install === undefined) return;
  const first = outline.scan.lines.find((line) => line.line > install.heading.endLine
    && line.kind !== 'blank');
  if (first?.raw !== TEMPORARY_MARK || first.line > install.last) {
    report(first?.line ?? install.heading.line, 'readme-install-mark', 'while no compat.yaml '
      + `release provides pack-install, section 3 opens with "${TEMPORARY_MARK}" (spec-002 §2.3)`);
  }
}

function targetsIn(outline: ReadmeOutline, part: ReadmeSection): string[] {
  return outline.scan.links.filter((link) => link.line >= part.heading.line
    && link.line <= part.last).map((link) => link.target);
}

/** Acceptance 9: the Install and catalog-entry links, and no other link to CATALOG.md. */
function linkRule(outline: ReadmeOutline, id: string, report: Reporter): void {
  const install = section(outline, 3);
  if (install !== undefined && !targetsIn(outline, install).includes(`${CATALOG_URL}#install`)) {
    report(install.heading.line, 'readme-link', `section 3 links ${CATALOG_URL}#install `
      + '(spec-002 §2.3)');
  }
  const versions = section(outline, 9);
  if (versions !== undefined) {
    const targets = targetsIn(outline, versions);
    if (!targets.includes('CHANGELOG.md') && !targets.includes('./CHANGELOG.md')) {
      report(versions.heading.line, 'readme-link', 'section 9 links CHANGELOG.md (spec-002 §2.1)');
    }
    const entry = `${CATALOG_URL}#${packAnchor(id)}`;
    if (!targets.includes(entry)) {
      report(versions.heading.line, 'readme-link', `section 9 links ${entry} (spec-002 §2.5)`);
    }
  }
  for (const link of outline.scan.links) {
    const path = link.target.split('#')[0] ?? '';
    const absolute = link.target.startsWith(`${CATALOG_URL}#`)
      && link.target.length > CATALOG_URL.length + 1;
    if (path.endsWith('CATALOG.md') && !absolute) {
      report(link.line, 'readme-link', `link to ${link.target}: a README links CATALOG.md as `
        + `${CATALOG_URL}#<anchor> (spec-002 §2.5)`);
    }
  }
}

/** The README problems of one pack; none when it has no README.md (the layout rule's). */
export function readmeProblems(tree: string, pack: { id: string; path: string },
  listed: boolean): Problem[] {
  const file = `${pack.path}/README.md`;
  if (!existsSync(join(tree, file))) return [];
  const outline = readmeOutline(readFileSync(join(tree, file), 'utf8'));
  const problems: Problem[] = [];
  const report: Reporter = (line, rule, message) => {
    problems.push({ file, line, column: 1, rule, message: `${pack.id}: README.md: ${message}` });
  };
  headingRule(outline, report);
  markerRule(outline, report);
  commandRule(outline, report);
  installMarkRule(outline, listed, report);
  linkRule(outline, pack.id, report);
  return problems;
}
