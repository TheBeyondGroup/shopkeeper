#!/usr/bin/env node

import { Command } from 'commander';

const program = new Command();

program
  .command('download', 'download')

program.action(() => {
  program.help();
});

program.parse();
