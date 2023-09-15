import BaseCommand from "@shopify/cli-kit/node/base-command";
import { init } from "../../services/bucket/init.js";
import { globalFlags } from '@shopify/cli-kit/node/cli'
import { Flags } from "@oclif/core";

export default class Init extends BaseCommand {
  static description = "Initialize .shopkeeper directory in the current directory";

  static flags = {
    ...globalFlags,
    bucket: Flags.string({
      char: 'b',
      multiple: true,
      env: "SKR_FLAG_BUCKET"
    }),
  };

  async run(): Promise<void> {
    const { flags } = await this.parse(Init)
    const buckets = flags.bucket || []

    await init(buckets)
  }
}
