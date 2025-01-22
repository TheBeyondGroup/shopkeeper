import {Flags} from '@oclif/core'
import {globalFlags} from '@shopify/cli-kit/node/cli'
import {getThemesByIdentifier} from '../../utilities/theme.js'
import {themeFlags} from '../../utilities/shopify/flags.js'
import ThemeCommand from '../../utilities/shopify/theme-command.js'
import {push} from '@shopify/cli'
import {PushFlags} from '../../utilities/shopify/services/push.js'

export default class Create extends ThemeCommand {
  static summary = 'Create a theme with a name or ID. Update theme if one with name already exists'
  static description = `Create a theme with theme name or ID.
In most cases, you should use theme push.

This command exists for the case when you want create a theme by name that may
or may not exist. It will ensure that if one with the same name already exists,
it is updated.

theme push --unpublished --theme yellow will create a new theme named yellow each
time the command is run.

As a result this command exists.
`

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
  }

  async run(): Promise<void> {
    const {flags} = await this.parse(Create)

    const pushFlags: PushFlags = {
      ...flags,
    }
    const matchingThemes = await getThemesByIdentifier(flags.store, flags.password, flags.theme)
    if (!matchingThemes.length) {
      pushFlags['unpublished'] = true
    }

    await push(pushFlags)
  }
}
