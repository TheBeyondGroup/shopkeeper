import { Flags } from '@oclif/core';
import BaseCommand from "@shopify/cli-kit/node/base-command";
import { globalFlags } from "@shopify/cli-kit/node/cli";
import { ensureAuthenticatedThemes } from "@shopify/cli-kit/node/session";
import { themeFlags } from "@shopify/theme/dist/cli/flags.js";
import { ensureThemeStore } from "@shopify/theme/dist/cli/utilities/theme-store.js";
import { get } from "../../services/theme/get.js";

export default class Get extends BaseCommand {
  static description = "Get details of theme";

  static flags = {
    ...globalFlags,
    store: themeFlags.store,
    password: themeFlags.password,
    theme: Flags.string({
      char: 't',
      required: true,
      description: 'Theme ID or name of the remote theme.',
      env: 'SHOPIFY_FLAG_THEME_ID',
    }),
    json: Flags.boolean({
      char: 'j',
      description: 'Output JSON instead of a UI.',
      env: 'SHOPIFY_FLAG_JSON',
    }),
  };

  async run(): Promise<void> {
    const { flags } = await this.parse(Get)
    const store = ensureThemeStore(flags)
    const adminSession = await ensureAuthenticatedThemes(store, flags.password)

    const themes = await get(adminSession, flags.theme!)

    if (flags.json) {
      themes.map(theme => this.logJson({
        id: theme.id,
        name: theme.name,
        role: theme.role,
        development: theme.hasDevelopmentRole
      }))
    } else {
      themes.map(theme => this.log(`${theme.id}`))
    }
  }
}
