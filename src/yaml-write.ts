// The one way the composer writes YAML (adr-003): fixed stringify options, so that the bytes of a
// composed file never depend on a library default. Golden-file tests pin them.
import { stringify } from 'yaml';

const OPTIONS = {
  indent: 2,
  indentSeq: true,
  lineWidth: 0,
  minContentWidth: 0,
  directives: false,
} as const;

export function toYaml(doc: unknown): string {
  return stringify(doc, OPTIONS);
}
