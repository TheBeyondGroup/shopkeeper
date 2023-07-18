import fs from 'fs-extra';
import YAML from 'yaml';
import headHash from 'head-hash';
import glob from 'glob';

type Settings = {
  productionThemeName: string,
  stagingThemeName: string,
  themeDirectory: string
}

type FileMove = {
  source: string,
  destination: string
}

export default class ShopkeeperConfig {
  DEFAULT_CURRENT_ENVIRONMENT_FILE_NAME = '.current-store'
  
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

  get backupRootPath(): string {
    return '.shopkeeper'
  }

  get currentEnvironmentPath(): string {
    return process.cwd() + `/${this.backupRootPath}/${this.DEFAULT_CURRENT_ENVIRONMENT_FILE_NAME}`
  }

  get settingsPath(): string {
    return `${this.backupRootPath}/settings.yml`
  }

  async themeSettingsPath(): Promise<string>{
    const themeDir = await this.themeDirectory()
    return process.cwd() + `/${themeDir}/config/settings_data.json`
  }

  backupEnvironmentRootPath(store: string): string {
    return process.cwd() + `/${this.backupRootPath}/${store}` 
  }

  backupThemeTemplatePath(store: string): string {
    return `${this.backupEnvironmentRootPath(store)}/templates` 
  }

  backupThemeSettingsDataPath(store: string): string {
    return `${this.backupEnvironmentRootPath(store)}/config/settings_data.json`
  }

  backupThemeSettingsTemplatesPath(store: string, fileName: string): string {
    return `${this.backupEnvironmentRootPath(store)}/templates/${fileName}`;
  }

  backupCustomerTemplatePath(store: string, fileName: string): string {
    return `${this.backupEnvironmentRootPath(
      store
    )}/templates/customers/${fileName}`;
  }

  async backupThemeSettingsSaveFileMoves(
    environment: string
  ): Promise<Array<FileMove>> {
    const settingsSourcePath = await this.themeSettingsPath();
    const settingsDestinationPath =
      this.backupThemeSettingsDataPath(environment);
    const fileMoves = [
      { source: settingsSourcePath, destination: settingsDestinationPath },
    ];

    const themeDir = await this.themeDirectory();
    let jsonTemplateFiles = glob.sync(`${themeDir}/templates/*.json`);
    let templateMoves = jsonTemplateFiles.map((fileName) => {
      const baseName = fileName.split("/").pop() || "";
      return {
        source: process.cwd() + `/${fileName}`,
        destination: this.backupThemeSettingsTemplatesPath(
          environment,
          baseName
        ),
      };
    });

    jsonTemplateFiles = glob.sync(`${themeDir}/templates/customers/*.json`);
    const customerTemplateMoves = jsonTemplateFiles.map((fileName) => {
      const baseName = fileName.split("/").pop() || "";
      return {
        source: process.cwd() + `/${fileName}`,
        destination: this.backupCustomerTemplatePath(environment, baseName),
      };
    });

    return fileMoves.concat(templateMoves).concat(customerTemplateMoves);
  }

  async backupThemeSettingsRestoreFileMoves(
    environment: string
  ): Promise<Array<FileMove>> {
    const settingsSourcePath = this.backupThemeSettingsDataPath(environment);
    const settingsDestinationPath = await this.themeSettingsPath();
    const fileMoves = [
      {
        source: settingsSourcePath,
        destination: settingsDestinationPath,
      },
    ];

    const themeDir = await this.themeDirectory();
    let jsonTemplateFiles = glob.sync(
      `${this.backupThemeTemplatePath(environment)}/*.json`
    );
    const templateMoves = jsonTemplateFiles.map((fileName) => {
      const baseName = fileName.split("/").pop() || "";
      return {
        source: fileName,
        destination: process.cwd() + `/${themeDir}/templates/${baseName}`,
      };
    });

    jsonTemplateFiles = glob.sync(
      `${this.backupThemeTemplatePath(environment)}/customers/*.json`
    );
    const customerTemplateMoves = jsonTemplateFiles.map((fileName) => {
      const baseName = fileName.split("/").pop() || "";
      return {
        source: fileName,
        destination:
          process.cwd() + `/${themeDir}/templates/customers/${baseName}`,
      };
    });

    return fileMoves.concat(templateMoves).concat(customerTemplateMoves);
  }

  async themeJSONTemplates(){
    const themeDir = await this.themeDirectory()
    const jsonTemplateFiles = glob.sync(`${themeDir}/templates/**/*.json`)
    return jsonTemplateFiles
  }

  get themeEnvPath(): string {
    return process.cwd() + "/.env"
  }

  backupEnvPath(store: string): string {
    return process.cwd() + `/${this.backupRootPath}/${store}/env`;
  }

  async getCurrentEnvironment(): Promise<any>{
    const store = await fs.readFile(this.currentEnvironmentPath, 'utf8')
    return store;
  }

  async setCurrentEnvironment(store: string){
    await fs.outputFile(this.currentEnvironmentPath, store)
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
    return `${settings.themeDirectory}`
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
