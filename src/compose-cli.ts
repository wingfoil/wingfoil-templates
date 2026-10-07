// `npm run compose -- --tree <dir> --out <dir> [--param <name>=<value>]… <entry>…`: the reference
// composer (adr-001) from the command line. The catalog is the tree's catalog.yaml. Exit 0; 1 on a
// composition, resolution or catalog error; 2 on an I/O error or a non-empty --out; 3 on bad usage.
import { join } from 'node:path';
import { parseArgs } from 'node:util';

import { CatalogError, loadCatalog } from './catalog';
import { composeDocuments } from './compose-documents';
import { CompositionError } from './composition-error';
import { OutputError, planOutput, writeOutput } from './output';
import { ResolveError } from './resolve';
import { YamlError } from './yaml-load';

const USAGE = 'usage: compose --tree <dir> --out <dir> [--param <name>=<value>]... <entry>...';

class UsageError extends Error {}

interface Outcome {
  code: number;
  message?: string;
}

function parameters(raw: string[]): Record<string, string> {
  const values: Record<string, string> = {};
  for (const entry of raw) {
    const at = entry.indexOf('=');
    if (at <= 0) throw new UsageError(`--param ${JSON.stringify(entry)} is not <name>=<value>`);
    const name = entry.slice(0, at);
    if (Object.hasOwn(values, name)) throw new UsageError(`--param ${name} is given twice`);
    values[name] = entry.slice(at + 1);
  }
  return values;
}

function parseCompose(argv: string[]) {
  return parseArgs({
    args: argv,
    options: {
      tree: { type: 'string' },
      out: { type: 'string' },
      param: { type: 'string', multiple: true },
    },
    allowPositionals: true,
    strict: true,
  });
}

function compose(argv: string[]): void {
  let parsed: ReturnType<typeof parseCompose>;
  try {
    parsed = parseCompose(argv);
  } catch (error) {
    throw new UsageError(error instanceof Error ? error.message : String(error));
  }
  const { tree, out, param } = parsed.values;
  if (tree === undefined || out === undefined || parsed.positionals.length === 0) {
    throw new UsageError('--tree, --out and at least one entry are required');
  }
  const given = parameters(param ?? []);
  const catalog = loadCatalog(join(tree, 'catalog.yaml'));
  const composed = composeDocuments(tree, catalog, parsed.positionals, given,
    { givenAsText: true });
  writeOutput(out, planOutput(composed, catalog));
}

export function runCompose(argv: string[]): Outcome {
  try {
    compose(argv);
    return { code: 0 };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (error instanceof UsageError) return { code: 3, message: `${message}\n${USAGE}` };
    if (error instanceof OutputError) return { code: 2, message };
    if (error instanceof YamlError) return { code: error.reason === 'syntax' ? 1 : 2, message };
    if (error instanceof CompositionError || error instanceof ResolveError) {
      return { code: 1, message };
    }
    if (error instanceof CatalogError) return { code: 1, message };
    throw error;
  }
}

if (require.main === module) {
  const outcome = runCompose(process.argv.slice(2));
  if (outcome.message !== undefined) process.stderr.write(`${outcome.message}\n`);
  process.exitCode = outcome.code;
}
