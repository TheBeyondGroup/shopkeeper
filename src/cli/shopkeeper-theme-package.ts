#!/usr/bin/env node

import { Command } from 'commander';

const program = new Command();

program
  .description("lists the themes in your store, along with their IDs and statuses")
  .action(() => {
  })

program.parse();
