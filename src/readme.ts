// The pack README of spec-002 §2 (task-018): its nine sections, the generated pairs, the temporary
// mark and the links to CATALOG.md. `readmeOutline` is the one reading of a README's structure:
// the lint checks it (readme-rules.ts) and `npm run index` rewrites between the pairs it finds.
import { MARKER, scanMarkdown } from './markdown-lines';
import type { MarkdownHeading, MarkdownScan } from './markdown-lines';

/** The level-2 headings of spec-002 §2.1, after the level-1 title (section 1). */
export const README_HEADINGS: readonly string[] = [
  'When to use it', 'Install and update', 'Composition', 'What it adds', 'Parameters',
  'Examples', 'Sources and adaptations', 'Versions',
];

/** The generated sections (§2.2) and the section number (1-based, §2.1) each one encloses. */
export const GENERATED_SECTIONS: ReadonlyMap<string, number> = new Map([
  ['title', 1], ['composition', 4], ['what-it-adds', 5], ['parameters', 6],
]);

export const TEMPORARY_MARK = '> **Temporary:** these hand steps are replaced by WingFoil\'s '
  + 'commands once a release provides them.';

export const CATALOG_URL = 'https://github.com/wingfoil/wingfoil-templates/blob/main/CATALOG.md';

/** The anchor of a pack's row in CATALOG.md (§3.2), which section 9 links. */
export function packAnchor(id: string): string {
  return `pack-${id.replaceAll('/', '-')}`;
}

/** The section number (1-based, §2.1) a heading names, or undefined for another heading. */
export function sectionNumber(heading: MarkdownHeading): number | undefined {
  if (heading.level === 1) return 1;
  const index = README_HEADINGS.indexOf(heading.text);
  return heading.level === 2 && index >= 0 ? index + 2 : undefined;
}

export interface ReadmeSection {
  heading: MarkdownHeading;
  /** The last line of the section: the line before the next top-level H1 or H2, or the last. */
  last: number;
}

export interface Marker {
  line: number;
  verb: 'begin' | 'end';
  name: string;
}

export interface ReadmeOutline {
  scan: MarkdownScan;
  /** The number of lines of the README. */
  lineCount: number;
  /** Every top-level H1 and H2, in order, with the extent of its section. */
  sections: ReadmeSection[];
  markers: Marker[];
}

export function readmeOutline(text: string): ReadmeOutline {
  const scan = scanMarkdown(text);
  const lineCount = scan.lines.length;
  const tops = scan.headings.filter((heading) => heading.container === 'top' && heading.level <= 2);
  const sections = tops.map((heading, index) => ({
    heading,
    last: (tops[index + 1]?.line ?? lineCount + 1) - 1,
  }));
  const markers = scan.lines.filter((line) => line.kind === 'marker').flatMap((line) => {
    const match = MARKER.exec(line.raw);
    return match === null ? [] : [{ line: line.line, verb: match[1] as 'begin' | 'end',
      name: match[2] ?? '' }];
  });
  return { scan, lineCount, sections, markers };
}
