import Command from '@shopify/cli-kit/node/base-command'

export default abstract class ThemeCommand extends Command {
  environmentsFilename(): string {
    return 'shopify.theme.toml'
  }
}
