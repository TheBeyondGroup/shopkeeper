import { AbortError } from '@shopify/cli-kit/node/error'
import { AdminSession, ensureAuthenticatedThemes } from '@shopify/cli-kit/node/session'
import { themeUpdate, themeDelete } from '@shopify/cli-kit/node/themes/api'
import { getLatestGitCommit } from '@shopify/cli-kit/node/git'
import { deployToLive, deployTheme, pullLiveThemeSettings } from '../../utilities/theme.js'
import { push } from '@shopify/cli'
import { PushFlags } from '../../utilities/shopify/services/push.js'
import { findPathUp } from '@shopify/cli-kit/node/fs'
import { BLUE_GREEN_STRATEGY, HISTORY_STRATEGY } from '../../utilities/constants.js'
import { renderText } from '@shopify/cli-kit/node/ui'
import { findThemes } from '../../utilities/shopify/theme-selector.js'
import { ensureThemeStore } from '../../utilities/shopify/theme-store.js'
import { Theme } from '@shopify/cli-kit/node/themes/types.js'

// History theme naming pattern: [GIT_SHA] DD-MM-YYYY-timestamp
const HISTORY_THEME_PATTERN = /^\[[\da-f]{8}\] \d{2}-\d{2}-\d{4}-(\d+)$/

type OnDeckTheme = {
  id: number
  name: string
}

export interface DeployFlags {
  /**
   * Disable color output.
   */
  noColor?: boolean

  /**
   * Increase the verbosity of the output.
   */
  verbose?: boolean
  /**
   * The directory path to download the theme.
   */
  path?: string

  /**
   * The password for authenticating with the store.
   */
  password?: string

  /**
   * Store URL. It can be the store prefix (example.myshopify.com) or the full myshopify.com URL (https://example.myshopify.com).
   */
  store?: string

  /**
   * Runs the pull command without deleting local files.
   */
  nodelete?: boolean

  publish: boolean
  strategy: string
  blue?: number
  green?: number

  /**
   * The number of history themes to retain when using the history deployment strategy.
   */
  themeCount?: number
}

export async function deploy(flags: DeployFlags) {
  switch (flags.strategy) {
    case BLUE_GREEN_STRATEGY:
      await blueGreenDeploy(flags)
      break

    case HISTORY_STRATEGY:
      await historyDeploy(flags)
      break

    default:
      await basicDeploy(flags)
      break
  }
}

export async function blueGreenDeploy(flags: DeployFlags) {
  const { password, blue, green } = flags
  const store = ensureThemeStore({ store: flags.store })
  const adminSession = await ensureAuthenticatedThemes(store, password)

  renderText({ text: 'Pulling theme settings' })
  await pullLiveThemeSettings(flags)

  const liveThemeId = await getLiveTheme(adminSession)
  const onDeckTheme = getOnDeckThemeId(liveThemeId, blue!, green!)
  await deployTheme(onDeckTheme.id, flags)

  const headSHA = await gitHeadHash()
  const newOnDeckThemeName = `[${headSHA}] Production - ${onDeckTheme.name}`
  await themeUpdate(onDeckTheme.id, { name: newOnDeckThemeName }, adminSession)
  renderText({ text: `${onDeckTheme.name} renamed to ${newOnDeckThemeName}` })

  if (flags.publish) {
    renderText({ text: `${newOnDeckThemeName} published` })
  }
}

export async function basicDeploy(flags: DeployFlags) {
  const { password } = flags
  const store = ensureThemeStore({ store: flags.store })
  const adminSession = await ensureAuthenticatedThemes(store, password)
  const liveThemeId = await getLiveTheme(adminSession)

  renderText({ text: 'Pulling theme settings' })
  await pullLiveThemeSettings(flags)
  await deployToLive(flags)

  const headSHA = await gitHeadHash()
  const themeName = `[${headSHA}] Production`
  await themeUpdate(liveThemeId, { name: themeName }, adminSession)
  renderText({ text: `Live theme renamed to ${themeName}` })
}

export async function historyDeploy(flags: DeployFlags) {
  const { password, themeCount } = flags
  const store = ensureThemeStore({ store: flags.store })
  const adminSession = await ensureAuthenticatedThemes(store, password)

  // Pull live theme settings before deployment
  renderText({ text: 'Pulling theme settings' })
  await pullLiveThemeSettings(flags)

  // Generate theme name and create new theme
  const themeName = await generateHistoryThemeName()
  renderText({ text: `Creating new history theme: ${themeName}` })

  const pushFlags: PushFlags = {
    ...flags,
    theme: themeName,
    unpublished: true, // Always create as unpublished initially
  }

  // Deploy to new theme
  await push(pushFlags)
  renderText({ text: `Successfully deployed to theme: ${themeName}` })

  // Handle publishing if requested
  if (flags.publish) {
    // Find the newly created theme to get its ID
    const themes = await findThemes(adminSession.storeFqdn, adminSession.token, {})
    const newTheme = themes.find(theme => theme.name === themeName)

    if (newTheme) {
      await themeUpdate(newTheme.id, { role: 'main' }, adminSession)
      renderText({ text: `Published theme: ${themeName}` })
    } else {
      renderText({ text: `Warning: Could not find newly created theme ${themeName} for publishing` })
    }
  }

  // Cleanup excess themes
  const retentionLimit = getThemeRetentionLimit(themeCount)
  await cleanupExcessHistoryThemes(adminSession, retentionLimit)
}

