import { Command } from 'commander';
import fs  from 'fs-extra';
import ShopkeeperConfig from '../lib/shopkeeper-config';

const program = new Command();

program
  .description("switch to the environment variables for a store")
  .argument("<store>", "the name of the store environment")

program.action(async(store) => {
  const config = new ShopkeeperConfig()
  const envSourcePath = config.storeEnvPath(store)
  const envDestinationPath = config.themeEnvPath
  const settingsSourcePath = config.storeThemeSettingsPath(store)
  const settingsDestinationPath = config.themeSettingsPath

  try {
    await fs.copy(envSourcePath, envDestinationPath)
    await fs.copy(settingsSourcePath, settingsDestinationPath)
    await config.setCurrentStore(store)
    console.log(`Switched to ${store} environment`)
  } catch (err) {
    console.log(err)
  }
})

program.parse()
