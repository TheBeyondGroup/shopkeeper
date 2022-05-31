#!/usr/bin/env node

import { Command } from 'commander';

const program = new Command();

program
  .description("returns links that let you preview the specified theme.")
  .action(() => {
  })

program.parse();
