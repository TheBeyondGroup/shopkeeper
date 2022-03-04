import { Command } from 'commander';
import fs  from 'fs-extra';
import ShopkeeperConfig from '../lib/shopkeeper-config';

const program = new Command();

program
  .description("switch to environment's settings")
  .argument("<environment>", "the environment")
  .option(
    '-c --copy', 
    'preserve contents of theme when changing environments. By default, settings are replaced.',
    false
  )

const options = program.opts();

program.action(async(environment) => {
  const config = new ShopkeeperConfig()
  const envSourcePath = config.backupEnvPath(environment)
  const envDestinationPath = config.themeEnvPath

  try {
    console.log(`Switching to ${environment}`)
    // Remove all JSON files from shopify/templates
    if(!options.copy) {
      const themeJSONTemplates = await config.themeJSONTemplates()
      themeJSONTemplates.forEach(fileName => {
        fs.rm(fileName)
        console.log(`Deleted ${fileName}`)
      })
    }

    const filesMoves = await config.backupThemeSettingsRestoreFileMoves(environment)
    filesMoves.push({ source: envSourcePath, destination: envDestinationPath })
    filesMoves.forEach(async ({source, destination}) => {
      await fs.copy(source, destination)
      console.log(`Copied ${source} to ${destination}`)
    })

    await config.setCurrentEnvironment(environment)
  } catch (err) {
    console.log(err)
    process.exit(1)
  }
})

program.parse()
