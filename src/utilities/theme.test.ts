import { describe, expect, test, vi } from 'vitest'
import { execCLI2 } from '@shopify/cli-kit/node/ruby'
import { getThemesByIdentifier, pullLiveThemeSettings, push, pushToLive } from './theme.js'
import { fetchStoreThemes } from "@shopify/theme/dist/cli/utilities/theme-selector/fetch.js"
import { Theme } from '@shopify/cli-kit/node/themes/types'

vi.mock('@shopify/cli-kit/node/ruby')
vi.mock("@shopify/theme/dist/cli/utilities/theme-selector/fetch.js")

describe('theme utilities', () => {
  const adminSession = { token: 'ABC', storeFqdn: 'example.myshopify.com' }
  const path = '/my-theme'

  function expectCLI2ToHaveBeenCalledWith(command: string) {
    expect(execCLI2).toHaveBeenCalledWith(command.split(' '), {
      adminToken: adminSession.token,
      store: 'example.myshopify.com',
    })
  }
  describe('pullThemeSettings', () => {
    test('pulls settings from live theme', async () => {
      // Given
      const themeFlags = ['--nodelete']
      const settingsFlags = [
        '--only config/settings_data.json',
        '--only sections/*.json',
        '--only templates/*.json',
        '--only templates/customers/*.json',
        '--only templates/metaobject/*.json'
      ].join(" ")


      // When
      await pullLiveThemeSettings(adminSession, path, themeFlags)

      // Then
      expectCLI2ToHaveBeenCalledWith(`theme pull ${path} --nodelete --live ${settingsFlags}`)
    })
  })
  describe('push', () => {
    describe('when should publish automatically', () => {
      test('pushes theme files to theme', async () => {
        // Given
        const themeFlags = ['--nodelete']
        const themeId = 1

        // When
        await push(adminSession, path, true, themeFlags, themeId)

        // Then
        expectCLI2ToHaveBeenCalledWith(`theme push ${path} --nodelete --theme ${themeId} --publish`)
      })
    })

    describe('when should not publish automatically', () => {
      test('pushes theme files to theme', async () => {
        // Given
        const themeFlags = ['--nodelete']
        const themeId = 1

        // When
        await push(adminSession, path, false, themeFlags, themeId)

        // Then
        expectCLI2ToHaveBeenCalledWith(`theme push ${path} --nodelete --theme ${themeId}`)

      })
    })
  })
  describe('pushToLive', () => {
    test('pushes theme files to live theme', async () => {
      // Given
      const themeFlags = ['--nodelete']

      // When
      await pushToLive(adminSession, path, themeFlags)

      // Then
      expectCLI2ToHaveBeenCalledWith(`theme push ${path} --nodelete --live --allow-live`)
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
      const result = await getThemesByIdentifier(adminSession, '1')

      // Then
      expect(result).toEqual([themes[0]])
    })
  })
})
