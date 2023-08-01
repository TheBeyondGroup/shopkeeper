import BaseCommand from "@shopify/cli-kit/node/base-command";
import { globalFlags } from "@shopify/cli-kit/node/cli";
import { current } from "../../services/bucket/current.js";

export default class Current extends BaseCommand {
  static description = "Output the current bucket";

  static flags = {
    ...globalFlags,
  };

  async run(): Promise<void> {
    current();
  }
}
