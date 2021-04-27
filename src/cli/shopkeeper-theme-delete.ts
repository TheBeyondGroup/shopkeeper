#!/usr/bin/env node

import { Command } from 'commander';

const program = new Command();

program
  .description('creates a new theme from the current working directory')
  .option('-t, --themeid', 'theme id to delete')
  .option('-f, --force', 'force the delete')

program.action(() => {
  console.log("delete a theme")
});

program.parse();
