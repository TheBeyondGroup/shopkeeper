import {AbortError} from '@shopify/cli-kit/node/error'
import {AdminSession, ensureAuthenticatedThemes} from '@shopify/cli-kit/node/session'
import {themeUpdate} from '@shopify/cli-kit/node/themes/api'
import {getLatestGitCommit} from '@shopify/cli-kit/node/git'
import {deployToLive, deployTheme as deployTheme, pullLiveThemeSettings} from '../../utilities/theme.js'
import {findPathUp} from '@shopify/cli-kit/node/fs'
import {BLUE_GREEN_STRATEGY} from '../../utilities/constants.js'
import {renderText} from '@shopify/cli-kit/node/ui'
import {findThemes} from '../../utilities/shopify/theme-selector.js'
import {ensureThemeStore} from '../../utilities/shopify/theme-store.js'

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
}

export async function deploy(flags: DeployFlags) {
  switch (flags.strategy) {
    case BLUE_GREEN_STRATEGY:
      await blueGreenDeploy(flags)
      break

    default:
      await basicDeploy(flags)
      break
  }
}

export async function blueGreenDeploy(flags: DeployFlags) {
  const {password, blue, green} = flags
  const store = ensureThemeStore({store: flags.store})
  const adminSession = await ensureAuthenticatedThemes(store, password)

  renderText({text: 'Pulling theme settings'})
  await pullLiveThemeSettings(flags)

  const liveThemeId = await getLiveTheme(adminSession)
  const onDeckTheme = getOnDeckThemeId(liveThemeId, blue!, green!)
  await deployTheme(onDeckTheme.id, flags)

  const headSHA = await gitHeadHash()
  const newOnDeckThemeName = `[${headSHA}] Production - ${onDeckTheme.name}`
  await themeUpdate(onDeckTheme.id, {name: newOnDeckThemeName}, adminSession)
  renderText({text: `${onDeckTheme.name} renamed to ${newOnDeckThemeName}`})

  if (flags.publish) {
    renderText({text: `${newOnDeckThemeName} published`})
  }
}

export async function basicDeploy(flags: DeployFlags) {
  const {password} = flags
  const store = ensureThemeStore({store: flags.store})
  const adminSession = await ensureAuthenticatedThemes(store, password)
  const liveThemeId = await getLiveTheme(adminSession)

  renderText({text: 'Pulling theme settings'})
  await pullLiveThemeSettings(flags)
  await deployToLive(flags)

  const headSHA = await gitHeadHash()
  const themeName = `[${headSHA}] Production`
  await themeUpdate(liveThemeId, {name: themeName}, adminSession)
  renderText({text: `Live theme renamed to ${themeName}`})
}

export async function getLiveTheme(adminSession: AdminSession): Promise<number> {
  const themes = await findThemes(adminSession.storeFqdn, adminSession.token, {live: true})
  if (!themes.length) {
    throw new AbortError("Something very bad has happened. The store doesn't have a live theme.")
  }
  return themes[0]!.id
}

export function getOnDeckThemeId(liveThemeId: number, blueThemeId: number, greenThemeId: number): OnDeckTheme {
  if (liveThemeId === blueThemeId) {
    return {id: greenThemeId, name: 'Green'}
  } else {
    return {id: blueThemeId, name: 'Blue'}
  }
}

export async function gitHeadHash(): Promise<string> {
  const gitDirectory = await findPathUp('.git', {type: 'directory'})
  const latestCommit = await getLatestGitCommit(gitDirectory)
  return latestCommit.hash.substring(0, 8)
}
