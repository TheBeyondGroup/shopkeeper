const { spawn } = require('node:child_process');
const ls = spawn('shopify', ['switch'], {stdio: "inherit"});

ls.on('exit', (code) => {
  console.log(`child process exited with code ${code}`);
});
