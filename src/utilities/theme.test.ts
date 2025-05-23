import { describe, expect, test, vi, beforeEach } from 'vitest'
import { deployTheme, deployToLive, DownloadFlags, downloadThemeSettings, getThemesByIdentifier, pullLiveThemeSettings, pullThemeSettings } from './theme.js'
import { fetchStoreThemes, pull, push } from '@shopify/cli'
import { Theme } from '@shopify/cli-kit/node/themes/types'
import { PullFlags } from './shopify/services/pull.js'
import { PushFlags } from './shopify/services/push.js'

vi.mock('@shopify/cli')

describe('theme utilities', () => {
  const adminSession = { token: 'ABC', storeFqdn: 'example.myshopify.com' }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('pullThemeSettings', () => {
    test('pulls settings from theme', async () => {
      // Given
      const settingsFlags = [
        'config/settings_data.json',
        'sections/*.json',
        'templates/*.json',
        'templates/customers/*.json',
        'templates/metaobject/*.json',
      ]
      const flags: PullFlags = {
        only: settingsFlags,
        nodelete: true,
      }

      // When
      await pullThemeSettings(flags)

      // Then
      const expectedFlags = {
        only: settingsFlags,
        nodelete: true,
      }
      expect(pull).toHaveBeenCalledWith(expectedFlags)
    })
  })

  describe('pullLiveThemeSettings', () => {
    test('pulls settings from live theme', async () => {
      // Given
      const settingsFlags = [
        'config/settings_data.json',
        'sections/*.json',
        'templates/*.json',
        'templates/customers/*.json',
        'templates/metaobject/*.json',
      ]
      const flags: PullFlags = {
        only: settingsFlags,
        nodelete: true,
      }

      // When
      await pullLiveThemeSettings(flags)

      // Then
      const expectedFlags = {
        only: settingsFlags,
        nodelete: true,
        live: true,
      }
      expect(pull).toHaveBeenCalledWith(expectedFlags)
    })
  })

  describe('downloadThemeSettings', () => {
    describe('flag transformation and pass-through', () => {
      test('passes all flags correctly when live flag is explicitly set', async () => {
        // Given
        const flags: DownloadFlags = {
          live: true,
          nodelete: true,
          verbose: true,
          'no-color': false,
          path: '/my-theme',
          password: 'test-token',
          store: 'test.myshopify.com',
          theme: undefined,
          development: undefined,
        }

        // When
        await downloadThemeSettings(flags)

        // Then
        expect(pull).toHaveBeenCalledWith({
          verbose: true,
          noColor: false,
          path: '/my-theme',
          password: 'test-token',
          store: 'test.myshopify.com',
          theme: undefined,
          development: undefined,
          live: true,
          nodelete: true,
          only: [
            'config/settings_data.json',
            'sections/*.json',
            'templates/*.json',
            'templates/customers/*.json',
            'templates/metaobject/*.json',
          ],
        })
      })

      test('passes all flags correctly when development flag is set', async () => {
        // Given
        const flags: DownloadFlags = {
          development: true,
          nodelete: false,
          verbose: false,
          'no-color': true,
          path: '/dev-theme',
          password: 'dev-token',
          store: 'dev.myshopify.com',
          theme: undefined,
          live: undefined,
        }

        // When
        await downloadThemeSettings(flags)

        // Then
        expect(pull).toHaveBeenCalledWith({
          verbose: false,
          noColor: true,
          path: '/dev-theme',
          password: 'dev-token',
          store: 'dev.myshopify.com',
          theme: undefined,
          development: true,
          live: false,
          nodelete: false,
          only: [
            'config/settings_data.json',
            'sections/*.json',
            'templates/*.json',
            'templates/customers/*.json',
            'templates/metaobject/*.json',
          ],
        })
      })

      test('passes all flags correctly when specific theme is set', async () => {
        // Given
        const flags: DownloadFlags = {
          theme: '123456',
          nodelete: true,
          verbose: false,
          'no-color': false,
          path: '/specific-theme',
          password: 'theme-token',
          store: 'store.myshopify.com',
          development: undefined,
          live: undefined,
        }

        // When
        await downloadThemeSettings(flags)

        // Then
        expect(pull).toHaveBeenCalledWith({
          verbose: false,
          noColor: false,
          path: '/specific-theme',
          password: 'theme-token',
          store: 'store.myshopify.com',
          theme: '123456',
          development: undefined,
          live: false,
          nodelete: true,
          only: [
            'config/settings_data.json',
            'sections/*.json',
            'templates/*.json',
            'templates/customers/*.json',
            'templates/metaobject/*.json',
          ],
        })
      })

      test('defaults to live theme when no theme, development, or live flags are set', async () => {
        // Given
        const flags: DownloadFlags = {
          nodelete: true,
          verbose: true,
          'no-color': true,
          path: '/default-theme',
          password: 'default-token',
          store: 'default.myshopify.com',
          theme: undefined,
          development: undefined,
          live: undefined,
        }

        // When
        await downloadThemeSettings(flags)

        // Then
        expect(pull).toHaveBeenCalledWith({
          verbose: true,
          noColor: true,
          path: '/default-theme',
          password: 'default-token',
          store: 'default.myshopify.com',
          theme: undefined,
          development: undefined,
          live: true,
          nodelete: true,
          only: [
            'config/settings_data.json',
            'sections/*.json',
            'templates/*.json',
            'templates/customers/*.json',
            'templates/metaobject/*.json',
          ],
        })
      })

      test('correctly transforms no-color flag to noColor', async () => {
        // Given
        const flags: DownloadFlags = {
          'no-color': true,
          verbose: false,
          path: '/color-test',
          password: 'color-token',
          store: 'color.myshopify.com',
          nodelete: false,
          theme: undefined,
          development: undefined,
          live: undefined,
        }

        // When
        await downloadThemeSettings(flags)

        // Then
        expect(pull).toHaveBeenCalledWith({
          verbose: false,
          noColor: true,
          path: '/color-test',
          password: 'color-token',
          store: 'color.myshopify.com',
          theme: undefined,
          development: undefined,
          live: true,
          nodelete: false,
          only: [
            'config/settings_data.json',
            'sections/*.json',
            'templates/*.json',
            'templates/customers/*.json',
            'templates/metaobject/*.json',
          ],
        })
      })
    })

    describe('live flag default logic', () => {
      test('live is true when neither theme nor development are set', async () => {
        const flags: DownloadFlags = { theme: undefined, development: undefined, live: undefined }
        await downloadThemeSettings(flags)

        expect(pull).toHaveBeenCalledWith(expect.objectContaining({
          live: true,
        }))
      })

      test('live is false when theme is set but live is not', async () => {
        const flags: DownloadFlags = { theme: '123', development: undefined, live: undefined }
        await downloadThemeSettings(flags)

        expect(pull).toHaveBeenCalledWith(expect.objectContaining({
          live: false,
        }))
      })

      test('live is false when development is set but live is not', async () => {
        const flags: DownloadFlags = { theme: undefined, development: true, live: undefined }
        await downloadThemeSettings(flags)

        expect(pull).toHaveBeenCalledWith(expect.objectContaining({
          live: false,
        }))
      })

      test('live is true when explicitly set to true', async () => {
        const flags: DownloadFlags = { theme: '123', development: true, live: true }
        await downloadThemeSettings(flags)

        expect(pull).toHaveBeenCalledWith(expect.objectContaining({
          live: true,
        }))
      })

      test('live is true when explicitly set to false but no theme or development', async () => {
        const flags: DownloadFlags = { theme: undefined, development: undefined, live: false }
        await downloadThemeSettings(flags)

        expect(pull).toHaveBeenCalledWith(expect.objectContaining({
          live: true,
        }))
      })

      test('live is false when explicitly set to false and theme is set', async () => {
        const flags: DownloadFlags = { theme: '123', development: undefined, live: false }
        await downloadThemeSettings(flags)

        expect(pull).toHaveBeenCalledWith(expect.objectContaining({
          live: false,
        }))
      })

      test('live is false when both theme and development are set but live is not', async () => {
        const flags: DownloadFlags = { theme: '456', development: true, live: undefined }
        await downloadThemeSettings(flags)

        expect(pull).toHaveBeenCalledWith(expect.objectContaining({
          live: false,
        }))
      })
    })

    describe('edge cases', () => {
      test('handles false values correctly for boolean flags', async () => {
        // Given
        const flags: DownloadFlags = {
          live: false,
          development: false,
          nodelete: false,
          verbose: false,
          'no-color': false,
          path: '/false-flags',
          password: 'false-token',
          store: 'false.myshopify.com',
          theme: undefined,
        }

        // When
        await downloadThemeSettings(flags)

        // Then
        expect(pull).toHaveBeenCalledWith({
          verbose: false,
          noColor: false,
          path: '/false-flags',
          password: 'false-token',
          store: 'false.myshopify.com',
          theme: undefined,
          development: false,
          live: true,
          nodelete: false,
          only: [
            'config/settings_data.json',
            'sections/*.json',
            'templates/*.json',
            'templates/customers/*.json',
            'templates/metaobject/*.json',
          ],
        })
      })

      test('handles empty string values', async () => {
        // Given
        const flags: DownloadFlags = {
          theme: '',
          path: '',
          password: '',
          store: '',
          verbose: false,
          'no-color': false,
          nodelete: false,
          development: undefined,
          live: undefined,
        }

        // When
        await downloadThemeSettings(flags)

        // Then
        expect(pull).toHaveBeenCalledWith({
          verbose: false,
          noColor: false,
          path: '',
          password: '',
          store: '',
          theme: '',
          development: undefined,
          live: true,
          nodelete: false,
          only: [
            'config/settings_data.json',
            'sections/*.json',
            'templates/*.json',
            'templates/customers/*.json',
            'templates/metaobject/*.json',
          ],
        })
      })

      test('handles all flags being undefined except required ones', async () => {
        // Given
        const flags = {
          verbose: false,
          'no-color': false,
          path: '/minimal',
          password: 'minimal-token',
          store: 'minimal.myshopify.com',
        }

        // When
        await downloadThemeSettings(flags)

        // Then
        expect(pull).toHaveBeenCalledWith({
          verbose: false,
          noColor: false,
          path: '/minimal',
          password: 'minimal-token',
          store: 'minimal.myshopify.com',
          theme: undefined,
          development: undefined,
          live: true,
          nodelete: undefined,
          only: [
            'config/settings_data.json',
            'sections/*.json',
            'templates/*.json',
            'templates/customers/*.json',
            'templates/metaobject/*.json',
          ],
        })
      })
    })

    describe('settings files filtering', () => {
      test('always includes only settings files in pull request', async () => {
        const flags = { live: true }
        await downloadThemeSettings(flags)

        expect(pull).toHaveBeenCalledWith(expect.objectContaining({
          only: [
            'config/settings_data.json',
            'sections/*.json',
            'templates/*.json',
            'templates/customers/*.json',
            'templates/metaobject/*.json',
          ],
        }))
      })
    })
  })

  describe('deploy', () => {
    describe('when should publish automatically', () => {
      test('pushes theme files to theme', async () => {
        // Given
        const themeId = 1
        const flags: PushFlags = {
          nodelete: true,
          publish: true,
        }

        // When
        await deployTheme(themeId, flags)

        // Then
        const expectedFlags = {
          nodelete: true,
          publish: true,
          theme: themeId.toString(),
        }
        expect(push).toHaveBeenCalledWith(expectedFlags)
      })
    })

    describe('when should not publish automatically', () => {
      test('pushes theme files to theme', async () => {
        // Given
        const themeId = 1
        const flags: PushFlags = {
          nodelete: true,
        }

        // When
        await deployTheme(themeId, flags)

        // Then
        const expectedFlags = {
          nodelete: true,
          theme: themeId.toString(),
        }
        expect(push).toHaveBeenCalledWith(expectedFlags)
      })
    })
  })

  describe('deployToLive', () => {
    test('pushes theme files to live theme', async () => {
      // Given
      const flags: PushFlags = {}

      // When
      await deployToLive(flags)

      // Then
      const expectedFlags: PushFlags = {
        live: true,
        allowLive: true,
      }
      expect(push).toHaveBeenCalledWith(expectedFlags)
    })
  })

  describe('getThemesByIdentifier', () => {
    function theme(id: number, role: string) {
      return { id, role, name: `theme (${id})` } as Theme
    }

    test('returns list of themes that match id or name', async () => {
      // Given
      const themes = [theme(1, 'unpublished'), theme(2, 'unpublished')]
      vi.mocked(fetchStoreThemes).mockResolvedValue(themes)

      // When
      const result = await getThemesByIdentifier(adminSession.storeFqdn, adminSession.token, '1')

      // Then
      expect(result).toEqual([themes[0]])
    })
  })
})
