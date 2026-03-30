---
name: build-feature
description: Work a feature end to end. Use when the user invokes /build-feature or asks to build, implement, or work on a feature. Covers the full lifecycle from branch creation through implementation, commits, and PR.
---

# Feature

Work a feature through its full lifecycle: branch, plan, implement, commit, PR.

## Workflow

1. Clarify the feature requirements — ask the user if anything is ambiguous
2. Create a feature branch off `main`
3. Plan the implementation approach
4. Implement in small, focused iterations
5. Invoke the `/commit` skill after each logical unit of work — do not commit manually
6. Run `pnpm build` before each commit to check for TypeScript errors
7. Create a PR using `/pull-request` conventions when the feature is complete

## Branch Naming

```
type/short-description
```

- Use the commit type as prefix: `feat/`, `fix/`, `refactor/`, etc.
- Use kebab-case for the description
- Keep it short and descriptive

Examples:
```
feat/listing-support
fix/deploy-theme-rename
refactor/extract-settings-patterns
```

## Planning

Before writing code:

1. Explore the relevant parts of the codebase to understand existing patterns
2. Identify which files need to change and what new files are needed
3. Present the plan to the user for approval before implementing
4. If the approach is unclear, ask the user — don't guess

## Implementation

Use test-driven development:

1. Write a failing test for the next piece of functionality
2. Run `pnpm test` to confirm it fails
3. Write the minimum code to make it pass
4. Refactor if needed
5. Commit the test and implementation together

Additional guidelines:

- Follow existing code patterns and conventions in the project
- Run `pnpm build` frequently to catch type errors early
- Ask the user for direction when making design decisions with multiple valid approaches

## Committing

Invoke the `/commit` skill for every commit — do not write commit messages manually. Build bottom-up: implement the building blocks first as isolated commits, then compose them.

Example commit sequence for a feature:
1. Add utility function with tests
2. Add service layer with tests
3. Add command that wires it together
4. Update docs

Each commit should be a self-contained unit — a module and its tests, a service and its tests, a command and its flags. Don't batch unrelated changes into a single commit.

## Completing

When the feature is done:

1. Verify all tests pass with `pnpm test`
2. Verify build is clean with `pnpm build`
3. Invoke the `/pull-request` skill to create the PR — do not create PRs manually
4. Share the PR URL with the user
