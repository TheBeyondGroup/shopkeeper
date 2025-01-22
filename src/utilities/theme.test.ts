import {describe, expect, test, vi} from 'vitest'
import {deployTheme, deployToLive, getThemesByIdentifier, pullLiveThemeSettings, pullThemeSettings} from './theme.js'
import {fetchStoreThemes, pull, push} from '@shopify/cli'
import {Theme} from '@shopify/cli-kit/node/themes/types'
import {PullFlags} from './shopify/services/pull.js'
import {PushFlags} from './shopify/services/push.js'

vi.mock('@shopify/cli')

describe('theme utilities', () => {
  const adminSession = {token: 'ABC', storeFqdn: 'example.myshopify.com'}
  const path = '/my-theme'

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
      return {id, role, name: `theme (${id})`} as Theme
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
