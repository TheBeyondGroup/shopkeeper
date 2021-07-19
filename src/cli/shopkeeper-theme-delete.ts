#!/usr/bin/env node

import { Command } from 'commander';
import ShopifyClient from '../lib/shopify-client';

const program = new Command();

program
  .description('delete a theme')
  .option('-n, --name <name>', 'name of theme to delete')
  .option('-t, --themeid <theme id>', 'theme id to delete')
  .option('-f, --force', 'force the delete')

const options = program.opts()

program.action(async () => {
  const name = options.name
  const storeUrl = `https://${process.env.PROD_STORE_URL}` || "";
  const storePassword = process.env.PROD_PASSWORD || "";

  const client = new ShopifyClient(storeUrl, storePassword)

  try{
    const theme = await client.getThemeByName(name)
    
    if(theme){
      client.deleteTheme(theme.id)
      console.log(`Deleting theme: ${name}`)
    }else{
      console.log(`Theme named: ${name} cannot be found`)
    }
  }catch(error){
    console.log(error)
    process.exit(1)
  }
});

program.parse();
