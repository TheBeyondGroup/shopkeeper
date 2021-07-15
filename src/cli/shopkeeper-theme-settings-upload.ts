#!/usr/bin/env node

import { Command } from 'commander';
import Shopkeeper from '../shopkeeper';

const program = new Command();

program
  .description('Upload theme settings')
  .option('-e, --env <environment>', 'specify theme environment')
  .option('-t, --themeid <themeid>', 'specify theme id')

program.action((options: any) => {
  if (process.env.PROD_STORE_URL && process.env.PROD_PASSWORD) {
    options.storeUrl = process.env.PROD_STORE_URL;
    options.password = process.env.PROD_PASSWORD;
  }
  const shopkeeper = new Shopkeeper(options);
  shopkeeper.settingsUpload();
});
  
program.parse();
