#!/usr/bin/env node

import { Command } from 'commander';

const program = new Command();

program
  .command('download', 'download theme settings')
  .command('save', 'save theme settings to environment')
  .command('restore', 'restore theme settings from environment')

program.action(() => {
  program.help();
});

program.parse();
