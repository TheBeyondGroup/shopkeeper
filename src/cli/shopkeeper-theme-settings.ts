#!/usr/bin/env node

import { Command } from 'commander';

const program = new Command();

program
  .command('download', 'download theme settings')
  .command('save', 'save theme settings to shopkeeper cache')
  .command('restore', 'restore theme settings from shopkeeper cache')
  // .command('upload', 'upload theme settings')

program.action(() => {
  program.help();
});

program.parse();
