# Shopkeeper

A CLI for managing Shopify theme settings and deployments. Built on oclif and Shopify CLI libraries.

## Quick Reference

```bash
pnpm build          # rm dist/ && tsc -b
pnpm test           # vitest --run
./bin/dev.js         # run locally during development
```

Ensure zero TypeScript diagnostics before committing. There is a sample theme in `shopify/` and `.env` provides environment variables for a test store.

## Architecture

```
src/
├── commands/              # oclif command classes (thin, delegate to services)
│   ├── bucket/            # init, create, delete, list, current, switch, save, restore
│   └── theme/             # deploy, create, get
│       └── settings/      # pull (primary), download (deprecated alias)
├── services/              # business logic (called by commands)
│   ├── bucket/
│   └── theme/
└── utilities/             # shared helpers
    ├── shopify/           # Shopify CLI wrappers (flags, pull/push, theme-store, theme-selector)
    │   ├── services/      # pull(), push(), local-storage
    │   └── theme-selector/
    ├── constants.ts       # SHOPKEEPER_DIRECTORY, deployment strategies
    ├── bucket.ts          # bucket file ops, settings patterns, CLI flags
    ├── theme.ts           # theme pull/push/deploy wrappers
    └── fixtures/          # test fixtures
```

**Flow:** Command parses flags -> calls service function -> service uses utilities -> utilities wrap Shopify CLI APIs.

## Key Concepts

**Buckets** — Named groups of theme settings stored in `.shopkeeper/<bucket>/`. Each bucket mirrors the theme structure (`config/`, `templates/`, `sections/`) plus a `.env` file with store credentials and theme IDs.

**Settings files** tracked by shopkeeper:
- `config/settings_data.json`, `config/markets.json`
- `templates/**/*.json` (including `customers/`, `metaobject/`)
- `sections/*.json`

**Deployment strategies:**
- `blue-green` (default) — Two themes (blue/green), deploy to the off-duty one, then swap. Requires `SKR_FLAG_BLUE_THEME_ID` and `SKR_FLAG_GREEN_THEME_ID`.
- `basic` — Deploy directly to live theme.

Both rename the theme to `[<git-sha>] Production` after deploy.

## Command Pattern

Commands extend `BaseCommand` from `@shopify/cli-kit/node/base-command`:

```typescript
import BaseCommand from '@shopify/cli-kit/node/base-command'
import {globalFlags} from '@shopify/cli-kit/node/cli'
import {Flags} from '@oclif/core'

export default class MyCommand extends BaseCommand {
  static description = 'Does something'

  static flags = {
    ...globalFlags,
    bucket: Flags.string({char: 'b', env: 'SKR_FLAG_BUCKET'}),
  }

  async run(): Promise<void> {
    const {flags} = await this.parse(MyCommand)
    await myService(flags)
  }
}
```

Theme commands use `ThemeCommand` (from `src/utilities/shopify/theme-command.ts`) which sets `environmentsFilename()` to `shopify.theme.toml`.

## Test Pattern

Tests are co-located (`foo.ts` / `foo.test.ts`), use vitest, and mock Shopify CLI dependencies:

```typescript
import {describe, expect, test, vi, beforeEach} from 'vitest'

vi.mock('@shopify/cli-kit/node/fs')
vi.mock('../../utilities/theme.js')

describe('feature', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  test('does something', async () => {
    vi.mocked(someFunction).mockResolvedValue(value)

    await functionUnderTest(args)

    expect(someFunction).toHaveBeenCalledWith(expectedArgs)
  })
})
```

Use `inTemporaryDirectory()` from `@shopify/cli-kit/node/fs` for tests that need a real filesystem.

## Code Style

Prettier handles formatting (config in package.json):
- Single quotes, no semicolons, trailing commas
- No bracket spacing: `{a, b}` not `{ a, b }`
- 120 char print width
- Explicit `.js` extensions on relative imports (ESM)

## Key Dependencies

| Package | Purpose |
|---|---|
| `@shopify/cli-kit` | Filesystem, UI (renderSuccess, outputInfo), sessions, themes API |
| `@shopify/cli` | Theme pull/push commands |
| `@oclif/core` | CLI framework, flag parsing |
| `vitest` | Test runner |

Environment variables for flags use `SKR_FLAG_` prefix (shopkeeper) or `SHOPIFY_FLAG_` prefix (Shopify CLI passthrough).

## Error Handling

Use `AbortError` from `@shopify/cli-kit/node/error` for user-facing errors. Use `outputInfo` from `@shopify/cli-kit/node/output` for informational messages, and `renderSuccess`/`renderWarning` from `@shopify/cli-kit/node/ui` for structured output.
