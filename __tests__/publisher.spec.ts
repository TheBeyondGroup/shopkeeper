import Publisher from "../src/commands/publisher";
import themeKit from '@shopify/themekit';
import fs from 'fs'

jest.mock('@shopify/themekit')
jest.mock('fs')

describe('run', () => {
  let consoleSpy: any;

  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, 'log');
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

      beforeEach(() => {
        inquire = jest.spyOn(Publisher.prototype as any, 'inquire')
      });

      describe('when config.yml file is not present', () => {
        test('it does not call the themekit command', async () => {
          fs.existsSync = jest.fn().mockReturnValue(false)
          await publisher.run()
          expect(themeKit.command).toHaveBeenCalledTimes(0)
          expect(consoleSpy).toHaveBeenCalledWith('config.yml does not exist')
        });
      });

      describe('when config.yml file is present', () => {
        beforeEach(() => {
          fs.existsSync = jest.fn().mockReturnValue(true)
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
      beforeEach(() => {
        publisher = new Publisher({ env: 'development', force: true })
      });

      describe('when config.yml file is not present', () => {
        test('it does not call the themekit command', async () => {
          fs.existsSync = jest.fn().mockReturnValue(false)
          await publisher.run()
          expect(themeKit.command).toHaveBeenCalledTimes(0)
          expect(consoleSpy).toHaveBeenCalledWith('config.yml does not exist')
        });
      });

      describe('when config.yml file is present', () => {
        beforeEach(() => {
          fs.existsSync = jest.fn().mockReturnValue(true)
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
