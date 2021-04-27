import ThemekitDelegator from "../src/commands/themekitDelegator";
import themeKit from '@shopify/themekit';
jest.mock('@shopify/themekit')

describe('constructor', () => {
  test('it can receive just the command without options or files', () => {
    const delegator = new ThemekitDelegator('download')
    expect(delegator.cmd).toBe('download')
    expect(delegator.flagObj).toEqual({})
  });

  test('it can receive the command with files without options', () => {
    const delegator = new ThemekitDelegator('download', ["file/a", "file/b"])
    expect(delegator.cmd).toBe('download')
    expect(delegator.flagObj).toEqual({"files": ["file/a", "file/b"]})
  });

  test('it can receive the command with files and options', () => {
    const delegator = new ThemekitDelegator(
      'download',
      ["file/a", "file/b"],
      {
        store: 'example.com',
        password: 'password'
      }
    )
    expect(delegator.cmd).toBe('download')
    expect(delegator.flagObj).toEqual(
      {
        "files": ["file/a", "file/b"],
        store: 'example.com',
        password: 'password'
      }
    )
  });
})

describe('run', () => {
  const delegator = new ThemekitDelegator('download', ["file.liquid"])
  delegator.run()
  expect(themeKit.command).toHaveBeenCalledTimes(1)
  expect(themeKit.command).toHaveBeenCalledWith(delegator.cmd, delegator.flagObj)
})
