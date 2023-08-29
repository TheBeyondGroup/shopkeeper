import { Args, Flags } from "@oclif/core";
import BaseCommand from "@shopify/cli-kit/node/base-command";
import { globalFlags } from '@shopify/cli-kit/node/cli';
import { renderSuccess } from "@shopify/cli-kit/node/ui";
import { themeFlags } from '@shopify/theme/dist/cli/flags.js';
import { switchBucket } from "../../services/bucket/switch.js";
import { getBucketByPrompt } from "../../utilities/bucket.js";

export default class Switch extends BaseCommand {
  static description = "Switches the current bucket by copying settings and .env";

  static flags = {
    ...globalFlags,
    path: themeFlags.path,
    environment: themeFlags.environment,
    bucket: Flags.string({
      name: "bucket",
      description: "The bucket to switch to",
    }),
    nodelete: Flags.boolean({
      char: "n",
      default: false,
      description: "Runs the restore command without removing the theme's JSON settings.",
      env: "SHOPIFY_FLAG_NODELETE",
    })
  }

  async run(): Promise<void> {
    const { flags } = await this.parse(Switch);
    const bucket = flags.bucket || await getBucketByPrompt()
    const fileMoves = await switchBucket(bucket, flags.path, flags.nodelete)

    renderSuccess({
      headline: `Restored settings from ${bucket}:`,
      body: [
        {
          list: {
            items: fileMoves.map(move => move.file)
          },
        },
      ],
    })
  }
}
