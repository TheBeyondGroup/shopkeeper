#!/usr/bin/env node

import { Command } from 'commander';

const program = new Command();

program
  .option('-e, --env <themeenvironment>', 'specify theme environment')
  .option('-t, --themeid <theme id>', 'specify theme id')

program.action(() => {
  console.log("download some settings")
});
  
program.parse();
