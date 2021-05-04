import Publisher from "../../src/commands/publisher";
import themeKit from '@shopify/themekit';
import mock from 'mock-fs';
import mockedEnv from 'mocked-env';
import path from 'path';
import fs from 'fs';
import ShopifyClient from "../../src/lib/shopify-client";

jest.mock('@shopify/themekit')
jest.mock('../../src/lib/shopify-client')

describe('run', () => {
  let consoleSpy: any;

  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, 'log');
  });

  describe('when no options are passed', () => {
    let envRestore: any;
    let inquire: any;

    beforeEach(() => {
      envRestore = mockedEnv({
        PROD_STORE_URL: 'a-store.myshopify.com',
        PROD_PASSWORD: 'a-password',
        PROD_BLUE_THEME_ID: '100000000000',
        PROD_GREEN_THEME_ID: '111111111111'
      });

      mock({
        'config.yml': mock.load(path.resolve(__dirname, `../fixtures/config-with-env.yml`))
      })

      inquire = jest.spyOn(Publisher.prototype as any, 'inquire')
      inquire.mockImplementation(() => {return true})
    });

    afterEach(() => {
      envRestore();
      jest.clearAllMocks();
    });

    describe('when the blue theme is published', () => {
      test('it publishes the green theme', async () => {
        jest.spyOn(ShopifyClient.prototype, 'getThemes').mockImplementation(() => Promise.resolve(
          [
            { id: 100000000000, name: 'Production - Blue', role: 'main' },
            { id: 200000000000, name: 'Another theme', role: '' }
          ]
        ));
        let publisher = new Publisher({})
        await publisher.run()
        expect(ShopifyClient).toHaveBeenCalledTimes(1)
        expect(themeKit.command).toHaveBeenCalledTimes(1)
        expect(themeKit.command).toHaveBeenCalledWith('publish', {env: 'production-green', files: []})
      });
    });

    describe('when the green theme is published', () => {
      test('it publishes the blue theme', async () => {
        jest.spyOn(ShopifyClient.prototype, 'getThemes').mockImplementation(() => Promise.resolve(
          [
            { id: 111111111111, name: 'Production - Green', role: 'main' },
            { id: 200000000000, name: 'Another theme', role: '' }
          ]
        ));

        let publisher = new Publisher({})
        await publisher.run()
        expect(ShopifyClient).toHaveBeenCalledTimes(1)
        expect(themeKit.command).toHaveBeenCalledTimes(1)
        expect(themeKit.command).toHaveBeenCalledWith('publish', {env: 'production-blue', files: []})
      });
    });

    describe('when green nor blue theme is published', () => {
      test('it does not publish', async () => {
        jest.spyOn(ShopifyClient.prototype, 'getThemes').mockImplementation(() => Promise.resolve(
          [
            { id: 100000000000, name: 'Production - Blue', role: '' },
            { id: 111111111111, name: 'Production - Green', role: '' },
            { id: 200000000000, name: 'Another theme', role: 'main' }
          ]
        ));

        let publisher = new Publisher({})
        await publisher.run()
        expect(ShopifyClient).toHaveBeenCalledTimes(1)
        expect(themeKit.command).toHaveBeenCalledTimes(0)
      });
    });
  });

  describe('when --env option is passed but environmentt is not specified', () => {
    test('it does not call the themekit command', async () => {
      let publisher = new Publisher({env: ''})
      await publisher.run()
      expect(themeKit.command).toHaveBeenCalledTimes(0)
    });
  });

  describe('when --env option is passed', () => {
    let publisher: Publisher;

    beforeEach(() => {
      publisher = new Publisher({ env: 'development' })
    });

    describe('when the action must be confirmed', () => {
      let inquire: any;
      let configFilePresence: any

      beforeEach(() => {
        inquire = jest.spyOn(Publisher.prototype as any, 'inquire')
        configFilePresence = jest.spyOn(fs, 'existsSync')
      });

      describe('when config.yml file is not present', () => {
        test('it does not call the themekit command', async () => {
          configFilePresence.mockImplementation((() => { return false } ))
          await publisher.run()
          expect(themeKit.command).toHaveBeenCalledTimes(0)
          expect(consoleSpy).toHaveBeenCalledWith('config.yml does not exist')
        });
      });

      describe('when config.yml file is present', () => {
        beforeEach(() => {
          configFilePresence.mockImplementation((() => { return true } ))
        });

        describe('when confirming with YES to the prompt', () => {
          test('it should call the themekit command', async () => {
            inquire.mockImplementation(() => { return true } )
            await publisher.run()
            expect(themeKit.command).toHaveBeenCalledTimes(1)
            expect(themeKit.command).toHaveBeenCalledWith('publish', {env: 'development', files: []})
          });
        });

        describe('when confirming with NO to the prompt', () => {
          test('it should not call the themekit command', async () => {
            inquire.mockImplementation(() => { return false } )
            await publisher.run()
            expect(themeKit.command).toHaveBeenCalledTimes(0)
            expect(consoleSpy).toHaveBeenCalledWith('Aborted')
          });
        });
      });
    });

    describe('when --force option is passed', () => {
      let configFilePresence: any

      beforeEach(() => {
        publisher = new Publisher({ env: 'development', force: true })
        configFilePresence = jest.spyOn(fs, 'existsSync')
      });

      describe('when config.yml file is not present', () => {
        test('it does not call the themekit command', async () => {
          configFilePresence.mockImplementation((() => { return false } ))
          await publisher.run()
          expect(themeKit.command).toHaveBeenCalledTimes(0)
          expect(consoleSpy).toHaveBeenCalledWith('config.yml does not exist')
        });
      });

      describe('when config.yml file is present', () => {
        beforeEach(() => {
          configFilePresence.mockImplementation((() => { return true } ))
        });

        test('it calls the themekit command', async () => {
          await publisher.run()
          expect(themeKit.command).toHaveBeenCalledTimes(1)
          expect(themeKit.command).toHaveBeenCalledWith('publish', {env: 'development', files: []})
        });

        describe('when --themeid option is passed', () => {
          test('it calls the themekit command passing the themeid', async () => {
            publisher = new Publisher({ env: 'development', force: true, themeid: '010101010101' })
            await publisher.run()
            expect(themeKit.command).toHaveBeenCalledTimes(1)
            expect(themeKit.command).toHaveBeenCalledWith('publish', {env: 'development', themeid: '010101010101', files: []})
          });
        });
      });
    });
  });
});
