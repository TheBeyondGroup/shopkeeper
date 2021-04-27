#!/usr/bin/env node

import { Command } from 'commander';

const program = new Command();

program
  .command("settings", "manage a theme's settings")
  .command("deploy", 'deploy changes to a store')

program.action(() => {
  program.help();
});

program.parse();
