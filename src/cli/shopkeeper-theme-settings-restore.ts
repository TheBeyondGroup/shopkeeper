import { Command } from 'commander'

const program = new Command();
import fs  from 'fs-extra';
import ShopkeeperConfig from '../lib/shopkeeper-config';

program
  .description("restore store theme settings")
  .argument("[store]", "the name of the store environment")

program.action(async(store) => {
  const config = new ShopkeeperConfig();
  let storeToRestore = store

  if(!storeToRestore){
    storeToRestore = await config.getCurrentStore()
  }

  const settingsSourcePath = config.storeThemeSettingsPath(storeToRestore)
  const settingsDestinationPath = config.themeSettingsPath

  try {
    await fs.copy(settingsSourcePath, settingsDestinationPath)
    console.log(`Restored settings for ${storeToRestore}.`)
  } catch (err) {
    console.log(err)
  }
})

program.parse();
