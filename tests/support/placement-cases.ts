// The placement rule's cases (spec-003 §3.1, task-093 criterion 4), run through both the lint
// (tests/check-packs.test.ts) and the composer (tests/compose-documents.test.ts).

/** The parameters every case's pack declares: a string, an integer, a boolean, a list. */
export const PLACEMENT_PARAMETERS = {
  s: { type: 'string', description: 'x', default: 'a' },
  n: { type: 'integer', description: 'x', default: 2 },
  b: { type: 'boolean', description: 'x', default: true },
  l: { type: 'string', description: 'List of x.', default: 'bug, task' },
};

export interface PlacementCase {
  /** The file of the declaring pack the text is written to. */
  path: 'fragments/dna.yaml' | 'directives/d.md';
  text: string;
  /** For a refused case, how the message names the placement. */
  placement?: string;
}

const dna = (line: string, placement?: string): PlacementCase => ({ path: 'fragments/dna.yaml',
  text: `format: 1\n${line}`, ...placement === undefined ? {} : { placement } });

export const ACCEPTED: PlacementCase[] = [
  dna('x: "{{s}}"\n'), dna('x: "a {{s}} b"\n'), dna('"{{s}}": 1\n'), dna('x: {{n}}\n'),
  dna('x: {{b}}\n'), dna('x: [{{l}}]\n'), dna('x: [ {{l}} ]\n'),
  { path: 'directives/d.md', text: '---\nid: d\nformat: 1\n---\n# d\n\nOne of {{l}}, {{s}}.\n' },
];

export const REFUSED: PlacementCase[] = [
  dna('x: {{s}}\n', 'unquoted'), dna("x: '{{s}}'\n", 'in a single-quoted'),
  dna('x: |\n  {{s}}\n', 'in a block scalar'), dna('x: "y" # {{s}}\n', 'in a comment'),
  dna('x: [{{l}}, y]\n', 'unquoted'), dna('x: [{{s}}]\n', 'unquoted'),
  { path: 'directives/d.md', text: '---\nid: d\ntitle: {{s}}\nformat: 1\n---\n# d\n',
    placement: 'unquoted' },
];
