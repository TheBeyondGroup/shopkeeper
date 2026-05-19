import {Flags} from '@oclif/core'
import {globalFlags} from '@shopify/cli-kit/node/cli'
import BaseCommand from '@shopify/cli-kit/node/base-command'
import {themeFlags} from '../../../utilities/shopify/flags.js'
import {mirrorTranslations, MirrorTranslationsFlags} from '../../../services/theme/translations.js'

export default class Mirror extends BaseCommand {
  static description =
    'Mirror theme-scoped translations from one theme to another. Translations registered via the Translate & Adapt app (or any caller of translationsRegister) are keyed to a specific theme GID and do NOT migrate between themes — so a blue/green deploy strands them on the previously-live color unless something explicitly carries them across. This command does that.'

  static examples = [
    {
      description: 'Mirror live -> on-deck before a blue/green deploy (standard use):',
      command: '<%= config.bin %> <%= command.id %> --blue 134599540817 --green 134599737425',
    },
    {
      description: 'Recover translations stranded on a no-longer-live theme:',
      command: '<%= config.bin %> <%= command.id %> --from 134599540817 --to 134599737425',
    },
    {
      description: 'Dry-run (print plan without writing):',
      command: '<%= config.bin %> <%= command.id %> --blue 1 --green 2 --dry-run',
    },
  ]

  static flags = {
    ...globalFlags,
    store: themeFlags.store,
    password: themeFlags.password,
    environment: themeFlags.environment,
    from: Flags.integer({
      description:
        'Source theme ID. When provided, must be combined with --to. Use this to anchor the mirror direction explicitly (e.g. for recovery scenarios where the most-up-to-date translation source is no longer [live]).',
      env: 'SKR_FLAG_FROM_THEME_ID',
    }),
    to: Flags.integer({
      description: 'Target theme ID. When provided, must be combined with --from.',
      env: 'SKR_FLAG_TO_THEME_ID',
    }),
    blue: Flags.integer({
      description:
        'Blue theme ID. Used when --from/--to are not provided: live theme becomes source, on-deck becomes target.',
      env: 'SKR_FLAG_BLUE_THEME_ID',
    }),
    green: Flags.integer({
      description: 'Green theme ID. Pairs with --blue.',
      env: 'SKR_FLAG_GREEN_THEME_ID',
    }),
    locale: Flags.string({
      description: 'Mirror only this locale (e.g. "fr"). Defaults to every published non-primary locale on the store.',
      env: 'SKR_FLAG_LOCALE',
    }),
    'resource-type': Flags.string({
      description:
        'Restrict the mirror to a single theme-scoped resource type. Useful for targeted ops or testing. Allowed: ONLINE_STORE_THEME, ONLINE_STORE_THEME_APP_EMBED, ONLINE_STORE_THEME_JSON_TEMPLATE, ONLINE_STORE_THEME_LOCALE_CONTENT, ONLINE_STORE_THEME_SECTION_GROUP, ONLINE_STORE_THEME_SETTINGS_CATEGORY, ONLINE_STORE_THEME_SETTINGS_DATA_SECTIONS.',
      env: 'SKR_FLAG_RESOURCE_TYPE',
    }),
    'dry-run': Flags.boolean({
      description: 'Build the write plan and print a summary, but do not invoke translationsRegister.',
      env: 'SKR_FLAG_DRY_RUN',
      default: false,
    }),
  }

  async run(): Promise<void> {
    const {flags} = await this.parse(Mirror)
    const serviceFlags: MirrorTranslationsFlags = {
      store: flags.store,
      password: flags.password,
      from: flags.from,
      to: flags.to,
      blue: flags.blue,
      green: flags.green,
      locale: flags.locale,
      resourceType: flags['resource-type'],
      dryRun: flags['dry-run'],
      noColor: flags['no-color'],
      verbose: flags.verbose,
    }
    await mirrorTranslations(serviceFlags)
  }
}
