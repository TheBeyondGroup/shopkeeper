#!/usr/bin/env node
import { Command } from 'commander'
import ThemekitDelegator from './themekitDelegator'

const program = new Command()
program.version('0.0.1');

program
  .command('theme <subCommand> [files...]')
  .option('-e, --env <theme-environment>', 'specify theme environment, defaults to "development"', 'development')
  .option('-l, --list', 'lists all theme ids')
  .option('-p, --password <private-app-api-password>', 'specify shopify private app api password, e.g. shppa_...')
  .option('-s, --store <theme-store-url>', 'specify the store url')
  .option('-t, --themeid <theme-id>', 'specify the themeid')
  .action((subCommand, files, options, command) => {
    console.log('Delegating ' + command.name() + ' ' + subCommand + '\n');
    new ThemekitDelegator(subCommand, files, options).run();
  });

program.parse()
