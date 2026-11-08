// The frontmatter of a Markdown file (a directive, a Memory template): the YAML between a first
// line `---` and the next line `---`, read with the task-002 loader.
import { parseYaml } from './yaml-load';
import type { LoadedYaml } from './yaml-load';

const FRONTMATTER = /^---\n([\s\S]*?\n)?---(?:\n|$)/;

/** The frontmatter as loaded, or undefined when the file has none. */
export function readFrontmatter(text: string, file: string): LoadedYaml | undefined {
  const match = FRONTMATTER.exec(text.replace(/^\uFEFF/, '').replace(/\r\n?/g, '\n'));
  if (match === null) return undefined;
  return parseYaml(match[1] ?? '', file);
}

/**
 * The 0-based index of a Markdown file's first body line: the line after the frontmatter's
 * closing `---`, or 0 when the file has none.
 */
export function bodyStart(text: string): number {
  const match = FRONTMATTER.exec(text.replace(/^\uFEFF/, '').replace(/\r\n?/g, '\n'));
  if (match === null) return 0;
  const lines = match[0].split('\n').length - 1;
  return match[0].endsWith('\n') ? lines : lines + 1;
}
