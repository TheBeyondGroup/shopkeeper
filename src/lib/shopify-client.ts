import axios, { AxiosInstance } from 'axios';

type CreateThemePayload = {
  theme: {
    name: string,
    src?: string,
    role?: string
  }
}

export default class ShopifyClient {
  API_VERSION: string = '2021-04';
  PUBLISHED: string = 'main';

  constructor(
    public storeUrl: string,
    public apiPassword: string
  ){}

  async getThemes(): Promise<any> {
    const response = await this.get(this.themesPath());
    return response.data.themes
  }

  async getPublishedTheme(): Promise<any> {
    const themes = await this.getThemes()
    return themes.find((theme: { role: string; }) => theme.role === 'main')
  }

  async getPublishedThemeId(): Promise<string> {
    const publishedTheme = await this.getPublishedTheme();
    return publishedTheme.id.toString();
  }

  async deleteTheme(id: string): Promise<any>{
    const response = await this.delete(this.themePath(id))
    return response.data;
  }

  async publishTheme(id: string): Promise<any> {
    const response = await this.put(
      this.themePath(id),
      { theme: { id: id, role: this.PUBLISHED }}
    )
    return response.data;
  }

  async createTheme(name: string): Promise<any> {
    try {
      const { data } = await this.create(this.themesPath(), {
        theme: { name }
      })

      return data
    } catch(error) {
      console.log(error)
    }
  }

  private themesPath(): string {
    return `/admin/api/${this.API_VERSION}/themes.json`
  }

  private themePath(id: string): string {
    return `/admin/api/${this.API_VERSION}/themes/${id}.json`
  }


  private async create(path: string, payload: CreateThemePayload) {
    return await this.axiosClient().post(path, payload);
  }

  private async get(path: string) {
    return await this.axiosClient().get(path);
  }

  private async delete(path: string) {
    return await this.axiosClient().delete(path);
  }

  private async put(path: string, payload: any){
    return await this.axiosClient().put(path, payload)
  }

  private headers(): object {
    return { headers: { 'X-Shopify-Access-Token': this.apiPassword }}
  }

  private axiosClient(): AxiosInstance {
    return axios.create({
      baseURL: this.storeUrl,
      ...this.headers()
    })
  }
}
