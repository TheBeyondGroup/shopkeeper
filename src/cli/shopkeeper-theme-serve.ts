#!/usr/bin/env node

import { Command } from 'commander';

const program = new Command();

program
  .description("lists the themes in your store, along with their IDs and statuses")
  .argument("[ROOT]")
  .option("--live-reload <MODE>", "")
  .option("--host", "")
  .option("--port", "")
  .option("--theme-editor-sync", "")
  .action(() => {
  })

program.parse();
