import {renderWarning} from '@shopify/cli-kit/node/ui'
import Pull from './pull.js'

export default class Download extends Pull {
  static hidden = true

  async run() {
    renderWarning({
      headline: ['The', {command: 'shopkeeper theme settings download'}, 'command is deprecated.'],
      body: ['Use', {command: 'shopify theme settings pull'}, 'instead.'],
    })

    await super.run()
  }
}
