---
name: define-feature
description: Define and scope a feature before building it. Use when the user invokes /define-feature or wants to plan, scope, or define a feature. Gathers requirements through conversation, then decomposes into small, verifiable tasks.
---

# Define Feature

Gather requirements from the user until confident you can work autonomously, then decompose the feature into small, verifiable tasks.

## Principles

1. **All work must be verifiable.** Every task needs a concrete way to confirm it's done — a test, a behavior to observe, a command to run.
2. **Smaller is better.** Break work into the smallest tasks that are independently meaningful. If a task feels big, it's probably multiple tasks.

## Workflow

### Phase 1: Gather context

Ask the user questions until you have enough to work autonomously. Don't ask everything at once — start with the most important gaps and follow up.

Areas to cover:

- **What** the feature does from the user's perspective
- **Why** it's needed — the problem it solves
- **Where** it fits in the existing system
- **Boundaries** — what's explicitly out of scope
- **Edge cases** the user already knows about

When you think you have enough, summarize the feature back to the user in your own words and get explicit confirmation before moving on. If the user corrects or adds anything, update your understanding and confirm again.

### Phase 2: Explore the codebase

Before decomposing, explore the relevant parts of the codebase to understand:

- Existing patterns to follow
- Modules and files that will be affected
- Related functionality already in place

### Phase 3: Decompose into tasks

Break the feature into ordered tasks. Each task must have:

- **Description**: What to do
- **Test cases**: A list of specific, concrete checks that prove the task works. Each test case should be a plain-language statement of an input condition and its expected outcome. Cover the happy path, edge cases, and boundary conditions. Aim for the level of detail where an implementer can translate each line directly into a test assertion.

Tasks should follow the bottom-up pattern: building blocks first, then composition.

If the feature is too large to be a single body of work, say so. Propose splitting it into separate features, each with its own task list.

Present the task list to the user for approval. Adjust until they're satisfied.

### Phase 4: Create issues

Once approved, create GitHub issues using `gh`:

- Create a parent issue for the feature with the summary from Phase 1
- Create sub-issues for each task, including the description and test cases
- The issues are then ready for `/build-feature`

## What makes a good task

Good — description plus granular test cases:

> **Add `config/markets.json` to settings patterns**
>
> Test cases:
> - `getSettingsPatterns()` includes `config/markets.json`
> - `CLI_SETTINGS_FLAGS` includes `config/markets.json`
> - `cliSettingFlags()` generates `--only config/markets.json` in output
> - Bucket save copies `config/markets.json` from theme to bucket

> **Add `--listing` flag to deploy command**
>
> Test cases:
> - Flag accepts a string value for the preset name
> - Flag is passed through to the underlying push call
> - Deploy works without the flag (backward compatible)

Too big:
- "Add multi-environment support"
- "Refactor all theme commands"

Too small:
- "Create the test file"
- "Add the import statement"
