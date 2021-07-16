import fs from 'fs-extra';

export default class ShopkeeperConfig {
  get rootPath(): string {
    return '/.shopkeeper'
  }

  get currentStorePath(): string{
    return process.cwd() + `${this.rootPath}/${this.currentStoreFileName}`
  }

  get currentStoreFileName(): string {
    return '.current-store'
  }

  get themeSettingsPath(): string{
    return process.cwd() + '/shopify/config/settings_data.json'
  }

  get themeEnvPath(): string {
    return process.cwd() + "/.env"
  }

  async getCurrentStore(): Promise<any>{
    const store = await fs.readFile(this.currentStorePath, 'utf8')
    return store;
  }

  async setCurrentStore(store: string){
    await fs.outputFile(this.currentStorePath, store)
  }

  storeThemeSettingsPath(store: string): string {
    return process.cwd() + `${this.rootPath}/${store}/settings_data.json`
  }

  storeEnvPath(store: string): string {
    return process.cwd() + `${this.rootPath}/${store}/env`;
  }
}
