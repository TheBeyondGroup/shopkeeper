## Relevant Files

- `src/commands/theme/settings/pull.ts` - New primary command implementation for `theme settings pull`.
- `src/commands/theme/settings/download.ts` - Existing command file that will be refactored to act as a hidden alias.
- `src/utilities/theme.js` - Contains the `downloadThemeSettings` utility function used by both commands.
- `src/utilities/shopify/flags.js` - Contains shared theme flags used by commands.
- `src/commands/theme/settings/pull.test.ts` - Unit tests for the new pull command.
- `src/commands/theme/settings/download.test.ts` - Updated unit tests for the download alias command.

### Notes

- Unit tests should typically be placed alongside the code files they are testing.
- Use `pnpm test` to run tests. Running without a path executes all tests found by the Jest configuration.
- The existing `downloadThemeSettings` utility function should remain unchanged to maintain compatibility.
- Both commands must be properly registered in the CLI framework for discovery.

## Tasks

- [x] 1.0 Create the new `theme settings pull` command
  - [x] 1.1 Create `src/commands/theme/settings/pull.ts` file with identical functionality to existing download command
  - [x] 1.2 Update command description to use "pull" terminology (e.g., "Pull settings from live theme")
  - [x] 1.3 Update flag descriptions to use "pull" terminology where applicable
  - [x] 1.4 Ensure all existing flags (`-d`, `-l`, `-t`, `-n`) work identically
  - [x] 1.5 Import and use the existing `downloadThemeSettings` utility function
  - [x] 1.6 Verify proper integration with global flags and theme flags

- [x] 2.0 Refactor the existing download command to act as a hidden alias
  - [x] 2.1 Modify `src/commands/theme/settings/download.ts` to import and extend the pull command
  - [x] 2.2 Add `hidden: true` property to hide the command from help text and listings
  - [x] 2.3 Ensure the download command maintains identical behavior to the original
  - [x] 2.4 Verify all flags and functionality work exactly the same as before
  - [x] 2.5 Test that existing scripts using `theme settings download` continue to work

- [x] 3.0 Ensure proper command registration and CLI framework integration
  - [x] 3.1 Verify both commands are properly registered in the CLI framework
  - [x] 3.2 Test command discovery for `theme settings pull`
  - [x] 3.3 Confirm `theme settings download` remains functional but hidden
  - [x] 3.4 Validate help text shows only the pull command in listings

- [ ] 4.0 Create comprehensive tests for both commands
  - [x] 4.1 Create unit tests for the new pull command (`pull.test.ts`)
  - [x] 4.2 Update existing tests for the download command to verify alias behavior
  - [x] 4.3 Test flag compatibility between both commands

- [ ] 5.0 Validate backwards compatibility and functionality parity
  - [ ] 5.1 Test all existing flag combinations work identically in both commands
  - [ ] 5.2 Verify environment variables work the same for both commands
  - [ ] 5.3 Confirm error handling and edge cases behave identically
  - [ ] 5.4 Test help text updates show correct "pull" terminology
  - [ ] 5.5 Validate that no breaking changes were introduced for existing users
