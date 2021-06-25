#!/usr/bin/env node

import { Command } from 'commander';

const program = new Command();

program
  .command("settings", "manage a theme's settings")
  .command("deploy", 'deploy changes to a store')
  .command("publish", 'publishes a theme')
  .command("delete", 'deletes a theme')
  .command("create", 'creates a theme')
  .command("get-id", "gets theme id")

program.action(() => {
  program.help();
});

program.parse();
