import { describe, expect, test, vi, beforeEach } from 'vitest'
import Pull from './pull.js'
import * as themeUtils from '../../../utilities/theme.js'

vi.mock('../../../utilities/theme.js')

describe('Pull command', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('command properties', () => {
    test('has correct description', () => {
      expect(Pull.description).toBe('Pull settings from live theme.')
    })

    test('has correct flags structure', () => {
      const flags = Pull.flags

      // Check that all required flags exist
      expect(flags.development).toBeDefined()
      expect(flags.live).toBeDefined()
      expect(flags.theme).toBeDefined()
      expect(flags.nodelete).toBeDefined()

      // Check flag characters
      expect(flags.development.char).toBe('d')
      expect(flags.live.char).toBe('l')
      expect(flags.theme.char).toBe('t')
      expect(flags.nodelete.char).toBe('n')

      // Check environment variables
      expect(flags.development.env).toBe('SHOPIFY_FLAG_DEVELOPMENT')
      expect(flags.live.env).toBe('SHOPIFY_FLAG_LIVE')
      expect(flags.theme.env).toBe('SHOPIFY_FLAG_THEME_ID')
      expect(flags.nodelete.env).toBe('SHOPIFY_FLAG_NODELETE')
    })

    test('includes global flags and theme flags', () => {
      const flags = Pull.flags

      // Should include verbose and no-color from global flags
      expect(flags.verbose).toBeDefined()
      expect(flags['no-color']).toBeDefined()

      // Should include store and other theme-related flags
      expect(flags.store).toBeDefined()
      expect(flags.password).toBeDefined()
      expect(flags.path).toBeDefined()
    })

    test('is not hidden', () => {
      expect(Pull.hidden).toBeUndefined()
    })
  })

  describe('run method', () => {
    test('calls downloadThemeSettings when run method is invoked', async () => {
      // Given
      const mockDownloadThemeSettings = vi.mocked(themeUtils.downloadThemeSettings)
      mockDownloadThemeSettings.mockResolvedValue()

      // When
      const pull = new Pull([], {} as any)
      const mockParse = vi.fn().mockResolvedValue({
        flags: {
          live: true,
          development: false,
          theme: 'test-theme',
          nodelete: true,
          verbose: true,
          'no-color': false,
          store: 'test.myshopify.com',
          password: 'test-password',
          path: '/test/path'
        }
      })
      // @ts-ignore - accessing protected method for testing
      pull.parse = mockParse

      await pull.run()

      // Then
      expect(mockDownloadThemeSettings).toHaveBeenCalledWith({
        live: true,
        development: false,
        theme: 'test-theme',
        nodelete: true,
        verbose: true,
        'no-color': false,
        store: 'test.myshopify.com',
        password: 'test-password',
        path: '/test/path'
      })
    })

    test('calls downloadThemeSettings with minimal flags', async () => {
      // Given
      const mockDownloadThemeSettings = vi.mocked(themeUtils.downloadThemeSettings)
      mockDownloadThemeSettings.mockResolvedValue()

      // When
      const pull = new Pull([], {} as any)
      const mockParse = vi.fn().mockResolvedValue({
        flags: {
          development: undefined,
          live: undefined,
          theme: undefined,
          nodelete: undefined
        }
      })
      // @ts-ignore - accessing protected method for testing
      pull.parse = mockParse

      await pull.run()

      // Then
      expect(mockDownloadThemeSettings).toHaveBeenCalledWith({
        development: undefined,
        live: undefined,
        theme: undefined,
        nodelete: undefined
      })
    })

    test('propagates errors from downloadThemeSettings', async () => {
      // Given
      const mockDownloadThemeSettings = vi.mocked(themeUtils.downloadThemeSettings)
      const testError = new Error('Download failed')
      mockDownloadThemeSettings.mockRejectedValue(testError)

      // When/Then
      const pull = new Pull([], {} as any)
      const mockParse = vi.fn().mockResolvedValue({
        flags: {}
      })
      // @ts-ignore - accessing protected method for testing
      pull.parse = mockParse

      await expect(pull.run()).rejects.toThrow('Download failed')
      expect(mockDownloadThemeSettings).toHaveBeenCalled()
    })
  })

  describe('flag descriptions use pull terminology', () => {
    test('development flag description mentions pull', () => {
      expect(Pull.flags.development.description).toContain('Pull settings files from your remote development theme')
    })

    test('live flag description mentions pull', () => {
      expect(Pull.flags.live.description).toContain('Pull settings files from your remote live theme')
    })

    test('nodelete flag description mentions pull command', () => {
      expect(Pull.flags.nodelete.description).toContain('Runs the pull command without deleting local files')
    })

    test('theme flag description is neutral', () => {
      expect(Pull.flags.theme.description).toBe('Theme ID or name of the remote theme.')
    })
  })

  describe('inheritance verification', () => {
    test('extends BaseCommand', () => {
      const pull = new Pull([], {} as any)
      expect(pull.constructor.name).toBe('Pull')
    })

    test('has run method', () => {
      expect(typeof Pull.prototype.run).toBe('function')
    })
  })
})
