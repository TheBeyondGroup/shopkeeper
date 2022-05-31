import { spawn } from 'child_process'

export default class ShopifyCli {

  executeCommand(){
    const args = ['switch']
    const process = spawn('shopify', args, { stdio: "inherit" });
    process.on('exit', (code) => {
      console.log(`child process exited with code ${code}`);
    });
  }
}
