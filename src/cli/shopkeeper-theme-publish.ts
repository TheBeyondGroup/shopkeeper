#!/usr/bin/env node

import { Command } from 'commander';
import Publisher from '../commands/publisher'

const program = new Command();

program
  .description('publish a theme to the specified environment')
  .option('-f, --force', "Skip confirmation")
  .option('-e, --env <theme-environment>', 'theme environment to publish')
  .option('-t, --themeid <theme-id>', 'theme id to publish')

program.action((options) => {
  new Publisher(options).run();
});

program.parse();
