import BaseCommand from "@shopify/cli-kit/node/base-command";
import { globalFlags } from "@shopify/cli-kit/node/cli";
import { list } from "../../services/bucket/list.js";

export default class List extends BaseCommand {
  static description = "List buckets";

  static flags = {
    ...globalFlags,
  };

  async run(): Promise<void> {
    list();
  }
}
