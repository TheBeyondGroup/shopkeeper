import { Command } from 'commander';
import fs  from 'fs-extra';
import ShopkeeperConfig from '../lib/shopkeeper-config';

const program = new Command();

program
  .description("switch to the environment variables for a store")
  .argument("<store>", "the name of the store environment")

program.action(async(store) => {
  const config = new ShopkeeperConfig()
  const envSourcePath = config.backupEnvPath(store)
  const envDestinationPath = config.themeEnvPath

  try {
    const filesMoves = await config.backupThemeSettingsRestoreFileMoves(store)
    filesMoves.push({ source: envSourcePath, destination: envDestinationPath })
    filesMoves.forEach(async ({source, destination}) => {
      await fs.copy(source, destination)
      console.log(`Copied ${source} to ${destination}`)
    })
    
    await config.setCurrentStore(store)

    console.log(`Switched to ${store} environment`)
  } catch (err) {
    console.log(err)
    process.exit(1)
  }
})

program.parse()
