#!/usr/bin/env node

import { Command } from 'commander';

const program = new Command();

program
  .description("lists the themes in your store, along with their IDs and statuses")
  .argument("[ROOT]")
  .option("-t, --theme", "the name or ID of the theme that you want to pull")
  .option("-l, --live", "Downloads the live (published) theme. This option doesn't require --theme")
  .option("-d, --development", "Downloads theme files from your remote development theme")
  .option("-n, --nodelete", "Runs the pull command without deleting local files")
  .option("-x, --ignore", "Skips downloading the specified files from Shopify")
  .option("-o, --only", "Downloads only the specified files from Shopify")
  .action(() => {
  })

program.parse();
