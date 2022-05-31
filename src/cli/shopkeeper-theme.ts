#!/usr/bin/env node

import { Command } from 'commander';

const program = new Command();

program
  .command('init', "create")
  .command("serve", "a")
  .command("check", "a")
  .command("list", "a")
  .command("open", "a")
  .command("settings", "manage a theme's settings")
  .command("deploy", 'deploy changes to a store')
  .command("publish", 'publish a theme')
  .command("package", "a")
  .command("delete", 'delete a theme')
  .command("create", 'create a theme')
  .command("get-id", "get a theme id")

program.action(() => {
  program.help();
});

program.parse();
