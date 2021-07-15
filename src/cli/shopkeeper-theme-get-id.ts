import { Command } from 'commander';
import ShopifyClient from '../lib/shopify-client';

const program = new Command();

program
  .description('get a theme id')
  .option('-n, --name <theme-name>', 'gets the theme id for the passsed name')
  .option('-p, --published', 'gets the published theme id')
  .option('-o, --on-deck', 'gets the on deck theme id')

program.action(async (options) => {
  const storeUrl = `https://${process.env.PROD_STORE_URL}` || "";
  const storePassword = process.env.PROD_PASSWORD || "";

  const client = new ShopifyClient(storeUrl, storePassword);
  const firstOption = Object.keys(program.opts())[0];

  switch (firstOption) {
    case 'onDeck':
      try{
        const ondeckId = await client.getOndeckThemeId();
        console.log(ondeckId);
      }catch(error){
        console.log(error);
        process.exit(1);
      }
      break;
    case 'published':
      try{
        const publishedId = await client.getPublishedThemeId();
        console.log(publishedId);
      }catch(error){
        console.log(error);
        process.exit(1);
      }
      break;
    case 'name':
      try{
        const theme = await client.getThemeByName(options.name);
        if(theme){
         const { id } = theme;
         console.log(id);
        }else{
          console.log(`${options.name} does not exist on ${storeUrl}`);
          process.exit(1);
        }
      }catch(error){
        console.log(error);
        process.exit(1);
      }
      break;
    default:
      break;
  }
});

program.parse();
