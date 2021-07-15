import { env } from 'string-env-interpolation';
import { existsSync, readFileSync } from 'fs-extra';
import YAML from 'yaml';
export default class Config {
  environments(): any {
    return this.parseConfigFile();
  }

  filePresent(): boolean{
    return existsSync(this.configPath());
  }

  private parseConfigFile(): object{
    return YAML.parse(this.interpolateEnvVariables());
  }

  private interpolateEnvVariables(): string {
    return env(this.readConfigFile());
  }

  private readConfigFile(): string {
    return readFileSync(this.configPath()).toString();
  }

  private configPath(): string {
    return process.cwd() + '/config.yml';
  }
}
