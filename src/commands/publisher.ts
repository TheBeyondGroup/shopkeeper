import inquirer, { Answers } from 'inquirer'
import Config from '../lib/config'
import ShopifyClient from '../../src/lib/shopify-client'
import ThemekitDelegator from './themekitDelegator'

export default class Publisher {
  options: any
  config: Config

  constructor(options: object) {
    this.options = options
    this.config = new Config()
  }

  async run() {
    if(this.config.filePresent()) {
      if(this.options.force) {
        delete this.options['force']
        this.publish();
      } else {
        try {
          let answer = await this.inquire()
          if(answer) {
            this.publish();
          } else {
            console.log('Aborted');
          }
        } catch (error) {
          console.error(error);
        }
      }
    } else {
      console.log('config.yml does not exist');
    }
  }

  private async inquire() {
    return inquirer
      .prompt([{ type: 'input', name: 'confirmation', message: 'Are you sure?'}])
      .then((answers: Answers) => {
        return this.acceptedConfirmationAnswers().includes(answers.confirmation);
      })
  }

  private acceptedConfirmationAnswers() {
    return ['Y', 'y', 'Yes', 'yes'];
  }

  private async publish() {
    const storeUrl = `https://${process.env.PROD_STORE_URL}`;
    const storePassword = process.env.PROD_PASSWORD;

    if (!this.options.env && !this.options.themeid && storeUrl && storePassword) {
      const client = new ShopifyClient(storeUrl, storePassword)
      const themes = await client.getThemes()
      const publishedTheme = themes.find(({ role }: { role: string }) => role === 'main')
      this.options.env = this.selectBlueGreenEnvironment(publishedTheme)
    }

    if(this.options.env) {
      new ThemekitDelegator('publish', [], this.options).run();
    }
  }

  private selectBlueGreenEnvironment(publishedTheme: any) {
    switch (publishedTheme.id.toString()) {
      case process.env.PROD_BLUE_THEME_ID:
        return 'production-green';
      case process.env.PROD_GREEN_THEME_ID:
        return 'production-blue'
      default:
        return null
    }
  }
}
