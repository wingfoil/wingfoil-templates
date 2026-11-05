---
id: bug-011-base-s-security-secrets-forbids-the-approver-s-email-that-dna.yaml-must-hold
type: bug
title: "base's security-secrets forbids the approver's email that dna.yaml must hold"
status: approved
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
authorised only when the approving git identity's email matches a member holding `approver` (another
identity is refused, `user not authorized to approve type '<type>'`), and `workflow status` names
the member it routes an approval to by name and email. Every commit's author header also carries the
git identity's email, which the directive's "into … a commit" forbids as well. An adopter following
the directive cannot hold the file the pack itself writes.

## Expected

`security-secrets` names the exceptions: the team members' emails in `dna.yaml` › `team.members`,
which WingFoil needs to authorise and route approvals, and the git identity's email in a commit's
author header; a personal email is written nowhere else (not in Memory, a commit message's text, or
a message).

## Reproduction

1. WingFoil 0.3.2 (`6de2e13c`), `base` 2.0.1, `software` 1.0.0 and `methodology/scrum` 1.0.0
   composed from the tree at the tag `methodology/scrum@1.0.0` (`6373282`: `git worktree add <dir>
   methodology/scrum@1.0.0`, then `npm ci` and `npm run build` there) with `npm run compose --
   --tree <tag tree> --out <dir> --param project_name=… --param approver_name=… --param
   approver_email=… --param agent_name=… base software methodology/scrum`; a scratch repository with
   `git init`, `wingfoil init --template Scrum --no-interactive`, the composed `.wingfoil/` copied
   over and `init`'s custom workflows and directives removed (the READMEs' steps); `wingfoil
   workflow list --format json` shows no diagnostic.
2. The composed `.wingfoil/directives/built-in/security-secrets.md` holds the sentence above;
   `.wingfoil/dna.yaml` holds `team.members[0].email`, the value of `approver_email`.
3. `wingfoil memory add --type bug --title "Repro bug"`, `wingfoil memory submit <id>` (`draft →
   open`, a gated state in `software`'s `memory.yaml`); `wingfoil workflow status` names the
   approval `routed to <approver_name> <approver_email>`.
4. With `git config user.email` set to an address no member holds, `wingfoil memory approve <id>
   --reason …`: `error: user not authorized to approve type 'bug'`; with the approver's, it passes.

## Execution Notes

<!-- An owed item gets its row in docs/owed-items.md (repository-practice rule 4). -->
- 2026-11-05: captured under plan-064 (`bug-ingest` › `capture`), from WingFoil UI's adoption
  feedback of 2026-11-02, reproduced on WingFoil 0.3.2 (plan-064 › Execution Notes, step 1).
  Severity `minor`, proposed: a contradiction in a directive's text, with no failing command; fixed
  by the next release of `base`; patch proposed (wording; the pack already writes the email), the
  class settled at the release with the register's row on `pack-semver`'s rule for fixes, since it
  relaxes a `security` rule (spec-001 §10.1).
- 2026-11-05: independent review: approve after amendments, nothing blocking; applied: the
  approval's mechanism (the approving identity's email; the refusal reproduced on 0.3.2), the git
  identity's email as the second exception, the class left to the release, Reproduction's steps 3
  and 4, "names" dropped, how to get the tag's tree.
- 2026-11-05: re-review: approve.
