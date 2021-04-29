import inquirer, { Answers } from 'inquirer'
import Config from '../lib/config'
import ThemekitDelegator from './themekitDelegator'

export default class Publisher {
  options: any

  constructor(options: object) {
    this.options = options
  }

  async run() {
    if(this.options.env) {
      if(new Config().filePresent()) {
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
    } else {
      console.log('--env option is mandatory');
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

  private publish() {
    new ThemekitDelegator('publish', [], this.options).run();
  }
}
