// F3.5, no contradictions between overlays (task-012, the approver's ruling of 2026-10-09): for
// every methodology M, team-mode T or none and stage S or none, except none and none, base + M + T
// + S is composed as the composer composes it (merge §7.2–§7.5 and the output plan §7.6, §7.7, in
// memory), and a refusal is a problem. Every other pack no combination reaches is composed once,
// as base + the first methodology + the pack, so that its fragments get the composer's checks too.
// A pack that already has a problem is left out: its own rule has reported it.
import type { LintContext } from './check-packs';
import type { Catalog } from './catalog';
import { composeDocuments } from './compose-documents';
import { CompositionError } from './composition-error';
import { OutputError, planOutput } from './output';
import { placeholderOf, reachable } from './pack-files';
import type { LintPack } from './pack-files';
import type { Problem } from './problems';
import { ResolveError, resolve } from './resolve';

function byBytes(a: string, b: string): number {
  return Buffer.compare(Buffer.from(a), Buffer.from(b));
}

function ofAxis(packs: LintPack[], axis: string): LintPack[] {
  return packs.filter((pack) => pack.manifest.axis === axis);
}

/** The refusal of composing a request, or undefined when it composes. */
function refusal(tree: string, catalog: Catalog, request: string[]): string | undefined {
  try {
    const given: Record<string, unknown> = {};
    for (const pack of resolve(tree, catalog, request)) {
      for (const [name, declaration] of Object.entries(pack.manifest.parameters ?? {})) {
        if (declaration.default === undefined) given[name] = placeholderOf(declaration.type);
      }
    }
    planOutput(composeDocuments(tree, catalog, request, given), catalog);
    return undefined;
  } catch (error) {
    if (error instanceof ResolveError || error instanceof CompositionError
      || error instanceof OutputError) return error.message;
    throw error;
  }
}

export function overlayProblems(context: LintContext, earlier: Problem[]): Problem[] {
  const { catalog, tree } = context;
  if (catalog === undefined || !context.packs.has(catalog.foundation)) return [];
  const troubled = new Set([...context.packs.values()]
    .filter((pack) => earlier.some((problem) => problem.file.startsWith(`${pack.path}/`)))
    .map((pack) => pack.id));
  const sound = [...context.packs.values()].sort((a, b) => byBytes(a.id, b.id))
    .filter((pack) => !reachable(pack, context.packs).some((id) => troubled.has(id))
      && !troubled.has(catalog.foundation));
  const methodologies = ofAxis(sound, 'methodology');
  const teamModes = [undefined, ...ofAxis(sound, 'team-mode')];
  const stages = [undefined, ...ofAxis(sound, 'stage')];
  const problems: Problem[] = [];
  const reached = new Set<string>();
  const compose = (request: LintPack[], rule: string, blamed: LintPack[]): void => {
    const ids = request.map((pack) => pack.id);
    for (const pack of request) for (const id of reachable(pack, context.packs)) reached.add(id);
    const message = refusal(tree, catalog, ids);
    if (message === undefined) return;
    for (const pack of blamed) {
      problems.push({ file: `${pack.path}/pack.yaml`, rule,
        message: `${[catalog.foundation, ...ids].join(' + ')}: ${message}` });
    }
  };
  for (const methodology of methodologies) {
    for (const teamMode of teamModes) {
      for (const stage of stages) {
        const overlays = [teamMode, stage].filter((pack) => pack !== undefined);
        if (overlays.length > 0) compose([methodology, ...overlays], 'overlay', overlays);
      }
    }
  }
  const [first] = methodologies;
  if (first === undefined) return problems;
  for (const pack of sound) {
    if (reached.has(pack.id)) continue;
    // base comes with every composition; a methodology is composed alone (one per composition).
    const request = pack.id === catalog.foundation ? [first]
      : pack.manifest.axis === 'methodology' ? [pack] : [first, pack];
    compose(request, 'compose', [pack]);
  }
  return problems;
}
