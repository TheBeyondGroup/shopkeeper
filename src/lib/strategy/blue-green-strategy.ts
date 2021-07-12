import ShopifyClient from "../shopify-client";
import themekit from '@shopify/themekit';

export default class BlueGreenStrategy implements Strategy {
  PRODUCTION_GREEN = 'production-green';
  PRODUCTION_BLUE = 'production-blue';
  STAGING = 'staging';

  async deploy(staging: boolean = false){
    const theme = await this.publishedTheme();
    const themeId = theme.id.toString();

    await this.downloadPublishedThemeSettings();

    // determine destination blue or green
    const onDeckTheme = this.ondeckTheme(themeId);

    // deploy to destination
    console.log(`Deploying to ${onDeckTheme}`)
    await this.deployEnvironment(onDeckTheme);

    if(staging){
      await this.deployEnvironment(this.STAGING);
    }
  }

  async ondeckThemeId() {
    const theme = await this.publishedTheme();
    const publishedThemeId = theme.id.toString();
    if(this.isBlueTheme(publishedThemeId)){
      return process.env.PROD_GREEN_THEME_ID;
    }else{
      return process.env.PROD_BLUE_THEME_ID;
    }
  }

  private async deployEnvironment(environment: string){
    const flags = {
      env: environment,
    };
    await themekit.command('deploy', flags);
  }

  private async downloadPublishedThemeSettings(){
    console.log(`Downloading settings from live theme`)
    const flags = {
      files: ['config/settings_data.json'],
      live: true,
      store: this.storeUrl(),
      password: this.apiPassword()
    };
    await themekit.command('download', flags);
  }

  private async publishedTheme(): Promise<any> {
    return await this.shopifyClient().getPublishedTheme();
  }

  private shopifyClient(): ShopifyClient {
    const client = new ShopifyClient(
      this.storeUrl(),
      this.apiPassword()
    );
    return client;
  }

  private storeUrl(): string {
    return `https://${process.env.PROD_STORE_URL}` || "";
  }

  private apiPassword(): string {
    return process.env.PROD_PASSWORD || "";
  }

  private isBlueTheme(themeId: string): boolean {
    return process.env.PROD_BLUE_THEME_ID === themeId;
  }

  private ondeckTheme(publishedThemeId: string): string {
    if(this.isBlueTheme(publishedThemeId)){
      return this.PRODUCTION_GREEN;
    }else{
      return this.PRODUCTION_BLUE;
    }
  }
}
