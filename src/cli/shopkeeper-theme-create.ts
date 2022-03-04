import themekit from '@shopify/themekit';
import { Command } from 'commander';
import glob from 'glob';
import ShopifyClient from '../lib/shopify-client';
import ShopkeeperConfig from '../lib/shopkeeper-config';

const program = new Command();

program
  .description('create a new theme from the current working directory')
  .option('-n, --name <theme-name>', 'name of the theme to be created')

program.action(async (options) => {
  const config = new ShopkeeperConfig()
  const storeUrl = config.storeUrl
  const storePassword = config.storePassword
  
  const client = new ShopifyClient(storeUrl, storePassword)
  
  try{
    const duplicateTheme = await client.getThemeByName(options.name)
    let themeId: string

    if (!duplicateTheme) {
      const { theme } = await client.createTheme(options.name)
      themeId = theme.id
    }else{
      console.log(`The theme ${options.name} already exists in this store.`)
      themeId = duplicateTheme.id
    }
  
    const themeDirectory = await config.themeDirectory()
    const sectionFiles = glob.sync(`${themeDirectory}/sections/*.liquid`)
      .map(fileName => fileName.replace(`${themeDirectory}/`, ""))
    
    console.log("Uploading sections")
    await themekit.command('deploy', {
      files: sectionFiles,
      store: storeUrl,
      password: storePassword,
      themeid: themeId,
      dir: themeDirectory
    })

    console.log("Upload complete theme")
    await themekit.command('deploy', {
      store: storeUrl,
      password: storePassword,
      themeid: themeId,
      dir: themeDirectory
    })

    console.log(`Preview ready at ${storeUrl}?preview_theme_id=${themeId}`)
  } catch(error) {
    console.log(error)
    process.exit(1)
  }  
});

program.parse();
