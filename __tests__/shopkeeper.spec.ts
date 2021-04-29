import themeKit from '@shopify/themekit';
import Shopkeeper from '../src/shopkeeper';
jest.mock('@shopify/themekit')

describe('settings', () => {

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

});
