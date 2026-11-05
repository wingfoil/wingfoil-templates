---
id: bug-011-base-s-security-secrets-forbids-the-approver-s-email-that-dna.yaml-must-hold
type: bug
title: "base's security-secrets forbids the approver's email that dna.yaml must hold"
status: draft
severity: "minor"        # critical | major | minor
pack: "pack-foundation-base"
tags: ["packs","feedback"]
---

## Observed

Reported by WingFoil UI after adopting `base` 2.0.1 by hand (2026-11-02). `base`'s directive
`security-secrets` (`packs/base/directives/security-secrets.md`) says: "Never write a password, a
token, a key, or a personal email or postal address into a file, a commit, an element or a message
to another session." `base`'s `dna.yaml` fragment writes `team.members[].email:
"{{approver_email}}"` (`packs/base/fragments/dna.yaml`), which WingFoil needs: an approval is
authorised by the commit author's email matching a member with the `approver` role, and `workflow
status` routes each approval to that member by name and email. An adopter following the directive
cannot hold the file the pack itself writes.

## Expected

`security-secrets` names the exception: the team members' names and emails in `dna.yaml` › `team`,
which WingFoil needs to authorise and route approvals, are the one place a personal email is
written, and nowhere else (not in Memory, commits' bodies, or messages).

## Reproduction

1. WingFoil 0.3.2 (`6de2e13c`), `base` 2.0.1, `software` 1.0.0 and `methodology/scrum` 1.0.0
   composed from the tree at the tag `methodology/scrum@1.0.0` (`6373282`) with `npm run compose --
   --tree <tag tree> --out <dir> --param project_name=… --param approver_name=… --param
   approver_email=… --param agent_name=… base software methodology/scrum`; a scratch repository with
   `git init`, `wingfoil init --template Scrum --no-interactive`, the composed `.wingfoil/` copied
   over and `init`'s custom workflows and directives removed (the READMEs' steps); `wingfoil
   workflow list --format json` shows no diagnostic.
2. The composed `.wingfoil/directives/built-in/security-secrets.md` holds the sentence above;
   `.wingfoil/dna.yaml` holds `team.members[0].email`, the value of `approver_email`.
3. `wingfoil workflow status`, with an element at a gate: `routed to <approver_name>
   <approver_email>`.

## Execution Notes

<!-- An owed item gets its row in docs/owed-items.md (repository-practice rule 4). -->
- 2026-11-05: captured under plan-064 (`bug-ingest` › `capture`), from WingFoil UI's adoption
  feedback of 2026-11-02, reproduced on WingFoil 0.3.2 (plan-064 › Execution Notes, step 1).
  Severity `minor`, proposed: a contradiction in a directive's text, with no failing command; fixed
  by the next release of `base` (patch: wording that names an exception the pack already relies on).
