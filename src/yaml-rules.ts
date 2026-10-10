// spec-001 §18, every file (task-012): an integer value is written as a YAML integer, never as
// `1.0`, `1e0` or in another base, since JSON Schema counts `1.0` as an integer; and no `.nan` or
// `.inf`, which no file of this repository needs (task-006 drops a NaN from a set).
import { isScalar, visit } from 'yaml';

import type { Problem } from './problems';
import type { LoadedYaml } from './yaml-load';

/** A base-10 integer as written in YAML (§8.1, §18), as parameters.ts reads it. */
const INTEGER_SOURCE = /^-?(?:0|[1-9][0-9]*)$/;

/** `firstLine`: the file line of the YAML's first line (2 for a Markdown frontmatter). */
export function yamlProblems(file: string, yaml: LoadedYaml, firstLine = 1): Problem[] {
  const problems: Problem[] = [];
  visit(yaml.document, {
    Scalar(_key, node) {
      if (!isScalar(node) || typeof node.value !== 'number') return;
      const { line, column } = yaml.positionAt(node.range?.[0] ?? 0);
      const where = { file, line: line + firstLine - 1, column };
      const source = node.source ?? String(node.value);
      if (!Number.isFinite(node.value)) {
        problems.push({ ...where, rule: 'nan',
          message: `${source}: no file of this repository holds a NaN or an infinity` });
      } else if (Number.isInteger(node.value) && !INTEGER_SOURCE.test(source)) {
        problems.push({ ...where, rule: 'integer', message: `${source} is an integer value; `
          + 'write it as a YAML integer (spec-001 §18)' });
      }
    },
  });
  return problems;
}
