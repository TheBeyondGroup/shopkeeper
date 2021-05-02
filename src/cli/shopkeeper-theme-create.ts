import { Command } from 'commander';
import themekit from '@shopify/themekit'
import ShopifyClient from '../lib/shopify-client';

const program = new Command();

program
  .description('creates a new theme from the current working directory')
  .option('-n, --name <theme-name>', 'name of the theme you want created')

program.action(async (options) => {
  const storeUrl = `https://${process.env.PROD_STORE_URL}` || "";
  const storePassword = process.env.PROD_PASSWORD || "";

  const client = new ShopifyClient(storeUrl, storePassword)

  const themes = await client.getThemes()
  const duplicateThemes = themes.filter(({ name }: { name: string }) => name === options.name)
  if (duplicateThemes.length > 0) {
    throw new Error(`The theme ${options.name} already exists in this store.`)
  }

  const { theme } = await client.createTheme(options.name)
  await themekit.command('deploy', {
    store: storeUrl,
    password: storePassword,
    themeid: theme.id,
    dir: 'shopify'
  })

  console.log(`Preview ready at ${storeUrl}?preview_theme_id=${theme.id}`)
});

program.parse();
