// This is the main entry point to all the shopkeeper functionality
// This is also the class to import when using shopkeeper elsewhere.
import themeKit from '@shopify/themekit';

export default class Shopkeeper {
  options: any;
  
  constructor(options: any) {
    this.options = options;
  }

  async settingsDownload() {
    const flags: {[k: string]: any} = {
      files: [
        'config/settings_data.json',
        "templates/*.json"
      ]
    };
  
    if (this.options.env) {
      flags.env = this.options.env;
    } else {
      // Default to published theme
      const storeUrl = this.options.storeUrl;
      const password = this.options.password;
      if (storeUrl && password) {
        flags.live = true;
        flags.store = storeUrl;
        flags.password = password;
      } else {
        // Invalid credentials 
        process.exit(1);
      }
    }
  
    await themeKit.command('download', flags);
  }

  async settingsUpload() {
    const flags: {[k: string]: any} = {
      files: [
        'config/settings_data.json',
        "templates/*.json"
      ]
    };
  
    // TODO: Need to add credentials
    if (this.options.themeid && this.options.storeUrl && this.options.password) {
      flags.themeid = this.options.themeid;
      flags.store = this.options.storeUrl;
      flags.password = this.options.password;
    } else if (this.options.env) {
      flags.env = this.options.env;
    } else {
      // Invalid arguments
      process.exit(1);
    }

    await themeKit.command('deploy', flags);
  }
}
