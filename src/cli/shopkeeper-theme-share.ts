#!/usr/bin/env node

import { Command } from 'commander';

const program = new Command();

program
  .description("lists the themes in your store, along with their IDs and statuses")
  .argument("[ROOT]", "Uploads your theme as a new, unpublished theme in your theme library. The theme is given a randomized name.")
  .action(() => {
  })

program.parse();
