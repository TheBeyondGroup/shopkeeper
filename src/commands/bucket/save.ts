import { Args, Flags } from "@oclif/core";
import BaseCommand from "@shopify/cli-kit/node/base-command";
import { globalFlags } from '@shopify/cli-kit/node/cli';
import { renderSuccess } from "@shopify/cli-kit/node/ui";
import { themeFlags } from '@shopify/theme/dist/cli/flags.js';
import { save } from "../../services/bucket/save.js";
import { getBucketByPrompt } from "../../utilities/bucket.js";

export default class Save extends BaseCommand {
  static description = "Saves the current theme settings to the specified bucket";

  static args = {
    bucket: Args.string({
      name: "bucket",
      description: "The bucket where you want to save your settings.",
    })
  };

  static flags = {
    ...globalFlags,
    path: themeFlags.path,
    environment: themeFlags.environment,
    nodelete: Flags.boolean({
      char: "n",
      default: false,
      description: "Runs the save command without deleting the bucket's contents.",
      env: "SHOPIFY_FLAG_NODELETE",
    }),
  };

  async run(): Promise<void> {
    const { args, flags } = await this.parse(Save)
    const bucket = args.bucket || await getBucketByPrompt()
    const fileMoves = await save(bucket, flags.path, flags.nodelete)

    renderSuccess({
      headline: `Saved settings to ${bucket}:`,
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
