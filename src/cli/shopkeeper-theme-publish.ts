#!/usr/bin/env node

import { Command } from 'commander';

const program = new Command();

program
  .description('publish a theme')
  .option('-t, --themeid', 'theme id to delete')
  .option('-e, --env <theme-environment>', 'theme environment to publish');

program.action(() => {
  console.log("publish a theme")
});

program.parse();
