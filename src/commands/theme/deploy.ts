import { Flags } from '@oclif/core';
import { globalFlags } from '@shopify/cli-kit/node/cli';
import { ensureAuthenticatedThemes } from '@shopify/cli-kit/node/session';
import { themeFlags } from '@shopify/theme/dist/cli/flags.js';
import { ensureThemeStore } from '@shopify/theme/dist/cli/utilities/theme-store.js';
import ThemeCommand from '@shopify/theme/dist/cli/utilities/theme-command.js';
import { deploy } from '../../services/theme/deploy.js';
import { BLUE_GREEN_STRATEGY } from '../../utilities/constants.js';

export default class Deploy extends ThemeCommand {
  static description = "Deploy source to on-deck theme";

  static flags = {
    ...globalFlags,
    ...themeFlags,
    nodelete: Flags.boolean({
      char: 'n',
      description: 'Runs the push command without deleting local files.',
      env: 'SHOPIFY_FLAG_NODELETE',
    }),
    green: Flags.integer({
      description: 'Green theme ID',
      env: 'SKR_FLAG_GREEN_THEME_ID'
    }),
    blue: Flags.integer({
      description: 'Blue theme ID',
      env: 'SKR_FLAG_BLUE_THEME_ID'
    }),
    strategy: Flags.string({
      description: 'Strategy to use for deployment',
      hidden: true,
      default: BLUE_GREEN_STRATEGY,
      env: 'SKR_FLAG_STRATEGY',
      relationships: [
        {
          type: 'all', flags: [
            { name: 'blue', when: async (flags) => flags['strategy'] === BLUE_GREEN_STRATEGY },
            { name: 'green', when: async (flags) => flags['strategy'] === BLUE_GREEN_STRATEGY }
          ]
        }
      ]
    })
  };

  static cli2Flags = ['nodelete']

  async run(): Promise<void> {
    const { flags } = await this.parse(Deploy)
    const store = ensureThemeStore(flags)
    const adminSession = await ensureAuthenticatedThemes(store, flags.password)
    const passThroughFlags = this.passThroughFlags(flags, { allowedFlags: Deploy.cli2Flags })

    await deploy(adminSession, flags.path, passThroughFlags, flags.strategy!, flags.blue || 0, flags.green || 0)
  }
}
