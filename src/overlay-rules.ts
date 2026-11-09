// F3.5, no contradictions between overlays (task-012, the approver's ruling of 2026-10-09): for
// every methodology M, team-mode T or none and stage S or none, except none and none, base + M + T
// + S is composed as the composer composes it (merge §7.2–§7.5 and the output plan §7.6, §7.7, in
// memory), and a refusal is a problem. Without software no methodology is needed (spec-001 §3,
// task-031), so base + T + S is composed too when neither overlay needs software. D6's pairs
// follow (spec-001 §15, dl-025 D6, task-087): a pack declaring tensions with each pack they name,
// and every pack with each stage overlay. Every other pack no combination reaches is composed
// once: base alone; a pack that does not need software, with base; one that does, with the first
// methodology, and not at all when the tree holds none. A combination holding a conditional part
// is also composed with every entry's pack and with each left out in turn (task-032, task-087). A
// request composed already, or one the format forbids, is not composed again. A pack that already
// has a problem is left out: its own rule has reported it.
import type { LintContext } from './check-packs';
import { corePack, softwarePack } from './catalog';
import type { Catalog } from './catalog';
import { composeDocuments } from './compose-documents';
import { entryTargets } from './coverage';
import { CompositionError } from './composition-error';
import { OutputError, planOutput } from './output';
import { placeholderOf, reachable } from './pack-files';
import { conditionalEntries } from './pack-rules';
import type { LintPack } from './pack-files';
import type { Problem } from './problems';
import { parseEntry } from './requirements';
import { ResolveError, forbiddenBy, resolve } from './resolve';

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
  if (catalog === undefined || !context.packs.has(corePack(catalog))) return [];
  const troubled = new Set([...context.packs.values()]
    .filter((pack) => earlier.some((problem) => problem.file.startsWith(`${pack.path}/`)))
    .map((pack) => pack.id));
  const sound = [...context.packs.values()].sort((a, b) => byBytes(a.id, b.id))
    .filter((pack) => !reachable(pack, context.packs).some((id) => troubled.has(id))
      && !troubled.has(corePack(catalog)));
  const methodologies = ofAxis(sound, 'methodology');
  const teamModes = [undefined, ...ofAxis(sound, 'team-mode')];
  const stages = [undefined, ...ofAxis(sound, 'stage')];
  const problems: Problem[] = [];
  const reached = new Set<string>();
  /** The resolved pack ids of each request composed in this run, as keys (task-087). */
  const composed = new Set<string>();
  const closure = (request: LintPack[]): string[] => [...new Set([corePack(catalog),
    ...request.flatMap((pack) => reachable(pack, context.packs))])].sort(byBytes);
  const compose = (request: LintPack[], rule: string, blamed: LintPack[]): void => {
    const key = closure(request).join(' ');
    if (composed.has(key)) return;
    composed.add(key);
    const ids = request.map((pack) => pack.id);
    for (const pack of request) for (const id of reachable(pack, context.packs)) reached.add(id);
    const message = refusal(tree, catalog, ids);
    if (message === undefined) return;
    for (const pack of blamed) {
      problems.push({ file: `${pack.path}/pack.yaml`, rule,
        message: `${[corePack(catalog), ...ids].join(' + ')}: ${message}` });
    }
  };
  const needsSoftware = (pack: LintPack): boolean =>
    reachable(pack, context.packs).includes(softwarePack(catalog));
  const conflicting = (a: LintPack, b: LintPack): boolean => (a.manifest.conflicts ?? [])
    .some((entry) => parseEntry(entry, 'conflicts').id === b.id);
  /**
   * A request that needs software and holds no methodology takes the first methodology no pack of
   * it conflicts with, either way, and none of `excluded`, placed after the first `lead` packs
   * (a target's added ones, as the leg with software placed it); undefined when there is none.
   */
  const withMethodology = (request: LintPack[], excluded: string[] = [], lead = 0):
  LintPack[] | undefined => {
    const ids = closure(request);
    if (!ids.includes(softwarePack(catalog))
      || ids.some((id) => context.packs.get(id)?.manifest.axis === 'methodology')) return request;
    const allowed = methodologies.find((methodology) => !excluded.includes(methodology.id)
      && !request.some((pack) => conflicting(pack, methodology) || conflicting(methodology, pack)));
    return allowed === undefined ? undefined
      : [...request.slice(0, lead), allowed, ...request.slice(lead)];
  };
  /** Whether §3's cardinalities or §6.3's conflicts forbid a request (plan-066 ruling 3). */
  const forbidden = (request: LintPack[]): boolean => {
    try {
      return forbiddenBy(tree, catalog, request.map((pack) => pack.id)).reason !== undefined;
    } catch (error) {
      if (error instanceof ResolveError) return false;
      throw error;
    }
  };
  const soundIds = new Set(sound.map((pack) => pack.id));
  /**
   * spec-001 §15, §18 (task-087): a combination holding conditional packs is also composed with
   * every entry's pack, then with each left out in turn; a target needing software takes a
   * methodology, and one the format forbids is not composed.
   */
  const both = (request: LintPack[], rule: string, blamed: LintPack[]): void => {
    compose(request, rule, blamed);
    const ids = closure(request);
    const conditional = ids.map((id) => context.packs.get(id))
      .filter((pack) => pack !== undefined)
      .map((pack) => ({ id: pack.id, withs: conditionalEntries(pack.manifest)
        .map((entry) => ({ id: parseEntry(entry.with, 'requires').id, entry: entry.with }))
        .filter((each) => soundIds.has(each.id)) }))
      .filter((pack) => pack.withs.length > 0);
    for (const target of entryTargets(conditional, (id) => ids.includes(id))) {
      const added = target.added.map((each) => context.packs.get(each.id))
        .filter((pack) => pack !== undefined);
      const kept = [...added, ...request.filter((pack) => !target.removed.includes(pack.id))];
      // A left-out pack the rest requires cannot be left out.
      if (target.removed.some((id) => closure(kept).includes(id))) continue;
      const leg = withMethodology(kept, target.removed, added.length);
      if (leg === undefined || forbidden(leg)) continue;
      compose(leg, rule, blamed);
    }
  };
  for (const methodology of [undefined, ...methodologies]) {
    for (const teamMode of teamModes) {
      for (const stage of stages) {
        const overlays = [teamMode, stage].filter((pack) => pack !== undefined);
        if (overlays.length === 0) continue;
        if (methodology === undefined && overlays.some(needsSoftware)) continue;
        both([...(methodology === undefined ? [] : [methodology]), ...overlays], 'overlay',
          overlays);
      }
    }
  }
  /** A pair of D6 (spec-001 §15, dl-025 D6, task-087), with a methodology when it needs one. */
  const pair = (packs: LintPack[]): void => {
    const request = withMethodology(packs);
    if (request === undefined || forbidden(request)) return;
    both(request, 'pair', packs);
  };
  // A pack declaring tensions with each pack they name.
  for (const pack of sound) {
    for (const tension of pack.manifest.tensions ?? []) {
      const other = sound.find((candidate) =>
        candidate.id === parseEntry(tension.pack, 'conflicts').id);
      if (other !== undefined && other !== pack) pair([pack, other]);
    }
  }
  // Every pack with each stage overlay, the methodologies and team modes already composed with it.
  for (const stage of ofAxis(sound, 'stage')) {
    for (const pack of sound) {
      const axis = pack.manifest.axis;
      if (pack.id === corePack(catalog) || axis === 'methodology' || axis === 'team-mode'
        || axis === 'stage') continue;
      pair([pack, stage]);
    }
  }
  const [first] = methodologies;
  for (const pack of sound) {
    if (reached.has(pack.id)) continue;
    // base comes with every composition; a methodology is composed alone (one per composition).
    let request: LintPack[];
    if (pack.id === corePack(catalog)) request = [];
    else if (pack.manifest.axis === 'methodology' || !needsSoftware(pack)) request = [pack];
    else if (first !== undefined) request = [first, pack];
    else continue;
    both(request, 'compose', [pack]);
  }
  return problems;
}
