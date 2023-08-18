import { Flags } from '@oclif/core'
import { globalFlags } from '@shopify/cli-kit/node/cli'
import { execCLI2 } from '@shopify/cli-kit/node/ruby'
import { ensureAuthenticatedThemes } from '@shopify/cli-kit/node/session'
import { themeFlags } from '@shopify/theme/dist/cli/flags.js';
import ThemeCommand from '@shopify/theme/dist/cli/utilities/theme-command.js';
import { ensureThemeStore } from '@shopify/theme/dist/cli/utilities/theme-store.js'
import { cli2settingFlags } from '../../../utilities/bucket.js';

export default class Download extends ThemeCommand {
  static description = "Download settings from live theme.";

  static flags = {
    ...globalFlags,
    ...themeFlags,
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
  };

  static cli2Flags = ['theme', 'live', 'nodelete']

  async run(): Promise<void> {
    const { flags } = await this.parse(Download)
    const store = ensureThemeStore(flags)
    const adminSession = await ensureAuthenticatedThemes(store, flags.password)
    const flagsToPass = this.passThroughFlags(flags, { allowedFlags: Download.cli2Flags })
    const settingFilterFlags = cli2settingFlags()
    const command = ['theme', 'pull', flags.path, ...flagsToPass, ...settingFilterFlags]

    await execCLI2(command, { store, adminToken: adminSession.token })
  }
}
