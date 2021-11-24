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

  try {
    const fileMoves = await config.backupThemeSettingsSaveFileMoves(storeToRestore)
    fileMoves.forEach(async ({source, destination}) => {
      await fs.copy(source, destination)
      console.log(`Copied ${source} to ${destination}`)
    })
    console.log(`Saved settings for ${storeToRestore}.`)
  } catch (err) {
    console.log(err)
    process.exit(1)
  }
})

program.parse();
