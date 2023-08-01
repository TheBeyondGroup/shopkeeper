import BaseCommand from "@shopify/cli-kit/node/base-command";
import { init } from "../../services/bucket/init.js";
import { globalFlags } from '@shopify/cli-kit/node/cli'

export default class Init extends BaseCommand {
  static description = "Initialize .shopkeeper directory in the current directory";

  static flags = {
    ...globalFlags
  };

  async run(): Promise<void> {
    init()
  }
}
