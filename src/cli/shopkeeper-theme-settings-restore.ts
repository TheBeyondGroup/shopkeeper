import { Command } from 'commander'

const program = new Command();
import fs  from 'fs-extra';
import ShopkeeperConfig from '../lib/shopkeeper-config';

program
  .description("restore environment's settings")
  .argument("<environment>", "the environment")
  .option(
    '-c --copy', 
    'preserve contents of theme when restoring settings. By default, settings are replaced.',
    false
  )

const options = program.opts();

program.action(async(environment) => {
  const config = new ShopkeeperConfig();
  let backupEnv = environment

  if(!backupEnv){
    backupEnv = await config.getCurrentEnvironment()
  }

  try {
    console.log(`Restoring settings for ${backupEnv}.`)
    // Remove all JSON files from shopify/templates
    if(!options.copy) {
      const themeJSONTemplates = await config.themeJSONTemplates()
      themeJSONTemplates.forEach(fileName => {
        fs.rm(fileName)
        console.log(`Deleted ${fileName}`)
      })

      const sectionsSettings = await config.sectionsJSONTemplates()
      sectionsSettings.forEach(fileName => {
        fs.rm(fileName)
        console.log(`Deleted ${fileName}`)
      })
    }

    const fileMoves = await config.backupThemeSettingsRestoreFileMoves(backupEnv)
    fileMoves.forEach(async ({source, destination}) => {
      await fs.copy(source, destination)
      console.log(`Copied ${source} to ${destination}`)
    })
  } catch (err) {
    console.log(err)
    process.exit(1)
  }
})

program.parse();
