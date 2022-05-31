#!/usr/bin/env node

import { Command } from 'commander';

const program = new Command();

program
  .description("")
  .argument("[NAME]")
  .option("-u, --clone-url <URL>", "The URL of the Git repository that you want to clone.")
  .action(()=> {
    console.log("login")
  })

program.parse();
