import { describe, expect, test, vi, beforeEach } from 'vitest'
import Pull from './pull.js'
import Download from './download.js'
import * as themeUtils from '../../../utilities/theme.js'

vi.mock('../../../utilities/theme.js')

describe('Flag compatibility between Pull and Download commands', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('flag structure identity', () => {
    test('both commands have identical flag objects', () => {
      // The Download command should inherit the exact same flags object from Pull
      expect(Download.flags).toBe(Pull.flags)
    })

    test('both commands have identical flag properties', () => {
      const pullFlags = Pull.flags
      const downloadFlags = Download.flags

      // Get all flag names
      const flagNames = Object.keys(pullFlags)

      flagNames.forEach(flagName => {
        const pullFlag = (pullFlags as any)[flagName]
        const downloadFlag = (downloadFlags as any)[flagName]

        // Each flag should be the exact same object reference
        expect(downloadFlag).toBe(pullFlag)

        // Verify key properties are identical
        if (pullFlag.char) {
          expect(downloadFlag.char).toBe(pullFlag.char)
        }
        if (pullFlag.env) {
          expect(downloadFlag.env).toBe(pullFlag.env)
        }
        if (pullFlag.description) {
          expect(downloadFlag.description).toBe(pullFlag.description)
        }
        expect(downloadFlag.type).toBe(pullFlag.type)
      })
    })
  })

  describe('specific flag compatibility', () => {
    test('development flag (-d) is identical', () => {
      const pullDev = Pull.flags.development
      const downloadDev = Download.flags.development

      expect(downloadDev).toBe(pullDev)
      expect(downloadDev.char).toBe('d')
      expect(downloadDev.env).toBe('SHOPIFY_FLAG_DEVELOPMENT')
      expect(downloadDev.description).toBe('Pull settings files from your remote development theme.')
      expect(downloadDev.type).toBe('boolean')
    })

    test('live flag (-l) is identical', () => {
      const pullLive = Pull.flags.live
      const downloadLive = Download.flags.live

      expect(downloadLive).toBe(pullLive)
      expect(downloadLive.char).toBe('l')
      expect(downloadLive.env).toBe('SHOPIFY_FLAG_LIVE')
      expect(downloadLive.description).toBe('Pull settings files from your remote live theme.')
      expect(downloadLive.type).toBe('boolean')
    })

    test('theme flag (-t) is identical', () => {
      const pullTheme = Pull.flags.theme
      const downloadTheme = Download.flags.theme

      expect(downloadTheme).toBe(pullTheme)
      expect(downloadTheme.char).toBe('t')
      expect(downloadTheme.env).toBe('SHOPIFY_FLAG_THEME_ID')
      expect(downloadTheme.description).toBe('Theme ID or name of the remote theme.')
      expect(downloadTheme.type).toBe('option')
    })

    test('nodelete flag (-n) is identical', () => {
      const pullNodelete = Pull.flags.nodelete
      const downloadNodelete = Download.flags.nodelete

      expect(downloadNodelete).toBe(pullNodelete)
      expect(downloadNodelete.char).toBe('n')
      expect(downloadNodelete.env).toBe('SHOPIFY_FLAG_NODELETE')
      expect(downloadNodelete.description).toBe('Runs the pull command without deleting local files.')
      expect(downloadNodelete.type).toBe('boolean')
    })

    test('store flag (-s) is identical', () => {
      const pullStore = Pull.flags.store
      const downloadStore = Download.flags.store

      expect(downloadStore).toBe(pullStore)
      expect(downloadStore.char).toBe('s')
      expect(downloadStore.description).toContain('Store URL')
    })

    test('environment flag (-e) is identical', () => {
      const pullEnv = Pull.flags.environment
      const downloadEnv = Download.flags.environment

      expect(downloadEnv).toBe(pullEnv)
      expect(downloadEnv.char).toBe('e')
      expect(downloadEnv.description).toContain('environment')
    })

    test('global flags are identical', () => {
      // Verbose flag
      expect(Download.flags.verbose).toBe(Pull.flags.verbose)
      expect(Download.flags.verbose.description).toContain('verbosity')

      // No-color flag
      expect(Download.flags['no-color']).toBe(Pull.flags['no-color'])
      expect(Download.flags['no-color'].description).toContain('color')

      // Path flag
      expect(Download.flags.path).toBe(Pull.flags.path)
      expect(Download.flags.path.description).toContain('path')

      // Password flag
      expect(Download.flags.password).toBe(Pull.flags.password)
      expect(Download.flags.password.description).toContain('Password')
    })
  })

  describe('functional flag compatibility', () => {
    test('both commands process identical flags identically', async () => {
      // Given
      const mockDownloadThemeSettings = vi.mocked(themeUtils.downloadThemeSettings)
      mockDownloadThemeSettings.mockResolvedValue()

      const testFlags = {
        development: true,
        live: false,
        theme: 'test-theme-123',
        nodelete: true,
        verbose: true,
        'no-color': false,
        store: 'test.myshopify.com',
        password: 'secret123',
        path: '/my/theme/path',
        environment: 'staging'
      }

      // Test Pull command
      const pull = new Pull([], {} as any)
      const pullParse = vi.fn().mockResolvedValue({ flags: testFlags })
      // @ts-ignore - accessing protected method for testing
      pull.parse = pullParse

      await pull.run()

      const pullCallArgs = mockDownloadThemeSettings.mock.calls[0]?.[0]

      // Reset mock
      mockDownloadThemeSettings.mockClear()

      // Test Download command with same flags
      const download = new Download([], {} as any)
      const downloadParse = vi.fn().mockResolvedValue({ flags: testFlags })
      // @ts-ignore - accessing protected method for testing
      download.parse = downloadParse

      await download.run()

      const downloadCallArgs = mockDownloadThemeSettings.mock.calls[0]?.[0]

      // Both commands should pass identical arguments to downloadThemeSettings
      expect(downloadCallArgs).toEqual(pullCallArgs)
      expect(downloadCallArgs).toEqual(testFlags)
    })

    test('both commands handle missing flags identically', async () => {
      // Given
      const mockDownloadThemeSettings = vi.mocked(themeUtils.downloadThemeSettings)
      mockDownloadThemeSettings.mockResolvedValue()

      const minimalFlags = {
        development: undefined,
        live: undefined,
        theme: undefined,
        nodelete: undefined
      }

      // Test Pull command
      const pull = new Pull([], {} as any)
      const pullParse = vi.fn().mockResolvedValue({ flags: minimalFlags })
      // @ts-ignore - accessing protected method for testing
      pull.parse = pullParse

      await pull.run()

      const pullCallArgs = mockDownloadThemeSettings.mock.calls[0]?.[0]

      // Reset mock
      mockDownloadThemeSettings.mockClear()

      // Test Download command with same flags
      const download = new Download([], {} as any)
      const downloadParse = vi.fn().mockResolvedValue({ flags: minimalFlags })
      // @ts-ignore - accessing protected method for testing
      download.parse = downloadParse

      await download.run()

      const downloadCallArgs = mockDownloadThemeSettings.mock.calls[0]?.[0]

      // Both should handle missing flags identically
      expect(downloadCallArgs).toEqual(pullCallArgs)
      expect(downloadCallArgs).toEqual(minimalFlags)
    })

    test('both commands handle boolean flag variations identically', async () => {
      // Given
      const mockDownloadThemeSettings = vi.mocked(themeUtils.downloadThemeSettings)
      mockDownloadThemeSettings.mockResolvedValue()

      const booleanFlagTests = [
        { development: true, live: false, nodelete: true },
        { development: false, live: true, nodelete: false },
        { development: true, live: true, nodelete: true },
        { development: false, live: false, nodelete: false }
      ]

      for (const flags of booleanFlagTests) {
        // Test Pull command
        mockDownloadThemeSettings.mockClear()

        const pull = new Pull([], {} as any)
        const pullParse = vi.fn().mockResolvedValue({ flags })
        // @ts-ignore - accessing protected method for testing
        pull.parse = pullParse

        await pull.run()
        const pullCallArgs = mockDownloadThemeSettings.mock.calls[0]?.[0]

        // Test Download command with same flags
        mockDownloadThemeSettings.mockClear()

        const download = new Download([], {} as any)
        const downloadParse = vi.fn().mockResolvedValue({ flags })
        // @ts-ignore - accessing protected method for testing
        download.parse = downloadParse

        await download.run()
        const downloadCallArgs = mockDownloadThemeSettings.mock.calls[0]?.[0]

        // Should be identical
        expect(downloadCallArgs).toEqual(pullCallArgs)
        expect(downloadCallArgs).toEqual(flags)
      }
    })
  })

  describe('environment variable compatibility', () => {
    test('both commands use identical environment variable names', () => {
      const pullFlags = Pull.flags
      const downloadFlags = Download.flags

      const envFlags = ['development', 'live', 'theme', 'nodelete']

      envFlags.forEach(flagName => {
        expect((downloadFlags as any)[flagName].env).toBe((pullFlags as any)[flagName].env)
      })

      // Verify specific env var names
      expect(downloadFlags.development.env).toBe('SHOPIFY_FLAG_DEVELOPMENT')
      expect(downloadFlags.live.env).toBe('SHOPIFY_FLAG_LIVE')
      expect(downloadFlags.theme.env).toBe('SHOPIFY_FLAG_THEME_ID')
      expect(downloadFlags.nodelete.env).toBe('SHOPIFY_FLAG_NODELETE')
    })
  })

  describe('flag validation compatibility', () => {
    test('both commands have identical flag types', () => {
      const pullFlags = Pull.flags
      const downloadFlags = Download.flags

      Object.keys(pullFlags).forEach(flagName => {
        expect((downloadFlags as any)[flagName].type).toBe((pullFlags as any)[flagName].type)
      })
    })

    test('both commands have identical required flags', () => {
      const pullFlags = Pull.flags
      const downloadFlags = Download.flags

      Object.keys(pullFlags).forEach(flagName => {
        expect((downloadFlags as any)[flagName].required).toBe((pullFlags as any)[flagName].required)
      })
    })

    test('both commands have identical flag defaults', () => {
      const pullFlags = Pull.flags
      const downloadFlags = Download.flags

      Object.keys(pullFlags).forEach(flagName => {
        expect((downloadFlags as any)[flagName].default).toBe((pullFlags as any)[flagName].default)
      })
    })
  })

  describe('error handling compatibility', () => {
    test('both commands propagate downloadThemeSettings errors identically', async () => {
      // Given
      const mockDownloadThemeSettings = vi.mocked(themeUtils.downloadThemeSettings)
      const testError = new Error('Theme download failed')
      mockDownloadThemeSettings.mockRejectedValue(testError)

      const testFlags = { live: true }

      // Test Pull command error handling
      const pull = new Pull([], {} as any)
      const pullParse = vi.fn().mockResolvedValue({ flags: testFlags })
      // @ts-ignore - accessing protected method for testing
      pull.parse = pullParse

      let pullError: Error | undefined
      try {
        await pull.run()
      } catch (error) {
        pullError = error as Error
      }

      // Test Download command error handling
      const download = new Download([], {} as any)
      const downloadParse = vi.fn().mockResolvedValue({ flags: testFlags })
      // @ts-ignore - accessing protected method for testing
      download.parse = downloadParse

      let downloadError: Error | undefined
      try {
        await download.run()
      } catch (error) {
        downloadError = error as Error
      }

      // Both should throw the same error
      expect(pullError).toBeDefined()
      expect(downloadError).toBeDefined()
      expect(pullError?.message).toBe(downloadError?.message)
      expect(pullError?.message).toBe('Theme download failed')
    })
  })
})
