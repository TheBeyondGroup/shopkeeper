import { Command } from 'commander';
import fs  from 'fs-extra';

const program = new Command();

program
  .description("switch to the environment variables for a store")
  .argument("<store>", "the name of the store environment")

program.action(async(store) => {
  const sourcePath = process.cwd() + `/config/stores/${store}.env`;
  const destPath = process.cwd() + "/.env"
  const currentStorePath = process.cwd() + `/config/stores/.current-store`;

  try {
    await fs.copy(sourcePath, destPath)
    await fs.outputFile(currentStorePath, store)
    console.log(`Switched to ${store} environment`)
  } catch (err) {
    console.log(err)
  }
})

program.parse()
