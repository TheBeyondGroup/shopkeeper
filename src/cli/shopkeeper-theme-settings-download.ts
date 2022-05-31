#!/usr/bin/env node

import { Command } from 'commander';
import Shopkeeper from '../shopkeeper';

const program = new Command();

program
  .description('download theme settings')
  .option('-t, --theme <NAME_OR_ID>', 'The name or ID of the theme that you want to pull')

program.action(async (options) => {
  if (process.env.PROD_STORE_URL && process.env.PROD_PASSWORD) {
    options.storeUrl = process.env.PROD_STORE_URL;
    options.password = process.env.PROD_PASSWORD;
  }
  const shopkeeper = new Shopkeeper(options);
  
  try{
    await shopkeeper.settingsDownload();
  }catch(error){
    console.log(error)
    process.exit(1)
  }
});
  
program.parse();
