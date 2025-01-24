import {Flags} from '@oclif/core'
import {globalFlags} from '@shopify/cli-kit/node/cli'
import {deploy, DeployFlags} from '../../services/theme/deploy.js'
import {BLUE_GREEN_STRATEGY, DEPLOYMENT_STRATEGIES} from '../../utilities/constants.js'
import {themeFlags} from '../../utilities/shopify/flags.js'
import ThemeCommand from '../../utilities/shopify/theme-command.js'

export default class Deploy extends ThemeCommand {
  static description = 'Deploy theme source to store'

  static flags = {
    ...globalFlags,
    ...themeFlags,
    nodelete: Flags.boolean({
      char: 'n',
      description: 'Runs the push command without deleting local files.',
      env: 'SHOPIFY_FLAG_NODELETE',
    }),
    publish: Flags.boolean({
      description: 'Publishes the on-deck theme after deploying',
      default: false,
      env: 'SKR_FLAG_PUBLISH',
    }),
    green: Flags.integer({
      description: 'Green theme ID',
      env: 'SKR_FLAG_GREEN_THEME_ID',
    }),
    blue: Flags.integer({
      description: 'Blue theme ID',
      env: 'SKR_FLAG_BLUE_THEME_ID',
    }),
    strategy: Flags.string({
      description: 'Strategy to use for deployment',
      default: BLUE_GREEN_STRATEGY,
      options: DEPLOYMENT_STRATEGIES,
      env: 'SKR_FLAG_STRATEGY',
      relationships: [
        {
          type: 'all',
          flags: [
            {name: 'blue', when: async (flags) => flags['strategy'] === BLUE_GREEN_STRATEGY},
            {name: 'green', when: async (flags) => flags['strategy'] === BLUE_GREEN_STRATEGY},
          ],
        },
      ],
    }),
  }

  async run(): Promise<void> {
    const {flags} = await this.parse(Deploy)

    const deployFlags: DeployFlags = {
      verbose: flags.verbose,
      noColor: flags['no-color'],
      path: flags.path,
      password: flags.password,
      store: flags.store,
      nodelete: flags.nodelete,
      publish: flags.publish,
      strategy: flags.strategy,
      green: flags.green,
      blue: flags.blue,
    }
    await deploy(deployFlags)
  }
}
