#!/usr/bin/env node

import { Command } from 'commander';

const program = new Command();

program.action(() => {
  console.log("store")
});

program.parse();
