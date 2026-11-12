// The validation's stand-in values for a preset's required parameters (spec-001 §15, task-090,
// plan-070 point 2). A preset holds no project value, so `npm run validate`, `validate:publication`
// and `publish:pack` compose it with these fixed, fictional values for each required parameter that
// has no default and that neither the preset nor `--param` sets. They are never written to a preset
// or to a pack, and the composer itself (`npm run compose`) never uses them.
import type { ResolvedPack } from './resolve';

/** By parameter name: `base`'s four, the published packs' only required parameters. */
export const STAND_INS: Readonly<Record<string, string>> = Object.freeze({
  project_name: 'Preset Check',
  approver_name: 'Preset Approver',
  approver_email: 'approver@preset-check.example',
  agent_name: 'Preset Agent',
});

/**
 * `params` with a stand-in added for each parameter a pack declares with no default, absent from
 * `params` and named in STAND_INS; any other required parameter stays unset, so the composer still
 * fails on it.
 */
export function withStandIns(params: Record<string, string>, packs: ResolvedPack[]):
Record<string, string> {
  const filled = { ...params };
  for (const pack of packs) {
    for (const [name, declaration] of Object.entries(pack.manifest.parameters ?? {})) {
      const standIn = STAND_INS[name];
      if (declaration.default === undefined && !Object.hasOwn(filled, name)
        && standIn !== undefined) {
        filled[name] = standIn;
      }
    }
  }
  return filled;
}
