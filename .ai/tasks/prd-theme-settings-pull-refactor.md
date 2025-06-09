# Product Requirements Document: Refactor Theme Settings Download to Pull Command

## Introduction/Overview

This feature involves refactoring the existing `theme settings download` command to be named `theme settings pull` to align with Shopify CLI naming patterns. The original `download` command will remain functional as a hidden alias to maintain backwards compatibility for existing users and scripts.

**Problem:** The current command naming (`download`) doesn't match the patterns used by the official Shopify CLI, which may cause confusion for users familiar with Shopify's tooling.

**Goal:** Rename the command to follow Shopify CLI conventions while maintaining full backwards compatibility.

## Goals

1. Create a new `theme settings pull` command that matches Shopify CLI naming patterns
2. Maintain backwards compatibility by keeping `theme settings download` functional as a hidden alias
3. Update all user-facing documentation to reflect the new command name
4. Ensure zero breaking changes for existing users

## User Stories

- **As a developer familiar with Shopify CLI**, I want to use `theme settings pull` so that the command naming is consistent with what I expect from Shopify tools.
- **As an existing user of the tool**, I want my existing scripts using `theme settings download` to continue working without modification so that I don't have to update my workflows immediately.
- **As a new user reading documentation**, I want to see `pull` as the primary command so that I learn the preferred/standard naming convention.

## Functional Requirements

1. **FR-1:** The system must create a new `theme settings pull` command with identical functionality to the existing `download` command.
2. **FR-2:** The system must keep the existing `theme settings download` command working with identical behavior.
3. **FR-3:** The `download` command must be hidden from help text and command listings to discourage new usage.
4. **FR-4:** All flags, options, and behaviors must work identically between `pull` and `download` commands.
5. **FR-5:** Help text and descriptions must be updated to reference "pull" instead of "download".
6. **FR-6:** The command description must be updated to use "pull" terminology (e.g., "Pull settings from live theme" instead of "Download settings from live theme").
7. **FR-7:** Environment variables and flag names should remain unchanged to maintain compatibility.

## Non-Goals (Out of Scope)

- Refactoring other commands beyond `theme settings download`
- Changing the underlying functionality or behavior of the command
- Adding deprecation warnings for the `download` alias (maintain silent backwards compatibility)
- Modifying flag names or environment variables
- Changes to the command's core logic or implementation details

## Design Considerations

- **File Structure:** Create a new `pull.ts` file alongside the existing `download.ts`
- **Code Reuse:** The `download.ts` file should import and extend the `pull.ts` command to avoid code duplication
- **Command Registration:** Both commands need to be properly registered in the CLI framework
- **Help Text:** Update descriptions to use "pull" terminology while maintaining technical accuracy

## Technical Considerations

- **Existing Dependencies:** The refactor should use the existing `downloadThemeSettings` utility function without modification
- **Flag Compatibility:** All existing flags (`-d`, `-l`, `-t`, `-n`) must work identically in both commands
- **Command Structure:** Follow the existing pattern used in the codebase for command organization
- **Import Paths:** Ensure proper import/export structure to avoid circular dependencies

## Success Metrics

1. **Backwards Compatibility:** 100% of existing `theme settings download` usage continues to work without changes
2. **Functionality Parity:** All flags and options work identically between `pull` and `download` commands
3. **Documentation Consistency:** All help text and descriptions reference "pull" as the primary command
4. **User Adoption:** New users naturally discover and use the `pull` command through documentation and help text

## Open Questions

1. Should we add any logging or analytics to track usage of the deprecated `download` alias vs the new `pull` command?
2. Do we need to update any existing tests to cover both command names?
3. Are there any internal documentation or README files that should be updated to reflect the new command name?

## Implementation Notes

- The new `pull.ts` file should be the primary implementation
- The `download.ts` file should become a thin wrapper that imports and extends `pull.ts`
- Both files should maintain the same export structure for CLI framework compatibility
- Consider using a shared base class or composition pattern to avoid code duplication
