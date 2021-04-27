import themeKit from '@shopify/themekit';

export default class ThemekitDelegator {
  cmd: string
  flagObj: object

  constructor(subCommand: string, files?: string[], options?: object) {
    this.cmd = subCommand
    this.flagObj = { ...options, files: files }
  }

  run() {
    return themeKit.command(this.cmd, this.flagObj);
  }
}
