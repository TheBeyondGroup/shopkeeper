import axios, { AxiosInstance } from 'axios';

type CreateThemePayload = {
  theme: {
    name: string,
    src?: string,
    role?: string
  }
}

type UpdateThemeNamePayload = {
  theme: {
    name: string
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
    try{
      const { data: { themes }} = await this.get(this.themesPath())
      return themes;
    }catch(error){
      console.log(error)
    }
  }

  async getThemeByName(name: string): Promise<any> {
    const themes = await this.getThemes()
    return themes.find((theme: { name: string; }) => theme.name === name)
  }

  async getPublishedTheme(): Promise<any> {
    try{
      const themes = await this.getThemes();
      return themes.find((theme: { role: string; }) => theme.role === 'main')
    }catch(error){
      console.log(error)
    }
  }

  async getPublishedThemeId(): Promise<any> {
    try{
      const publishedTheme = await this.getPublishedTheme()
      return publishedTheme.id.toString()
    }catch(error){
      console.log(error)
    }
  }

  async deleteTheme(id: string): Promise<any>{
    try{
      const { data } = await this.delete(this.themePath(id));
      return data;
    }catch(error){
      console.log(error)
    }
  }

  async publishTheme(id: string): Promise<any> {
    try{
      const { data } = await this.put(
        this.themePath(id),
        { theme: { id: id, role: this.PUBLISHED }}
      )

      return data;
    }catch(error){
      console.log(error)
    }
    
  }

  async createTheme(name: string): Promise<any> {
    try {
      const { data } = await this.create(this.themesPath(),
        {
          theme: { name }
        }
      )

      return data;
    } catch(error) {
      console.log(error)
    }
  }

  async updateTheme(themeId: string, name: string): Promise<any>{
    try{
      const { data }  = await this.update(this.themePath(themeId), { 
        theme: { name: name }
      });

      return data;
    }catch(error){
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
    return await this.post(path, payload);
  }

  private async update(path: string, payload: UpdateThemeNamePayload) {
    return await this.put(path, payload);
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

  private async post(path: string, payload: any){
    return await this.axiosClient().post(path, payload)
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
