import {beforeEach, describe, expect, test, vi} from 'vitest'
import {get} from './get.js'
import {Theme} from '@shopify/cli-kit/node/themes/types'
import {fetchStoreThemes} from '@shopify/cli'

vi.mock('@shopify/cli')

describe('get', () => {
  const adminSession = {token: 'ABC', storeFqdn: 'example.myshopify.com'}

  function theme(id: number, role: string) {
    return {id, role, name: `theme (${id})`} as Theme
  }

  describe('when theme is found', () => {
    test('returns an array with the theme', async () => {
      // Given
      const expectedTheme = theme(1, 'unpublished')
      const anotherTheme = theme(2, 'unpublished')
      const themes = [expectedTheme, anotherTheme]
      vi.mocked(fetchStoreThemes).mockResolvedValue(themes)

      // When
      const actualThemes = await get(adminSession, '1')

      // Then
      expect(actualThemes).toEqual([expectedTheme])
    })
  })
  describe('when theme is not found', async () => {
    test('throws error', () => {
      // Given
      const expectedTheme = theme(1, 'unpublished')
      const anotherTheme = theme(2, 'unpublished')
      const themes = [expectedTheme, anotherTheme]
      vi.mocked(fetchStoreThemes).mockResolvedValue(themes)

      // When
      const errorFunc = async () => await get(adminSession, '3')

      // Then
      expect(errorFunc).toThrowError
    })
  })
})
