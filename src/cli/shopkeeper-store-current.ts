import { Command } from 'commander';
import ShopkeeperConfig from '../lib/shopkeeper-config';

const program = new Command();

program
  .description("print the current environment")

program.action(async () => {
  const config = new ShopkeeperConfig();
  
  try{
    const currentStore = await config.getCurrentStore()
    console.log(currentStore)
  }catch(err) {
    console.log(err)
  }
})

program.parse()
