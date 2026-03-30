---
name: pull-request
description: Create pull requests using `gh` that tell the story of a change. Use when the user invokes /pull-request or asks to create a PR. Summarizes the what and why.
---

# Pull Request

Create a pull request that tells the story of the change.

## Workflow

1. Run `git status` to check for uncommitted changes
2. If there are uncommitted changes, use the **commit skill** to commit them first —
   follow all its rules for granularity, ordering, and formatting
3. Run `git log main..HEAD --oneline` and `git diff main...HEAD` to review the full branch
4. If the reason for the change isn't clear from the diff and commit history, ask the user for context
5. Determine the PR title and write the body
6. Push the branch and create the PR with `gh pr create`

## PR Title

Use the same format as commit messages:

```
type(scope): subject
```

- Same types and scopes as commits (feat, fix, refactor, etc.)
- Maximum 50 characters
- Imperative mood, capitalized, no trailing period

## PR Body

Tell the story of the change: what it does and why it was made. Keep it concise — the diff has the details.

Do not hard-wrap PR body text. Write normal flowing prose — let GitHub handle line wrapping.

```markdown
## What

Brief description of the change (2-4 sentences). Focus on what the user or system experiences differently.

## Why

Motivation for the change. Link to issues, user feedback, or business context as applicable.
```

## Creating the PR

```bash
gh pr create --title "type(scope): subject" --body "$(cat <<'EOF'
## What

...

## Why

...
EOF
)"
```

- Always create PRs against `main` unless told otherwise
- Push the branch first if it hasn't been pushed yet: `git push -u origin HEAD`

## Reformatting an existing PR

When asked to reformat, clean up, or "match our PR format" on an existing PR:

1. Run `git log main..HEAD --oneline` to see the current commits
2. Run `git diff main...HEAD` to understand the full changeset
3. Reset all commits back to staged changes: `git reset --soft main`
4. Use the **commit skill** to re-commit everything from scratch —
   proper granularity, proper ordering, proper messages
5. Update the PR title and body to match the format above
6. Force push: `git push --force-with-lease`
7. Update the PR with `gh pr edit` if the title or body changed

## Examples

Simple PR:
```
fix(deploy): Validate theme ID before swap

## What

Adds validation that both blue and green theme IDs exist before starting a blue/green deploy. Previously, an invalid ID would fail mid-deploy leaving the store in an inconsistent state.

## Why

Users reported failed deploys when a theme was deleted but the .env still referenced the old ID.
```

Dependency bump PR:
```
chore: Bump Shopify CLI packages to 3.92.1

## What

Updates @shopify/cli and @shopify/cli-kit from 3.80.7 to 3.92.1, along with oclif packages. Replaces removed `renderText` API with `outputInfo`.

## Why

Staying current with Shopify CLI to pick up bug fixes and new features. The previous version was 12 minor releases behind.
```
