#!/usr/bin/env node

import { Command } from 'commander';

const program = new Command();

program
  .command("switch", "switch to the environment variables for a store")
  .command("current", 'display current store')

program.action(() => {
  program.help();
});

program.parse();
