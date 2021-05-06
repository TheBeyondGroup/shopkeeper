#!/usr/bin/env node

import { Command } from 'commander'
import ThemekitDelegator from '../commands/themekitDelegator'

const program = new Command()
  .version('0.0.5', '-v, --version', 'output the current version')
  .name('shopkeeper')
  .description('Command-line interface for managing Shopify stores')
  .configureHelp({
    sortSubcommands: true
  });

program
  .command('themekit <subCommand> [files...]')
  .description("call themekit")
  .option('-e, --env <theme-environment>', 'specify theme environment, defaults to "development"', 'development')
  .option('-l, --list', 'lists all theme ids')
  .option('-p, --password <private-app-api-password>', 'specify shopify private app api password, e.g. shppa_...')
  .option('-s, --store <theme-store-url>', 'specify the store url')
  .option('-t, --themeid <theme-id>', 'specify the themeid')
  .action((subCommand, files, options, command) => {
    console.log('Delegating ' + command.name() + ' ' + subCommand + '\n');
    new ThemekitDelegator(subCommand, files, options).run();
  });

program
  .command('theme', 'manage a Shopify theme')

program.parse()
