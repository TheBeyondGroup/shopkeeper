import { Command } from 'commander';
import fs  from 'fs-extra';

const program = new Command();

program
  .description("print the current environment")

program.action(async () => {
  const currentStorePath = process.cwd() + `/config/stores/.current-store`;
  
  try{
    const data = await fs.readFile(currentStorePath, 'utf8')
    console.log(data)
  }catch(err) {
    console.log(err)
  }
})

program.parse()
