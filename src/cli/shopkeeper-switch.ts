#!/usr/bin/env node

import { Command } from 'commander';

const program = new Command();

program
  .description("authenticates and logs you into the specified store")
  .option('-s, --store <DOMAIN>', 'the store that you want to log in to')
  .option('-e, --env <ENVIRONMENT>', 'the environment you want restored')
  .action((options) => {
    console.log(options.store)
  })

program.parse();
