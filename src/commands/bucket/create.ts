import BaseCommand from "@shopify/cli-kit/node/base-command";
import { create } from "../../services/bucket/create.js"
import { globalFlags } from '@shopify/cli-kit/node/cli'

export default class Create extends BaseCommand {
  static description = "Create a bucket in .shopkeeper";

  static strict = false

  static flags: any = {
    ...globalFlags
  };

  async run(): Promise<void> {
    const { argv } = await this.parse(Create)
    create(argv)
  }
}
