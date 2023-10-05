import { Flags } from '@oclif/core';
import { globalFlags } from "@shopify/cli-kit/node/cli";
import { ensureAuthenticatedThemes } from "@shopify/cli-kit/node/session";
import { themeFlags } from "@shopify/theme/dist/cli/flags.js";
import { ensureThemeStore } from "@shopify/theme/dist/cli/utilities/theme-store.js";
import ThemeCommand from '@shopify/theme/dist/cli/utilities/theme-command.js';
import { execCLI2 } from '@shopify/cli-kit/node/ruby';
import { getThemesByIdentifier } from '../../utilities/theme.js';

export default class Create extends ThemeCommand {
  static summary = "Create a theme with a name or ID. Update theme if one with name already exists"
  static description = `Create a theme with theme name or ID.
In most cases, you should use theme push.

This command exists for the case when you want create a theme by name that may
or may not exist. It will ensure that if one with the same name already exists,
it is updated.

theme push --unpublished --theme yellow will create a new theme named yellow each
time the command is run.

As a result this command exists.
`;

  static flags = {
    ...globalFlags,
    ...themeFlags,
    theme: Flags.string({
      char: 't',
      required: true,
      description: 'Theme ID or name of the remote theme.',
      env: 'SHOPIFY_FLAG_THEME_ID',
    }),
    nodelete: Flags.boolean({
      char: 'n',
      description: 'Runs the push command without deleting local files.',
      env: 'SHOPIFY_FLAG_NODELETE',
    }),
    json: Flags.boolean({
      char: 'j',
      description: 'Output JSON instead of a UI.',
      env: 'SHOPIFY_FLAG_JSON',
    }),
  };

  static cli2Flags = [
    'theme',
    'nodelete',
    'json',
    'unpublished'
  ]

  async run(): Promise<void> {
    const { flags } = await this.parse(Create)
    const store = ensureThemeStore(flags)
    const adminSession = await ensureAuthenticatedThemes(store, flags.password)

    const matchingThemes = await getThemesByIdentifier(adminSession, flags.theme!)
    if (!matchingThemes.length) {
      flags["unpublished"] = true
    }

    const flagsToPass = this.passThroughFlags(flags, { allowedFlags: Create.cli2Flags })
    const command = ['theme', 'push', flags.path, ...flagsToPass]

    await execCLI2(command, { store, adminToken: adminSession.token })
  }
}
