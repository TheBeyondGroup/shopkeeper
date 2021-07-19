import { Command } from 'commander';
import themekit from '@shopify/themekit'
import ShopifyClient from '../lib/shopify-client';

const program = new Command();

program
  .description('create a new theme from the current working directory')
  .option('-n, --name <theme-name>', 'name of the theme to be created')

program.action(async (options) => {
  const storeUrl = `https://${process.env.PROD_STORE_URL}` || "";
  const storePassword = process.env.PROD_PASSWORD || "";

  const client = new ShopifyClient(storeUrl, storePassword)

  const themes = await client.getThemes()
  const duplicateThemes = themes.filter(({ name }: { name: string }) => name === options.name)
  let themeId: string

  if (duplicateThemes.length == 0) {
    const { theme } = await client.createTheme(options.name)
    themeId = theme.id
  }else{
    console.log(`The theme ${options.name} already exists in this store.`)
    themeId = duplicateThemes[0].id
  }
  
  try{
    await themekit.command('deploy', {
      store: storeUrl,
      password: storePassword,
      themeid: themeId,
      dir: 'shopify'
    })
    console.log(`Preview ready at ${storeUrl}?preview_theme_id=${themeId}`)
  } catch(error) {
    console.log(error)
    process.exit(1)
  }  
});

program.parse();
