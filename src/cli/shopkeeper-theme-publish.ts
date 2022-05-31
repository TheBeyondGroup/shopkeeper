#!/usr/bin/env node

import { Command } from 'commander';

const program = new Command();

program
  .description('publish a theme to the specified environment')
  .argument("[THEME_ID]", "The ID of the theme that you want to publish")
  .option('-f, --force', "Skip confirmation")

program.action(() => {
});

program.parse();
