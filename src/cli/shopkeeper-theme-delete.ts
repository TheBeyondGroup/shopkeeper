#!/usr/bin/env node

import { Command } from 'commander';
import ShopifyClient from '../lib/shopify-client';

const program = new Command();

program
  .description('creates a new theme from the current working directory')
  .option('-n, --name', 'name of theme to delete')
  .option('-t, --themeid', 'theme id to delete')
  .option('-f, --force', 'force the delete')

const options = program.opts()

program.action(async () => {
  const name = options.name
  const storeUrl = `https://${process.env.PROD_STORE_URL}` || "";
  const storePassword = process.env.PROD_PASSWORD || "";

  const client = new ShopifyClient(storeUrl, storePassword)
  const theme = await client.getThemeByName(name)
  
  if(theme){
    client.deleteTheme(theme.id)
    console.log(`Deleting theme: ${name}`)
  }else{
    console.log(`Theme named: ${name} cannot be found`)
  }
});

program.parse();
