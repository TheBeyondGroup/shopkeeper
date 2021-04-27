#!/usr/bin/env node

import { Command } from 'commander';

const program = new Command();

program
  .description('creates a new theme from the current working directory')
  .option('-n, --name', 'name of the theme you want created')

program.action(() => {
  console.log("create a theme")
});

program.parse();
