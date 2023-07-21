import ThemeCommand from "@shopify/theme/dist/cli/utilities/theme-command.js";

export default class Deploy extends ThemeCommand {
  static description = "Deploy source to on-deck theme";

  static flags = {};

  async run(): Promise<void> { }
}
