#!/usr/bin/env node

import { Command } from 'commander';

const program = new Command();

program
  .description('deploy a theme')
  .option('--strategy', 'deployment strategy', 'bg')
  .option('-e, --env <theme-environment>', 'theme environment to deploy');

program.action(() => {
  console.log("Deploy some stuff")
});

program.parse();