export function getThemeRetentionLimit(themeCount?: number): number {
  if (themeCount !== undefined && themeCount > 0) {
    return themeCount
  }

  return 10 // Default
}

export async function getLiveTheme(adminSession: AdminSession): Promise<number> {
  const themes = await findThemes(adminSession.storeFqdn, adminSession.token, { live: true })
  if (!themes.length) {
    throw new AbortError("Something very bad has happened. The store doesn't have a live theme.")
  }
  return themes[0]!.id
}

export function getOnDeckThemeId(liveThemeId: number, blueThemeId: number, greenThemeId: number): OnDeckTheme {
  if (liveThemeId === blueThemeId) {
    return { id: greenThemeId, name: 'Green' }
  } else {
    return { id: blueThemeId, name: 'Blue' }
  }
}

export async function gitHeadHash(): Promise<string> {
  const gitDirectory = await findPathUp('.git', { type: 'directory' })
  const latestCommit = await getLatestGitCommit(gitDirectory)
  return latestCommit.hash.substring(0, 8)
}

export async function generateHistoryThemeName(now: Date = new Date()): Promise<string> {
  const gitSHA = await gitHeadHash()
  const dateStr = formatDateDDMMYYYY(now)
  const timestamp = Math.floor(now.getTime() / 1000)

  return `[${gitSHA}] ${dateStr}-${timestamp}`
}

export function parseHistoryThemeName(themeName: string): number | null {
  const match = themeName.match(HISTORY_THEME_PATTERN)

  if (!match) {
    return null
  }

  const timestamp = parseInt(match[1]!, 10)
  return isNaN(timestamp) ? null : timestamp
}

export function isHistoryTheme(themeName: string): boolean {
  return HISTORY_THEME_PATTERN.test(themeName)
}

export function formatDateDDMMYYYY(date: Date): string {
  const day = String(date.getUTCDate()).padStart(2, '0')
  const month = String(date.getUTCMonth() + 1).padStart(2, '0')
  const year = date.getUTCFullYear()
  return `${day}-${month}-${year}`
}

export function getCurrentUTCTimestamp(now: Date = new Date()): number {
  return Math.floor(now.getTime() / 1000)
}

export async function getHistoryThemes(adminSession: AdminSession): Promise<Theme[]> {
  const allThemes = await findThemes(adminSession.storeFqdn, adminSession.token, {})
  return allThemes.filter(theme => isHistoryTheme(theme.name))
}

export function sortHistoryThemesByAge(themes: Theme[]): Theme[] {
  return themes.sort((a, b) => {
    const timestampA = parseHistoryThemeName(a.name)
    const timestampB = parseHistoryThemeName(b.name)

    // If either timestamp is null, put those themes at the end
    if (timestampA === null && timestampB === null) return 0
    if (timestampA === null) return 1
    if (timestampB === null) return -1

    // Sort oldest first (smaller timestamp first)
    return timestampA - timestampB
  })
}

export async function deleteHistoryTheme(themeId: number, adminSession: AdminSession): Promise<boolean> {
  try {
    await themeDelete(themeId, adminSession)
    return true
  } catch (error) {
    renderText({ text: `Failed to delete theme ${themeId}: ${error}` })
    return false
  }
}

export async function cleanupExcessHistoryThemes(adminSession: AdminSession, retentionLimit: number): Promise<void> {
  const historyThemes = await getHistoryThemes(adminSession)

  if (historyThemes.length <= retentionLimit) {
    return // No cleanup needed
  }

  const sortedThemes = sortHistoryThemesByAge(historyThemes)
  const themesToDelete = sortedThemes.slice(0, historyThemes.length - retentionLimit)

  renderText({ text: `Cleaning up ${themesToDelete.length} excess history themes...` })

  let successCount = 0
  let failureCount = 0

  for (const theme of themesToDelete) {
    const success = await deleteHistoryTheme(theme.id, adminSession)
    if (success) {
      successCount++
      renderText({ text: `Deleted theme: ${theme.name}` })
    } else {
      failureCount++
    }
  }

  renderText({
    text: `Cleanup complete: ${successCount} themes deleted successfully, ${failureCount} failures`
  })
}
