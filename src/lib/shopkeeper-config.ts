import fs from 'fs-extra';
import YAML from 'yaml';
import headHash from 'head-hash';

type Settings = {
  productionThemeName: string,
  stagingThemeName: string,
  themeDirectory: string
}
export default class ShopkeeperConfig {
  DEFAULT_CURRENT_STORE_FILE_NAME = '.current-store'
  DEFAULT_STAGING_THEME_NAME = 'Staging'
  DEFAULT_PRODUCTION_THEME_NAME = 'Production'
  DEFAULT_GREEN_THEME_NAME = 'Green'
  DEFAULT_BLUE_THEME_NAME = 'Blue'
  DEFAULT_THEME_DIRECTORY = 'shopify'

  PRODUCTION_GREEN_ENV = 'production-green';
  PRODUCTION_BLUE_ENV = 'production-blue';
  STAGING_ENV = 'staging';

  get storeUrl(): string {
    return `https://${process.env.PROD_STORE_URL}` || ''
  }

  get storePassword(): string {
    return process.env.PROD_PASSWORD || ''
  }

  get stagingThemeId(): string {
    return process.env.STAGING_THEME_ID || ''
  }

  get productionBlueThemeId(): string {
    return process.env.PROD_BLUE_THEME_ID || ''
  }

  get productionGreenThemeId(): string {
    return process.env.PROD_GREEN_THEME_ID || ''
  }

  get rootPath(): string {
    return '.shopkeeper'
  }

  get currentStorePath(): string {
    return process.cwd() + `/${this.rootPath}/${this.currentStoreFileName}`
  }

  get currentStoreFileName(): string {
    return this.DEFAULT_CURRENT_STORE_FILE_NAME
  }

  get settingsPath(): string {
    return `${this.rootPath}/settings.yml`
  }

  get themeSettingsPath(): string{
    return process.cwd() + `/${this.themeDirectory()}/config/settings_data.json`
  }

  storeThemeSettingsPath(store: string): string {
    return process.cwd() + `/${this.rootPath}/${store}/settings_data.json`
  }

  get themeEnvPath(): string {
    return process.cwd() + "/.env"
  }

  storeEnvPath(store: string): string {
    return process.cwd() + `/${this.rootPath}/${store}/env`;
  }

  async getCurrentStore(): Promise<any>{
    const store = await fs.readFile(this.currentStorePath, 'utf8')
    return store;
  }

  async setCurrentStore(store: string){
    await fs.outputFile(this.currentStorePath, store)
  }

  async stagingThemeName(): Promise<string> {
    const settings = await this.getSettings()
    const hash = await this.gitHeadHash()

    return `[${hash}] ${settings.stagingThemeName}`
  }
  async productionThemeName(): Promise<string> {
    const settings = await this.getSettings()
    const hash = await this.gitHeadHash()

    return `[${hash}] ${settings.productionThemeName}`
  }

  async themeDirectory(): Promise<string> {
    const settings = await this.getSettings()
    return settings.themeDirectory
  }

  async getSettings(): Promise<Settings>{
    const settings = await this.parseSettingsFile()

    return {
      stagingThemeName: settings.stagingThemeName || this.DEFAULT_STAGING_THEME_NAME,
      productionThemeName: settings.productionThemeName || this.DEFAULT_PRODUCTION_THEME_NAME,
      themeDirectory: settings.themeDirectory || this.DEFAULT_THEME_DIRECTORY
    } 
  }

  private async gitHeadHash(): Promise<string> {
    const hash = await headHash()
    return hash.substring(0,8)
  }

  private async readSettingsFile(): Promise<string> {
    const settingsContent = await fs.readFile(this.settingsPath, 'utf8')
    return settingsContent
  }

  private async parseSettingsFile(): Promise<any>{
    const fileContents = await this.readSettingsFile()
    return YAML.parse(fileContents)
  }
}
