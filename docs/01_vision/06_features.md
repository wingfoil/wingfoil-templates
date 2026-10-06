# Features — WingFoil-Templates

**Version:** 1.2
**Date:** 2026-10-06
**Status:** Approved
**Traces to:** [05_journeys.md](05_journeys.md), [03_is-isnot.md](03_is-isnot.md), [01_product-brief.md](01_product-brief.md) §8

---

Feature ids are `F<area>.<n>`. Each feature traces to the journey step that asks for it (`J1.4` is
journey J1, step 4).

The review columns follow Lean Inception's technical and business review:

- **Value:** business value, High / Medium / Low.
- **Effort:** technical effort, High / Medium / Low.
- **Unc.:** uncertainty, meaning how well the solution is understood. High / Medium / Low.

An uncertainty of **H** marks a feature whose solution is not yet known. It needs a spike, a
decision in the pack-model phase, or a decision of WingFoil.

---

## F1 — Pack format

Specified in spec-001; the schemas are the contract with the WingFoil CLI.

| ID | Feature | Journey | Value | Effort | Unc. |
|---|---|---|---|---|---|
| F1.1 | **`pack.yaml` manifest:** id, axis, slot, version, `formats` and `requires_capabilities`, `requires` and `conflicts` with semver ranges, contents, parameters. | J1.3, J6.1 | H | M | M |
| F1.2 | **Fragments:** pieces of `dna.yaml`, `roles.yaml`, `memory.yaml` and `workflows.yaml` that are merged in a defined order. The merge rule for Memory state machines is "add or tighten, never remove". | J1.3, J5.3 | H | H | **H** |
| F1.3 | **Parameters** `{{name}}`: typed, each with a default, and with no project values inside packs. Path and id parameters accept the project's tokens (`{release}`, `{scope}`). | J2.2, J6.2 | H | M | M |
| F1.4 | **Slots:** each slot is included by name. `sw-life-cycle` includes `inception`, `specification`, `delivery` and `end-of-life`, and the methodology's `delivery` includes `release` (dl-003 D4, D11). A phase pack fills a slot by shipping the workflow of that name. | J1.3, J6.1 | H | M | M |
| F1.5 | **`format:` key** on every file a pack ships, and on this repository's own files (`pack.yaml`, catalog, compat, presets, transitions), per WingFoil dl-149. | J4.1, J3.1 | H | L | M |
| F1.6 | **AGENTS.md section** (`agents_section`): a pack contributes text inside a marked region and never ships the file itself. | J2.4, J5.1 | M | L | **H** |
| F1.7 | **JSON Schemas** for every file kind above, published under `schema/`. | J1.3, J1.4 | H | M | L |

## F2 — Catalog and distribution

| ID | Feature | Journey | Value | Effort | Unc. |
|---|---|---|---|---|---|
| F2.1 | **`catalog.yaml`:** axes, packs, published versions with commit, digest, formats, capabilities and the computed WingFoil range. | J3.1, J6.1 | H | M | L |
| F2.2 | **Tag per pack version**, never moved or deleted. | J1.7, J3.2 | H | L | M |
| F2.3 | **Pack digest:** sha256 over a canonical listing of the pack's files. The procedure (ordering, line endings, exclusions) is fixed in spec-001. | J1.7, J3.2 | H | L | M |
| F2.4 | **`compat.yaml`:** for each WingFoil release, the formats it reads and the capabilities it provides. The vocabulary belongs to WingFoil (notes T13), and until WingFoil publishes it this repository holds a proposal. | J4.1, J6.3 | H | L | **H** |
| F2.5 | **Computed WingFoil range** in the catalog, derived from `compat.yaml`. It is never written by hand. | J1.6, J3.1 | M | L | L |
| F2.6 | **Presets:** named combinations, organized by the adoption profiles (personas §2). | J6.1 | M | L | L |
| ~~F2.7~~ | ~~**Release assets.**~~ Dropped in the features review: versions are not published as GitHub Release assets. | brief §8 | — | — | — |

## F3 — Validation tooling

| ID | Feature | Journey | Value | Effort | Unc. |
|---|---|---|---|---|---|
| F3.1 | **One validation command**, run locally and in CI. It runs schema checks, composition, the compatibility matrix and determinism, in one pass. | J1.4, J1.5 | H | M | L |
| F3.2 | **Reference composer:** composes a set of packs into a `.wingfoil/`, so that packs can be validated before WingFoil can install them. | J1.4 | H | H | **H** |
| F3.3 | **Compatibility matrix:** each composition is validated with the oldest and the newest compatible WingFoil release, each installed pinned and in isolation. Validation means `workflow list`, `dna show` and `directives list`, with exit 0 and no warning. | J1.4, J4.2 | H | M | M |
| F3.4 | **Determinism check:** two compositions from a clean state must be byte-identical. | J1.4 | H | L | L |
| F3.5 | **Lint rules:** no empty phases (actions and produces declared), includes by name, no contradictions between overlays, no project values, no secrets. | J5.2, J5.3 | H | M | M |
| F3.6 | **CI:** the validation runs on every pull request and every publication. | J1.5 | M | L | L |

## F4 — Pack content (official catalog)

