import { Theme } from '@shopify/cli-kit/node/themes/types.js'
import { fetchStoreThemes, pull, push } from '@shopify/cli'
import { PullFlags } from './shopify/services/pull.js'
import { CLI_SETTINGS_FLAGS } from './bucket.js'
import { Filter } from './shopify/theme-selector/filter.js'
import { PushFlags } from './shopify/services/push.js'

export interface DownloadFlags {
  verbose?: boolean
  'no-color'?: boolean
  path?: string
  password?: string
  store?: string
  theme?: string
  development?: boolean
  live?: boolean
  nodelete?: boolean
}

export async function pullLiveThemeSettings(flags: PullFlags): Promise<void> {
  const pullFlags: PullFlags = {
    ...flags,
    only: CLI_SETTINGS_FLAGS,
    live: true,
  }

  await pull(pullFlags)
}

export async function pullThemeSettings(flags: PullFlags): Promise<void> {
  const pullFlags: PullFlags = {
    ...flags,
    only: CLI_SETTINGS_FLAGS,
  }
  await pull(pullFlags)
}

export async function downloadThemeSettings(flags: DownloadFlags): Promise<void> {
  const pullFlags: PullFlags = {
    verbose: flags.verbose,
    noColor: flags['no-color'],
    path: flags.path,
    password: flags.password,
    store: flags.store,
    theme: flags.theme,
    development: flags.development,
    live: flags.live || !(flags.theme || flags.development),
    nodelete: flags.nodelete,
    only: CLI_SETTINGS_FLAGS,
  }

  await pull(pullFlags)
}

export async function deployTheme(theme: number, flags: PushFlags) {
  const pushFlags: PushFlags = {
    ...flags,
    theme: theme.toString(),
  }
  await push(pushFlags)
}

export async function deployToLive(flags: PushFlags) {
  const pushFlags: PushFlags = {
    ...flags,
    live: true,
    allowLive: true,
  }
  await push(pushFlags)
}

export async function getThemesByIdentifier(
  store: string | undefined,
  password: string | undefined,
  theme: string | undefined,
): Promise<Theme[]> {
  let storeThemes = await fetchStoreThemes(store, password)
  const filter = new Filter({ theme: theme })

  if (filter.any()) {
    storeThemes = filterByTheme(storeThemes, filter)
  }

  return storeThemes
}

// These functions are near direct copies of the ones in the Shopify CLI codebase.
// They have been modified to not throw errors
function filterByTheme(themes: Theme[], filter: Filter): Theme[] {
  const identifiers = filter.themeIdentifiers
  return identifiers.flatMap((identifier) => {
    return filterArray(themes, (theme) => {
      return `${theme.id}` === identifier || theme.name.toLowerCase().includes(identifier.toLowerCase())
    })
  })
}

function filterArray(themes: Theme[], predicate: (theme: Theme) => boolean): Theme[] {
  return themes.filter(predicate)
}
