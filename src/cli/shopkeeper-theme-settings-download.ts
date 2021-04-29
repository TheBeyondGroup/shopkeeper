#!/usr/bin/env node

import { Command } from 'commander';

const program = new Command();

program
  .description('Download settings data')
  // .option('-e, --env <environment>', 'specify theme environment')
  // .option('-t, --themeid <themeid>', 'specify theme id')

program.action(() => {
  console.log("download some settings")
});
  
program.parse();
