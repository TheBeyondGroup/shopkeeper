import { Command } from 'commander'

const program = new Command();
import fs  from 'fs-extra';
import ShopkeeperConfig from '../lib/shopkeeper-config';

program
  .description("save the store theme settings")
  .argument("[store]", "the name of the store environment")

program.action(async(store) => {
  const config = new ShopkeeperConfig();
  let storeToRestore = store

  if(!storeToRestore){
    storeToRestore = await config.getCurrentStore()
  }

  const settingsDestinationPath = config.storeThemeSettingsPath(storeToRestore)
  const settingsSourcePath = config.themeSettingsPath

  try {
    await fs.copy(settingsSourcePath, settingsDestinationPath)
    console.log(`Saved settings for ${storeToRestore}.`)
  } catch (err) {
    console.log(err)
  }
})

program.parse();
