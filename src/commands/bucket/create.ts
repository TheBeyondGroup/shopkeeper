import BaseCommand from "@shopify/cli-kit/node/base-command";
import { create } from "../../services/bucket/create.js"
import { globalFlags } from '@shopify/cli-kit/node/cli'
import { Flags } from "@oclif/core";

export default class Create extends BaseCommand {
  static description = "Create a bucket in .shopkeeper";

  static flags = {
    ...globalFlags,
    bucket: Flags.string({
      char: 'b',
      required: true,
      multiple: true,
      env: "SKR_FLAG_BUCKET"
    }),
  };

  async run(): Promise<void> {
    const { flags } = await this.parse(Create)
    const buckets = flags.bucket || []
    await create(buckets)
  }
}