| ID | Feature | Journey | Value | Effort | Unc. |
|---|---|---|---|---|---|
| F4.1 | **`base`:** shared Memory types and life cycles, capture workflows, the `sw-life-cycle` skeleton with its slots, retrospective, global directives, and the DNA and roles fragments. It waits for the v0.3 formats. | J2, J5 | H | H | M |
| F4.2 | **`governance/wingfoil-dogfood`:** the feedback channel to WingFoil and the known behaviours of the pinned CLI. | J2, J5 | M | L | L |
| F4.3 | **Methodologies:** `scrum`, `kanban`. | J6.1 | H | M | L |
| F4.4 | **`team-mode/agent-first`:** depends on WingFoil's agent work (notes T9). | J6.1 | M | M | **H** |
| F4.5 | **Phase packs:** `inception/lean-inception`, `specification/bdd-sbe`. | J6.1 | M | M | L |
| F4.6 | **Blueprints:** `web-service`, `cli-library`. The `service` Memory type is renamed, because it clashes with WingFoil dl-088. | J6.1 | M | M | M |
| F4.7 | **Stages:** `prototype`, `production`, and the transition `prototype-to-production`. Running transitions belongs to WingFoil. | J8 | M | M | M |

## F5 — Release process

| ID | Feature | Journey | Value | Effort | Unc. |
|---|---|---|---|---|---|
| F5.1 | **`pack-release` with evidence:** commands, WingFoil versions and exit codes are recorded in the element (already configured). | J1.6 | H | L | L |
| F5.2 | **`wingfoil-release-intake` workflow:** updates `compat.yaml`, rechecks the active packs, and opens a task for each migration (journeys review). | J4 | H | L | L |
| F5.3 | **Line policy:** one living line before WingFoil 1.0; lines N and N-1 after it. | J4.3, J7.1 | M | L | M |
| F5.4 | **Feedback notes on publication:** a note for every schema change and for every published pack that WingFoil bundles. | J3.1 | M | L | L |

## F6 — Adoption (until the CLI installs packs)

| ID | Feature | Journey | Value | Effort | Unc. |
|---|---|---|---|---|---|
| F6.1 | **Hand-adoption steps in the `base` README.** They are temporary: they are removed when the CLI installs packs, and a generic procedure stays in the user docs (vision review). | J2.1–J2.5 | H | L | L |
| F6.2 | **Parameters for the governed repositories:** paths per Memory type, plan ids, agent name, the `governance` path meaning. | J2.2 | H | M | M |

## F7 — Community and metrics (later)

| ID | Feature | Journey | Value | Effort | Unc. |
|---|---|---|---|---|---|
| F7.1 | **Community catalog:** packs kept distinct from the official ones; where they live is open (vision review). | J9 | M | M | **H** |
| F7.2 | **Contribution model:** Memory elements through ingest workflows, with `contributor:` and `credit:` (WingFoil dl-020). | J9 | M | L | L |
| F7.3 | **Download metrics:** clone and view traffic, collected periodically because GitHub keeps only 14 days. There are no per-pack counts, because no release assets are published (features review). | brief §8 | L | L | M |

---

## Review notes

- **High-uncertainty features:**
  - **F1.2 (fragment merge):** the merge order and the "add or tighten" rule for state machines must
    be exact in spec-001. They are the core of determinism.
  - **F1.6 (AGENTS.md markers):** the syntax waits for WingFoil dl-137's part-(b) tech-spec (notes
    T14).
  - **F2.4 (capability vocabulary):** WingFoil owns the names (notes T13).
  - **F3.2 (reference composer):** see open question 1.
  - **F4.4 (agent-first):** it depends on WingFoil's agent features (notes T9).
  - **F7.1 (community location):** it depends on WingFoil's sources and allowlist (dl-138 Q4).
- **Download metrics (brief §8), feasibility:**
  - GitHub counts downloads only for assets attached to a Release. F2.7 is therefore what makes the
    signal possible.
  - Clone and view traffic covers only the last 14 days and needs push access, so it must be
    collected periodically (F7.3).
  - Git itself records no downloads.

  Whether the WingFoil CLI fetches release assets or the tag is WingFoil's choice. If it fetches the
  tag, only the traffic signal remains.
- **Dependency on WingFoil:** F1.5, F1.6, F2.4, F4.1 and F4.4 wait for WingFoil decisions or
  releases. The sequencer has to put work that does not wait first.

## Open questions for the features review

1. **Reference composer (F3.2).** Until WingFoil v0.4 nothing composes packs, so they cannot be
   validated. The options:
   - **(a)** this repository keeps a minimal composer used only for validation. The risk is that it
     diverges from WingFoil's resolver;
   - **(b)** composition is specified in spec-001 so that WingFoil implements it first, and this
     repository waits;
   - **(c)** like (a), but the composer is proposed to WingFoil as its implementation (a feedback
     note), so that there is one composer.

   I recommend (c).
2. **Tooling language.** The DNA declares Node.js ≥ 22.12, and WingFoil is TypeScript. The tooling
   (F3) is written in TypeScript on Node. Confirm?
3. **Release assets (F2.7).** Also publish each version as a GitHub Release asset, for the download
   signal? It adds one artifact per publication and needs a matching feedback note to WingFoil.

## Decisions from the features review

Approver, 2026-10-06:

1. **Reference composer (F3.2): option (c).** This repository keeps a minimal composer, used for
   validation. It is proposed to WingFoil as its implementation through a feedback note (notes
   T15), so that one composer exists rather than two that may diverge. Composition is specified in
   spec-001.
2. **Tooling language:** TypeScript on Node.js ≥ 22.12, as WingFoil.
3. **No release assets (F2.7 dropped).** The download signal of brief §8 is limited to the
   repository's clone and view traffic (F7.3). It is not counted per pack.
4. **Amendment 1.2 (2026-10-06).** F1.4 is aligned with the slot list of dl-003 D11, which was
   amended while pending.
