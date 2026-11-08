// spec-001 §18, dl-025 D1: the waiver heuristic (task-086). A directive of an overlay or a
// `stage/*` pack using waiver wording is listed for review, never refused; a bridge is exempt.
import type { LintContext } from './check-packs';
import type { Problem } from './problems';

/** The hits of the heuristic, rule `waiver`, one per line of a directive's body. */
export function waiverReviews(context: LintContext): Problem[] {
  void context;
  throw new Error('waiverReviews: not implemented yet (task-086)');
}
