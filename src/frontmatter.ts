// The frontmatter of a Markdown file (a directive, a Memory template): the YAML between a first
// line `---` and the next line `---`, read with the task-002 loader.
import { parseYaml } from './yaml-load';
import type { LoadedYaml } from './yaml-load';

const FRONTMATTER = /^---\n([\s\S]*?\n)?---(?:\n|$)/;

/** The frontmatter as loaded, or undefined when the file has none. */
export function readFrontmatter(text: string, file: string): LoadedYaml | undefined {
  const match = FRONTMATTER.exec(text.replace(/^\uFEFF/, '').replace(/\r\n/g, '\n'));
  if (match === null) return undefined;
  return parseYaml(match[1] ?? '', file);
}
