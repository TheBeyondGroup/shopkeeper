import {AbortError} from '@shopify/cli-kit/node/error'
import {AdminSession, ensureAuthenticatedThemes} from '@shopify/cli-kit/node/session'
import {themeUpdate} from '@shopify/cli-kit/node/themes/api'
import {getLatestGitCommit} from '@shopify/cli-kit/node/git'
import {deployToLive, deployTheme as deployTheme, pullLiveThemeSettings} from '../../utilities/theme.js'
import {findPathUp} from '@shopify/cli-kit/node/fs'
import {BLUE_GREEN_STRATEGY} from '../../utilities/constants.js'
import {outputInfo, outputWarn} from '@shopify/cli-kit/node/output'
import {findThemes} from '../../utilities/shopify/theme-selector.js'
import {ensureThemeStore} from '../../utilities/shopify/theme-store.js'
import {mirrorTranslations as runMirrorTranslations} from './translations.js'

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
   * Opt-in. When true, mirror theme-scoped translations (Translate & Adapt
   * template / locale-content / settings translations) from the currently-
   * live theme onto the on-deck theme before deploying code. Translations
   * registered via the Translations API are keyed to a theme GID, so without
   * this step they are stranded on the previously-live color and disappear
   * from the storefront on promotion.
   *
   * Default-off because most client stores don't use Translate & Adapt and
   * paying the (cheap, but non-zero) pre-flight cost on every deploy isn't
   * justified for them. Stores that do use it (Hiya) should set
   * SKR_FLAG_MIRROR_TRANSLATIONS=true in their deploy environment.
   */
  mirrorTranslations?: boolean
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

  outputInfo('Pulling theme settings')
  await pullLiveThemeSettings(flags)

  const liveThemeId = await getLiveTheme(adminSession)
  const onDeckTheme = getOnDeckThemeId(liveThemeId, blue!, green!)

  if (flags.mirrorTranslations) {
    try {
      outputInfo('Mirroring theme-scoped translations from live to on-deck')
      await runMirrorTranslations({
        store: flags.store,
        password: flags.password,
        from: liveThemeId,
        to: onDeckTheme.id,
      })
    } catch (error) {
      outputWarn(
        `Failed to mirror theme translations before deploy. Theme-scoped translations registered via Translate & Adapt on the previously-live theme may not appear after this deploy promotes ${onDeckTheme.name}.`,
      )
      outputWarn(error instanceof Error ? error.message : String(error))
    }
  }

  await deployTheme(onDeckTheme.id, flags)

  const headSHA = await gitHeadHash()
  const newOnDeckThemeName = `[${headSHA}] Production - ${onDeckTheme.name}`
  await themeUpdate(onDeckTheme.id, {name: newOnDeckThemeName}, adminSession)
  outputInfo(`${onDeckTheme.name} renamed to ${newOnDeckThemeName}`)

  if (flags.publish) {
    outputInfo(`${newOnDeckThemeName} published`)
  }
}

export async function basicDeploy(flags: DeployFlags) {
  const {password} = flags
  const store = ensureThemeStore({store: flags.store})
  const adminSession = await ensureAuthenticatedThemes(store, password)
  const liveThemeId = await getLiveTheme(adminSession)

  outputInfo('Pulling theme settings')
  await pullLiveThemeSettings(flags)
  await deployToLive(flags)

  const headSHA = await gitHeadHash()
  const themeName = `[${headSHA}] Production`
  await themeUpdate(liveThemeId, {name: themeName}, adminSession)
  outputInfo(`Live theme renamed to ${themeName}`)
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
