import themekit from '@shopify/themekit';
import ShopifyClient from "../shopify-client";
import ShopkeeperConfig from "../shopkeeper-config";

export default class BlueGreenStrategy implements DeployStrategy {
  async deploy(staging: boolean = false){
    await this.downloadPublishedThemeSettings();
    
    const themeId = await this.publishedThemeId()
    const onDeckThemeEnv = this.ondeckThemeEnv(themeId);

    // deploy to destination
    await this.deployEnvironment(onDeckThemeEnv);
    await this.updateThemeNameWithCommitHash(
      await this.ondeckThemeId(),
      await this.productionThemeName(themeId)
    )

    if(staging){
      await this.deployEnvironment(this.stagingEnv);
      await this.updateThemeNameWithCommitHash(
        this.stagingThemeId,
        await this.stagingThemeName()
      )
    }
  }

  async ondeckThemeId() {
    const publishedThemeId = await this.publishedThemeId()
    if(this.isBlueTheme(publishedThemeId)){
      return this.getConfig().productionGreenThemeId
    }else{
      return this.getConfig().productionBlueThemeId
    }
  }

  private async updateThemeNameWithCommitHash(themeId: string, newName: string): Promise<any>{
    console.log(`Renaming theme to ${newName}`)
    await this.shopifyClient().updateTheme(themeId, newName)
    console.log(`Finished renaming theme to ${newName}`)
  }

  private async deployEnvironment(environment: string){
    console.log(`Deploying to environment: ${environment}`)
    const flags = {
      env: environment,
    };
    await themekit.command('deploy', flags);
    console.log(`Finished deploying to environment: ${environment}`)
  }

  private async downloadPublishedThemeSettings(){
    console.log(`Downloading settings from published theme`)
    const flags = {
      files: ['config/settings_data.json'],
      live: true,
      store: this.storeUrl,
      password: this.storePassword
    };
    await themekit.command('download', flags);
    console.log("Finished downloading settings from published theme")
  }

  private async publishedThemeId(): Promise<string> {
    const id = await this.shopifyClient().getPublishedThemeId();
    return id
  }

  private ondeckThemeEnv(publishedThemeId: string): string {
    if(this.isBlueTheme(publishedThemeId)){
      return this.getConfig().PRODUCTION_GREEN_ENV;
    }else{
      return this.getConfig().PRODUCTION_BLUE_ENV;
    }
  }

  private ondeckThemeName(publishedThemeId: string): string {
    if(this.isBlueTheme(publishedThemeId)){
      return this.getConfig().DEFAULT_GREEN_THEME_NAME;
    }else{
      return this.getConfig().DEFAULT_BLUE_THEME_NAME;
    }
  }

  private isBlueTheme(themeId: string): boolean {
    return this.getConfig().productionBlueThemeId === themeId;
  }

  private async stagingThemeName(): Promise<string> {
    const name = await this.getConfig().stagingThemeName()
    return name
  }

  private async productionThemeName(publishedThemeId: string): Promise<string> {
    const name = await this.getConfig().productionThemeName()
    const envThemeName = this.ondeckThemeName(publishedThemeId)

    return `${name} ${envThemeName}`
  }

  private get stagingThemeId(): string {
    return this.getConfig().stagingThemeId
  }

  private get stagingEnv(): string {
    return this.getConfig().STAGING_ENV
  }

  private get storeUrl(){
    return this.getConfig().storeUrl
  }

  private get storePassword(){
    return this.getConfig().storePassword
  }

  private shopifyClient(): ShopifyClient {
    const client = new ShopifyClient(
      this.storeUrl,
      this.storePassword
    );
    return client;
  }

  private getConfig(): ShopkeeperConfig {
    return new ShopkeeperConfig();
  }
}
