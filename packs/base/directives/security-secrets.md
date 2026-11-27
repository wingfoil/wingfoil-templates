---
id: security-secrets
name: security-secrets
type: directive
kind: built-in
format: 1
title: "Secrets"
---

# Secrets

Precedence: security

No secret enters the repository of {{project_name}}, its Memory or its commit messages.

- Never write a password, a token, a key, or a personal email or postal address into a file, a
  commit, an element or a message to another session. Three exceptions, which WingFoil needs: the
  team members' emails in `dna.yaml` › `team.members`, by which it authorises and routes approvals;
  the git identity's email in a commit's author and committer headers; and the `Approver:` line
  WingFoil writes in an approval commit's body. A personal email is written nowhere else: not in
  Memory, in a file other than `dna.yaml`, in the text of a commit message a person or an agent
  writes, or in a message.
- Values that look like secrets in examples are visibly fictional.
- A secret committed by mistake is revoked first, then removed; removing it alone is not enough.
