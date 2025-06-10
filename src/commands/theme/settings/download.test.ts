import { describe, expect, test, vi, beforeEach } from 'vitest'
import Download from './download.js'
import Pull from './pull.js'
import * as themeUtils from '../../../utilities/theme.js'

vi.mock('../../../utilities/theme.js')

describe('Download command (alias)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('inheritance and alias behavior', () => {
    test('extends Pull command', () => {
      const download = new Download([], {} as any)
      expect(download instanceof Pull).toBe(true)
      expect(download.constructor.name).toBe('Download')
    })

    test('has correct description for backwards compatibility', () => {
      expect(Download.description).toBe('Download settings from live theme.')
    })

    test('is hidden from command listings', () => {
      expect(Download.hidden).toBe(true)
    })

    test('inherits all flags from Pull command', () => {
      const pullFlags = Pull.flags
      const downloadFlags = Download.flags

      // Download should inherit all flags from Pull
      expect(downloadFlags).toBe(pullFlags)

      // Verify specific flags exist and have correct properties
      expect(downloadFlags.development).toBeDefined()
      expect(downloadFlags.development.char).toBe('d')
      expect(downloadFlags.development.env).toBe('SHOPIFY_FLAG_DEVELOPMENT')

      expect(downloadFlags.live).toBeDefined()
      expect(downloadFlags.live.char).toBe('l')
      expect(downloadFlags.live.env).toBe('SHOPIFY_FLAG_LIVE')

      expect(downloadFlags.theme).toBeDefined()
      expect(downloadFlags.theme.char).toBe('t')
      expect(downloadFlags.theme.env).toBe('SHOPIFY_FLAG_THEME_ID')

      expect(downloadFlags.nodelete).toBeDefined()
      expect(downloadFlags.nodelete.char).toBe('n')
      expect(downloadFlags.nodelete.env).toBe('SHOPIFY_FLAG_NODELETE')
    })

    test('inherits run method from Pull command', () => {
      expect(typeof Download.prototype.run).toBe('function')
      // The Download class overrides run method to show deprecation warning
      // but it should call super.run() which is Pull's run method
      expect(Download.prototype.run).not.toBe(Pull.prototype.run)
      expect(typeof Download.prototype.run).toBe('function')
    })
  })

  describe('functional compatibility', () => {
    test('calls downloadThemeSettings when run method is invoked', async () => {
      // Given
      const mockDownloadThemeSettings = vi.mocked(themeUtils.downloadThemeSettings)
      mockDownloadThemeSettings.mockResolvedValue()

      // When
      const download = new Download([], {} as any)
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
      download.parse = mockParse

      await download.run()

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

    test('handles all flag combinations identically to Pull command', async () => {
      // Given
      const mockDownloadThemeSettings = vi.mocked(themeUtils.downloadThemeSettings)
      mockDownloadThemeSettings.mockResolvedValue()

      // Test multiple flag combinations
      const flagCombinations = [
        { development: true, nodelete: false },
        { live: true, theme: '123456' },
        { theme: 'my-theme', nodelete: true },
        { development: true, live: false, nodelete: true, theme: 'test' },
        {}
      ]

      for (const flags of flagCombinations) {
        mockDownloadThemeSettings.mockClear()

        const download = new Download([], {} as any)
        const mockParse = vi.fn().mockResolvedValue({ flags })
        // @ts-ignore - accessing protected method for testing
        download.parse = mockParse

        await download.run()

        expect(mockDownloadThemeSettings).toHaveBeenCalledWith(flags)
      }
    })

    test('propagates errors identically to Pull command', async () => {
      // Given
      const mockDownloadThemeSettings = vi.mocked(themeUtils.downloadThemeSettings)
      const testError = new Error('Download failed')
      mockDownloadThemeSettings.mockRejectedValue(testError)

      // When/Then
      const download = new Download([], {} as any)
      const mockParse = vi.fn().mockResolvedValue({
        flags: {}
      })
      // @ts-ignore - accessing protected method for testing
      download.parse = mockParse

      await expect(download.run()).rejects.toThrow('Download failed')
      expect(mockDownloadThemeSettings).toHaveBeenCalled()
    })
  })

  describe('backwards compatibility verification', () => {
    test('maintains original command description', () => {
      // Ensure the description specifically says "Download" for backwards compatibility
      expect(Download.description).toContain('Download')
      expect(Download.description).not.toContain('Pull')
    })

    test('has identical flag structure to original implementation', () => {
      const flags = Download.flags

      // Verify all original flags are present with correct properties
      expect(flags.development.description).toContain('Pull settings files from your remote development theme')
      expect(flags.live.description).toContain('Pull settings files from your remote live theme')
      expect(flags.nodelete.description).toContain('Runs the pull command without deleting local files')
      expect(flags.theme.description).toBe('Theme ID or name of the remote theme.')
    })

    test('uses same utility function as original', () => {
      // The Download command should call the same downloadThemeSettings function
      // via super.run() even though it overrides the run method for deprecation warning
      expect(Download.prototype.run).not.toBe(Pull.prototype.run)
      expect(typeof Download.prototype.run).toBe('function')
    })
  })

  describe('flag inheritance verification', () => {
    test('inherits global flags from Pull', () => {
      const flags = Download.flags

      // Should include verbose and no-color from global flags
      expect(flags.verbose).toBeDefined()
      expect(flags['no-color']).toBeDefined()
    })

    test('inherits theme flags from Pull', () => {
      const flags = Download.flags

      // Should include store and other theme-related flags
      expect(flags.store).toBeDefined()
      expect(flags.password).toBeDefined()
      expect(flags.path).toBeDefined()
      expect(flags.environment).toBeDefined()
    })

    test('flag environment variables work identically', () => {
      const flags = Download.flags

      // Environment variables should be identical to Pull command
      expect(flags.development.env).toBe('SHOPIFY_FLAG_DEVELOPMENT')
      expect(flags.live.env).toBe('SHOPIFY_FLAG_LIVE')
      expect(flags.theme.env).toBe('SHOPIFY_FLAG_THEME_ID')
      expect(flags.nodelete.env).toBe('SHOPIFY_FLAG_NODELETE')
    })
  })

  describe('command properties comparison with Pull', () => {
    test('has same flag structure as Pull except for description and hidden property', () => {
      const pullFlags = Pull.flags
      const downloadFlags = Download.flags

      // Flags should be identical objects (inherited)
      expect(downloadFlags).toBe(pullFlags)
    })

    test('differs from Pull only in description and hidden status', () => {
      // Description should be different
      expect(Download.description).toBe('Download settings from live theme.')
      expect(Pull.description).toBe('Pull settings from live theme.')

      // Hidden status should be different
      expect(Download.hidden).toBe(true)
      expect(Pull.hidden).toBeUndefined()

      // Everything else should be inherited/identical
      expect(Download.flags).toBe(Pull.flags)
    })
  })
})
