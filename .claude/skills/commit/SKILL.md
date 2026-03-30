---
name: commit
description: Create git commits following project conventions. Use when the user invokes /commit or asks to commit changes. Stages files and writes conventional commit messages with type(scope) format.
---

# Commit

These rules override the default git commit instructions.

Create a git commit following project conventions.

## Workflow

1. Run `git diff --staged` and `git status`
2. Plan the commits — split all changes into the smallest meaningful commits:
   - A module and its test = one commit
   - A utility and its test = one commit
   - An untested module = one commit per file
   - Never combine independent modules, unrelated changes, or different scopes
3. Order commits from foundation to integration:
   utilities → services → commands → config/docs
4. For each commit, in order:
   a. Stage files with `git add <file1> <file2> ...`
   b. Run `pnpm build` to check for TypeScript errors
   c. If the reason for the change isn't clear, ask the user
   d. Write a message following the format below
   e. Run `git commit`
   f. Repeat for the next commit

**When in doubt, split.** More small commits are always better than fewer large ones.
The commit log should read as the progressive assembly of a feature.

## Commit Format

```
type(scope): subject

body (optional)

Co-authored-by: name <email> (only if human contributors specified)
```

### Types

- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation only
- `refactor` - Code change that neither fixes a bug nor adds a feature
- `test` - Adding or updating tests
- `chore` - Maintenance tasks, dependencies, config

### Scopes

- `bucket` - Bucket commands, services, or utilities
- `theme` - Theme commands, services, or utilities
- `deploy` - Deployment strategies and related code
- `shopify` - Shopify CLI integration utilities
- `docs` - Standalone documentation
- `agents` - AGENTS.md, CLAUDE.md, skills, AI tooling

### Subject Line
- Maximum 50 characters
- Imperative mood ("Add feature" not "Added feature")
- Capitalize the first word after the scope
- No trailing period

### Body (when needed)
- Separate from subject with a blank line
- Wrap at 72 characters
- Explain *what* and *why*, not *how*

### Co-authored-by
- Only include when a human contributor is explicitly mentioned
- Never list the AI agent as a co-author
- Format: `Co-authored-by: Name <email@example.com>`

## Examples

```
fix(deploy): Correct blue/green theme swap logic
```

```
feat(bucket): Add markets.json to settings patterns

Include config/markets.json in bucket save/restore operations
so market configuration is tracked alongside other settings.
```

```
chore(agents): Add commit skill
```
