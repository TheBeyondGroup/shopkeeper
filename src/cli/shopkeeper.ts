#!/usr/bin/env node

import { Command } from 'commander'
import { version } from '../../package.json';

const program = new Command()
  .version(version, '-v, --version', 'output the current version')
  .name('shopkeeper')
  .description('Command-line interface for managing Shopify stores')
  .configureHelp({
    sortSubcommands: true
  });

program
  .command("login", "authenticates and logs you into the specified store")
  .command("logout", "logs you out of the Shopify account or Partner account and store.")
  .command('store', 'manages store environment')
  .command('switch', 'switches between stores without logging out and logging in again')
  .command('theme', 'manages a Shopify theme')
  .command('whoami', "determines which Partner organization you're logged in to, or which store you're logged in to as a staff member")

program.parse()
