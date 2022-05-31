#!/usr/bin/env node

import { Command } from 'commander';

const program = new Command();

program
  .description("determines which Partner organization you're logged in to, or which store you're logged in to as a staff member")
  .action(()=> {
    console.log("whoami")
  })

program.parse();
