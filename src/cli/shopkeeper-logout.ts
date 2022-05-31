#!/usr/bin/env node

import { Command } from 'commander';

const program = new Command();

program
  .description("authenticates and logs you into the specified store")
  .action(() => {
    console.log("logout")
  })

program.parse();
