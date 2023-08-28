import BaseCommand from "@shopify/cli-kit/node/base-command";
import { globalFlags } from '@shopify/cli-kit/node/cli'
import { deleteBucket } from "../../services/bucket/delete.js";
import { Flags } from "@oclif/core";

export default class Delete extends BaseCommand {
  static description = "Delete a bucket";

  static flags = {
    ...globalFlags,
    bucket: Flags.string({
      char: 'b',
      required: true,
      multiple: true,
      env: "SKR_FLAG_BUCKET"
    }),
    force: Flags.boolean({
      char: 'f',
      description: 'Skip confirmation.',
      env: 'SHOPIFY_FLAG_FORCE',
    }),
  };

  async run(): Promise<void> {
    const { flags } = await this.parse(Delete)
    await deleteBucket(flags.bucket!, flags.force)
  }
}
