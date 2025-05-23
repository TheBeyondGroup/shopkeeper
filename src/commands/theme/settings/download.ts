import { Flags } from '@oclif/core'
import { globalFlags } from '@shopify/cli-kit/node/cli'
import BaseCommand from '@shopify/cli-kit/node/base-command'
import { themeFlags } from '../../../utilities/shopify/flags.js'
import { downloadThemeSettings, DownloadFlags } from '../../../utilities/theme.js'

export default class Download extends BaseCommand {
  static description = 'Download settings from live theme.'

  static flags = {
    ...globalFlags,
    ...themeFlags,
    development: Flags.boolean({
      char: 'd',
      description: 'Pull settings files from your remote development theme.',
      env: 'SHOPIFY_FLAG_DEVELOPMENT',
    }),
    live: Flags.boolean({
      char: 'l',
      description: 'Pull settings files from your remote live theme.',
      env: 'SHOPIFY_FLAG_LIVE',
    }),
    theme: Flags.string({
      char: 't',
      description: 'Theme ID or name of the remote theme.',
      env: 'SHOPIFY_FLAG_THEME_ID',
    }),
    nodelete: Flags.boolean({
      char: 'n',
      description: 'Runs the pull command without deleting local files.',
      env: 'SHOPIFY_FLAG_NODELETE',
    }),
  }

  async run(): Promise<void> {
    const { flags } = await this.parse(Download)
    await downloadThemeSettings(flags as DownloadFlags)
  }
}
