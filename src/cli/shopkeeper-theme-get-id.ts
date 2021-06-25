import { Command } from 'commander';
import ShopifyClient from '../lib/shopify-client';

const program = new Command();

program
  .description('gets the id for the passsed name')
  .option('-n, --name <theme-name>', 'name of the theme you want created')

program.action(async (options) => {
  const storeUrl = `https://${process.env.PROD_STORE_URL}` || "";
  const storePassword = process.env.PROD_PASSWORD || "";

  const client = new ShopifyClient(storeUrl, storePassword)
  
  try{
    const theme = await client.getThemeByName(options.name)
    if(theme){
     const { id } = theme
     console.log(id)
    }else{
      console.log(`${options.name} does not exist on ${storeUrl}`)
      process.exit(1)
    }
  }catch(error){
    console.log(error)
    process.exit(1)
  }
});

program.parse();
