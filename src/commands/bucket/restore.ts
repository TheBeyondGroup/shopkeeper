import { Args, Flags } from "@oclif/core";
import BaseCommand from "@shopify/cli-kit/node/base-command";
import { globalFlags } from '@shopify/cli-kit/node/cli'
import { renderSuccess } from "@shopify/cli-kit/node/ui";
import { themeFlags } from '@shopify/theme/dist/cli/flags.js';
import { restore } from "../../services/bucket/restore.js";
import { getBucketByPrompt } from "../../utilities/bucket.js";

export default class Restore extends BaseCommand {
  static description = "Restores the theme settings from the specified bucket";

  static args = {
    bucket: Args.string({
      name: "bucket",
      description: "The bucket you want to restore your settings from.",
    })
  }

  static flags = {
    ...globalFlags,
    path: themeFlags.path,
    environment: themeFlags.environment,
    nodelete: Flags.boolean({
      char: "n",
      default: false,
      description: "Runs the restore command without removing the theme's JSON settings.",
      env: "SHOPIFY_FLAG_NODELETE",
    }),
  };

  async run(): Promise<void> {
    const { args, flags } = await this.parse(Restore)
    const bucket = args.bucket || await getBucketByPrompt()
    const fileMoves = await restore(bucket, flags.path, flags.nodelete)

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
