import { execCLI2 } from "@shopify/cli-kit/node/ruby"
import { AdminSession } from "@shopify/cli-kit/node/session"
import { Theme } from "@shopify/cli-kit/node/themes/types.js"
import { fetchStoreThemes } from "@shopify/theme/dist/cli/utilities/theme-selector/fetch.js"
import { Filter } from "@shopify/theme/dist/cli/utilities/theme-selector/filter.js"
import { cli2settingFlags } from "./bucket.js"

export async function pullLiveThemeSettings(adminSession: AdminSession, path: string, themeFlags: string[]): Promise<void> {
  const settingFilterFlags = cli2settingFlags()
  const command = ['theme', 'pull', path, ...themeFlags, ...settingFilterFlags]
  await execCLI2(command, { store: adminSession.storeFqdn, adminToken: adminSession.token })
}

export async function push(adminSession: AdminSession, path: string, publish: boolean, themeFlags: string[], themeId: number) {
  const themeFlag = ['--theme', themeId.toString()]
  if (publish) {
    themeFlag.push('--publish')
  }
  const command = ['theme', 'push', path, ...themeFlags, ...themeFlag]
  await execCLI2(command, { store: adminSession.storeFqdn, adminToken: adminSession.token })
}

export async function pushToLive(adminSession: AdminSession, path: string, themeFlags: string[]) {
  const themeFlag = ['--live', '--allow-live']
  const command = ['theme', 'push', path, ...themeFlags, ...themeFlag]
  await execCLI2(command, { store: adminSession.storeFqdn, adminToken: adminSession.token })
}

export async function getThemesByIdentifier(adminSession: AdminSession, theme: string): Promise<Theme[]> {
  let storeThemes = await fetchStoreThemes(adminSession)
  const filter = new Filter({ theme: theme })

  if (filter.any()) {
    storeThemes = filterByTheme(storeThemes, filter)
  }

  return storeThemes
}

// These functions are near direct copies of the ones in the Shopify CLI codebase.
// They have been modified to not throw errors
export function filterByTheme(themes: Theme[], filter: Filter): Theme[] {
  const identifiers = filter.themeIdentifiers
  return identifiers.flatMap((identifier) => {
    return filterArray(themes, (theme) => {
      return `${theme.id}` === identifier || theme.name.toLowerCase().includes(identifier.toLowerCase())
    })
  })
}


export function filterArray(themes: Theme[], predicate: (theme: Theme) => boolean): Theme[] {
  return themes.filter(predicate)
}

