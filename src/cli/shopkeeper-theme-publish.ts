#!/usr/bin/env node

import { Command } from 'commander';
import Publisher from '../commands/publisher'

const program = new Command();

program
  .description('publishes a theme to the specified environment, asking for confirmation')
  .option('-f, --force', "Don't ask for confirmation")
  .option('-e, --env <theme-environment>', 'theme environment to publish')
  .option('-t, --themeid <theme-id>', 'theme id publish')

program.action((options) => {
  new Publisher(options).run();
});

program.parse();
