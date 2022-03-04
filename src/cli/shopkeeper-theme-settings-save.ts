import { Command } from 'commander'

const program = new Command();
import fs  from 'fs-extra';
import ShopkeeperConfig from '../lib/shopkeeper-config';

program
  .description("save the store theme settings to environment")
  .argument("[environment]", "the environment")
  .option(
    '-c --copy', 
    'preserve contents of environment when saving settings. By default, settings are replaced.',
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
    console.log(`Saving settings for ${backupEnv}.`)
    // Remove all JSON files from .shopkeeper/<env>/templates
    if(!options.copy) {
      const templatePath = config.backupThemeTemplatePath(backupEnv)
      await fs.emptyDir(templatePath)
      console.log(`Emptied ${backupEnv}/templates`)
    }

    const fileMoves = await config.backupThemeSettingsSaveFileMoves(backupEnv)
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
