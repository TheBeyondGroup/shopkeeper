import themeKit from '@shopify/themekit';
import Shopkeeper from '../src/shopkeeper';
jest.mock('@shopify/themekit')

describe('settings download', () => {

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('it can download settings from the published theme', () => {
    const options = {
      storeUrl: 'example.com',
      password: 'password'
    };
    const shopkeeper = new Shopkeeper(options);
    shopkeeper.settingsDownload();
    expect(themeKit.command).toHaveBeenCalledTimes(1);
    expect(themeKit.command).toHaveBeenCalledWith('download', {
      files: ['config/settings_data.json'],
      live: true,
      store: options.storeUrl,
      password: options.password
    });
  });

  test('it can upload settings to a theme id', () => {
    const options = {
      themeid: 123,
      storeUrl: 'example.com',
      password: 'password'
    };
    const shopkeeper = new Shopkeeper(options);
    shopkeeper.settingsUpload();
    expect(themeKit.command).toHaveBeenCalledTimes(1);
    expect(themeKit.command).toHaveBeenCalledWith('deploy', {
      files: ['config/settings_data.json'],
      themeid: options.themeid,
      store: options.storeUrl,
      password: options.password
    });
  });

});
