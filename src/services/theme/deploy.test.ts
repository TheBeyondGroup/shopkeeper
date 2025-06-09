import { beforeEach, describe, expect, test, vi } from 'vitest'
import {
  basicDeploy,
  blueGreenDeploy,
  deploy,
  DeployFlags,
  getLiveTheme,
  getOnDeckThemeId,
  gitHeadHash,
  generateHistoryThemeName,
  parseHistoryThemeName,
  isHistoryTheme,
  formatDateDDMMYYYY,
  getCurrentUTCTimestamp,
  getHistoryThemes,
  sortHistoryThemesByAge,
  deleteHistoryTheme,
  cleanupExcessHistoryThemes,
  historyDeploy,
  getThemeRetentionLimit,
} from './deploy.js'
import { findPathUp } from '@shopify/cli-kit/node/fs'
import { getLatestGitCommit } from '@shopify/cli-kit/node/git'
import { BLUE_GREEN_STRATEGY, HISTORY_STRATEGY } from '../../utilities/constants.js'
import { Theme } from '@shopify/cli-kit/node/themes/types'
import { renderText } from '@shopify/cli-kit/node/ui'
import { themeUpdate, themeDelete } from '@shopify/cli-kit/node/themes/api'
import { deployToLive, deployTheme, pullLiveThemeSettings } from '../../utilities/theme.js'
import { findThemes } from '../../utilities/shopify/theme-selector.js'
import { ensureAuthenticatedThemes } from '@shopify/cli-kit/node/session'
import { getThemeStore } from '../../utilities/shopify/services/local-storage.js'
import { ensureThemeStore } from '../../utilities/shopify/theme-store.js'
import { push } from '@shopify/cli'

vi.mock('@shopify/cli-kit/node/fs')
vi.mock('@shopify/cli-kit/node/git')
vi.mock('@shopify/cli-kit/node/ui')
vi.mock('@shopify/cli-kit/node/themes/api')
vi.mock('@shopify/cli')
vi.mock('@shopify/cli-kit/node/session')
vi.mock('../../utilities/shopify/theme-selector.js')
vi.mock('../../utilities/theme.js')
vi.mock('../../utilities/shopify/services/local-storage.js')
vi.mock('../../utilities/shopify/theme-store.js')

describe('deploy', () => {
  const adminSession = { token: 'ABC', storeFqdn: 'example.myshopify.com' }

  function theme(id: number, role: string) {
    return { id, role, name: `theme (${id})` } as Theme
  }

  beforeEach(async () => {
    vi.resetAllMocks()
  })

  describe('deploy', () => {
    describe('when blue/green strategy', () => {
      test('makes blue/green deploy', async () => {
        // Given
        const green = 1
        const blue = 2
        const liveTheme = theme(blue, 'main')
        const themes = [theme(green, 'unpublished'), liveTheme]
        vi.mocked(getThemeStore).mockReturnValue('')
        vi.mocked(ensureAuthenticatedThemes).mockResolvedValue(adminSession)
        vi.mocked(findThemes).mockResolvedValue([liveTheme])
        vi.mocked(themeUpdate).mockResolvedValue(themes[1])
        vi.mocked(findPathUp).mockResolvedValue('path')
        vi.mocked(getLatestGitCommit).mockResolvedValue({
          hash: 'BABCD1234AB',
          date: '',
          message: '',
          refs: '',
          body: '',
          author_name: '',
          author_email: '',
        })
        const flags: DeployFlags = {
          store: 'test',
          green: green,
          blue: blue,
          strategy: BLUE_GREEN_STRATEGY,
          publish: false,
        }

        // When
        await deploy(flags)

        // Then
        expect(renderText).toHaveBeenCalledTimes(2)
        expect(renderText).toHaveBeenCalledWith({ text: 'Pulling theme settings' })
        expect(pullLiveThemeSettings).toBeCalledWith(flags)
        expect(deployTheme).toBeCalledWith(green, flags)
        expect(renderText).toHaveBeenCalledWith({ text: 'Green renamed to [BABCD123] Production - Green' })
      })
    })

    describe('when no strategy is passsed', () => {
      test('makes basic deploy', async () => {
        // Given
        const liveTheme = theme(1, 'main')
        vi.mocked(getThemeStore).mockReturnValue('mystore')
        vi.mocked(ensureAuthenticatedThemes).mockResolvedValue(adminSession)
        vi.mocked(findThemes).mockResolvedValue([liveTheme])
        vi.mocked(themeUpdate).mockResolvedValue(liveTheme)
        vi.mocked(findPathUp).mockResolvedValue('path')
        vi.mocked(getLatestGitCommit).mockResolvedValue({
          hash: 'AABCD1234AB',
          date: '',
          message: '',
          refs: '',
          body: '',
          author_name: '',
          author_email: '',
        })
        const flags: DeployFlags = {
          strategy: '',
          publish: false,
        }

        // When
        await deploy(flags)

        // Then
        expect(renderText).toHaveBeenCalledTimes(2)
        expect(renderText).toHaveBeenCalledWith({ text: 'Pulling theme settings' })
        expect(pullLiveThemeSettings).toBeCalledWith(flags)
        expect(deployToLive).toBeCalledWith(flags)
        expect(renderText).toHaveBeenCalledWith({ text: 'Live theme renamed to [AABCD123] Production' })
      })
    })
  })

  describe('blueGreenDeploy', () => {
    test('pulls live theme settings and updates on-deck theme', async () => {
      // Given
      const green = 1
      const blue = 2
      const liveTheme = theme(blue, 'main')
      const themes = [theme(green, 'unpublished'), liveTheme]
      vi.mocked(getThemeStore).mockReturnValue('mystore')
      vi.mocked(ensureAuthenticatedThemes).mockResolvedValue(adminSession)
      vi.mocked(findThemes).mockResolvedValue([liveTheme])
      vi.mocked(themeUpdate).mockResolvedValue(themes[1])
      vi.mocked(findPathUp).mockResolvedValue('path')
      vi.mocked(getLatestGitCommit).mockResolvedValue({
        hash: 'BABCD1234AB',
        date: '',
        message: '',
        refs: '',
        body: '',
        author_name: '',
        author_email: '',
      })
      const flags: DeployFlags = {
        green: green,
        blue: blue,
        strategy: BLUE_GREEN_STRATEGY,
        publish: false,
      }

      // When
      await blueGreenDeploy(flags)

      // Then
      expect(renderText).toHaveBeenCalledTimes(2)
      expect(renderText).toHaveBeenCalledWith({ text: 'Pulling theme settings' })
      expect(pullLiveThemeSettings).toBeCalledWith(flags)
      expect(deployTheme).toBeCalledWith(green, flags)
      expect(renderText).toHaveBeenCalledWith({ text: 'Green renamed to [BABCD123] Production - Green' })
    })
  })

  describe('basicDeploy', () => {
    test('pulls live theme settings and updates theme', async () => {
      // Given
      const ondeckThemeId = 1
      const publishedThemeId = 2
      const themes = [theme(ondeckThemeId, 'unpublished'), theme(publishedThemeId, 'main')]
      vi.mocked(getThemeStore).mockReturnValue('mystore')
      vi.mocked(ensureAuthenticatedThemes).mockResolvedValue(adminSession)
      vi.mocked(findThemes).mockResolvedValue(themes)
      vi.mocked(themeUpdate).mockResolvedValue(themes[0])
      vi.mocked(findPathUp).mockResolvedValue('path')
      vi.mocked(getLatestGitCommit).mockResolvedValue({
        hash: 'AABCD1234AB',
        date: '',
        message: '',
        refs: '',
        body: '',
        author_name: '',
        author_email: '',
      })
      const flags: DeployFlags = {
        strategy: '',
        publish: false,
      }

      // When
      await basicDeploy(flags)

      // Then
      expect(renderText).toHaveBeenCalledTimes(2)
      expect(renderText).toHaveBeenCalledWith({ text: 'Pulling theme settings' })
      expect(pullLiveThemeSettings).toBeCalledWith(flags)
      expect(deployToLive).toBeCalledWith(flags)
      expect(renderText).toHaveBeenCalledWith({ text: 'Live theme renamed to [AABCD123] Production' })
    })
  })

  describe('getLiveTheme', () => {
    describe('when live theme exists', () => {
      test('returns live theme id', async () => {
        // Given
        vi.mocked(findThemes).mockResolvedValue([theme(1, 'unpublished')])

        // When
        const actualId = await getLiveTheme(adminSession)

        // Then
        expect(actualId).toEqual(1)
      })
    })

    describe('when live theme does not exist', () => {
      test('throws abort error', async () => {
        // Given
        vi.mocked(findThemes).mockResolvedValue([])

        // When
        const errorFunc = async () => {
          await getLiveTheme(adminSession)
        }

        // Then
        await expect(errorFunc).rejects.toThrowError(/Something very bad has happened. The store doesn't have a live theme./)
      })
    })
  })

  describe('getOnDeckThemeId', () => {
    describe('when published theme is blue', () => {
      test('returns green', () => {
        // Given
        const liveTheme = 2
        const blueTheme = 1
        const greenTheme = 2

        // When
        const onDeckTheme = getOnDeckThemeId(liveTheme, blueTheme, greenTheme)

        // Then
        expect(onDeckTheme).toEqual({
          id: blueTheme,
          name: 'Blue',
        })
      })
    })
    describe('when published theme is green', () => {
      test('returns blue', () => {
        // Given
        const liveTheme = 1
        const blueTheme = 1
        const greenTheme = 2

        // When
        const onDeckTheme = getOnDeckThemeId(liveTheme, blueTheme, greenTheme)

        // Then
        expect(onDeckTheme).toEqual({
          id: greenTheme,
          name: 'Green',
        })
      })
    })
  })

  describe('gitHeadHash', () => {
    test('returns the first 8 chars', async () => {
      // Given
      vi.mocked(findPathUp).mockResolvedValue('path')
      vi.mocked(getLatestGitCommit).mockResolvedValue({
        hash: 'ABCDEFGHIJKLMNOP',
        date: '',
        message: '',
        refs: '',
        body: '',
        author_name: '',
        author_email: '',
      })

      // When
      const hash = await gitHeadHash()

      // Then
      expect(hash).toEqual('ABCDEFGH')
    })
  })

  describe('generateHistoryThemeName', () => {
    test('generates theme name with correct format', async () => {
      // Given
      vi.mocked(findPathUp).mockResolvedValue('path')
      vi.mocked(getLatestGitCommit).mockResolvedValue({
        hash: 'ABCDEFGH12345678',
        date: '',
        message: '',
        refs: '',
        body: '',
        author_name: '',
        author_email: '',
      })

      // When
      const testDate = new Date('2025-01-15T10:30:45.123Z')
      const name = await generateHistoryThemeName(testDate)

      // Then
      expect(name).toMatch(/^\[ABCDEFGH\] 15-01-2025-\d+$/)
      expect(name).toContain('[ABCDEFGH]')
      expect(name).toContain('15-01-2025')
    })
  })

  describe('parseHistoryThemeName', () => {
    test('extracts timestamp from valid theme name', () => {
      // Given
      const themeName = '[a1b2c3d4] 15-01-2025-1736936245'

      // When
      const timestamp = parseHistoryThemeName(themeName)

      // Then
      expect(timestamp).toEqual(1736936245)
    })

    test('returns null for invalid theme name', () => {
      // Given
      const themeName = 'invalid-theme-name'

      // When
      const timestamp = parseHistoryThemeName(themeName)

      // Then
      expect(timestamp).toBeNull()
    })

    test('returns null for theme name with invalid timestamp', () => {
      // Given
      const themeName = '[a1b2c3d4] 15-01-2025-invalid'

      // When
      const timestamp = parseHistoryThemeName(themeName)

      // Then
      expect(timestamp).toBeNull()
    })
  })

  describe('isHistoryTheme', () => {
    test('returns true for valid history theme name', () => {
      // Given
      const themeName = '[a1b2c3d4] 15-01-2025-1736936245'

      // When
      const result = isHistoryTheme(themeName)

      // Then
      expect(result).toBe(true)
    })

    test('returns false for invalid theme name', () => {
      // Given
      const themeName = 'regular-theme-name'

      // When
      const result = isHistoryTheme(themeName)

      // Then
      expect(result).toBe(false)
    })

    test('returns false for blue-green theme name', () => {
      // Given
      const themeName = '[a1b2c3d4] Production - Blue'

      // When
      const result = isHistoryTheme(themeName)

      // Then
      expect(result).toBe(false)
    })
  })

  describe('formatDateDDMMYYYY', () => {
    test('formats date correctly', () => {
      // Given
      const date = new Date('2025-01-15T10:30:45.123Z')

      // When
      const formatted = formatDateDDMMYYYY(date)

      // Then
      expect(formatted).toEqual('15-01-2025')
    })

    test('pads single digit day and month', () => {
      // Given
      const date = new Date('2025-03-05T10:30:45.123Z')

      // When
      const formatted = formatDateDDMMYYYY(date)

      // Then
      expect(formatted).toEqual('05-03-2025')
    })
  })

  describe('getCurrentUTCTimestamp', () => {
    test('returns timestamp in seconds for given date', () => {
      // Given
      const testDate = new Date('2025-01-15T10:30:45.123Z')

      // When
      const timestamp = getCurrentUTCTimestamp(testDate)

      // Then
      expect(timestamp).toEqual(1736937045)
    })

    test('returns current timestamp when no date provided', () => {
      // Given
      const beforeCall = Math.floor(Date.now() / 1000)

      // When
      const timestamp = getCurrentUTCTimestamp()

      // Then
      const afterCall = Math.floor(Date.now() / 1000)
      expect(timestamp).toBeGreaterThanOrEqual(beforeCall)
      expect(timestamp).toBeLessThanOrEqual(afterCall)
    })
  })

  describe('getHistoryThemes', () => {
    test('filters themes by history naming convention', async () => {
      // Given
      const historyTheme1 = { id: 2, role: 'unpublished', name: '[a1b2c3d4] 15-01-2025-1736936245' } as Theme
      const historyTheme2 = { id: 3, role: 'unpublished', name: '[e5f6a7b8] 14-01-2025-1736849845' } as Theme
      const allThemes = [
        theme(1, 'main'),
        historyTheme1,
        historyTheme2,
        { id: 4, role: 'unpublished', name: 'regular-theme' } as Theme,
      ]
      // Mock findThemes to return the themes when called with empty filter
      vi.mocked(findThemes).mockImplementation(async (_store, _token, filter) => {
        if (JSON.stringify(filter) === '{}') {
          return allThemes
        }
        return []
      })

      // When
      const historyThemes = await getHistoryThemes(adminSession)

      // Then
      expect(historyThemes).toHaveLength(2)
      expect(historyThemes).toContain(historyTheme1)
      expect(historyThemes).toContain(historyTheme2)
    })
  })

  describe('sortHistoryThemesByAge', () => {
    test('sorts themes by timestamp oldest first', () => {
      // Given - corrected timestamps to ensure proper ordering
      const themes = [
        { id: 2, role: 'unpublished', name: '[a1b2c3d4] 15-01-2025-1736936245' } as Theme, // middle
        { id: 4, role: 'unpublished', name: '[a9b0c1d2] 16-01-2025-1737022645' } as Theme, // newest
        { id: 3, role: 'unpublished', name: '[e5f6a7b8] 14-01-2025-1736849845' } as Theme, // oldest
      ]

      // When
      const sorted = sortHistoryThemesByAge(themes)

      // Then
      expect(sorted[0]!.name).toEqual('[e5f6a7b8] 14-01-2025-1736849845') // oldest (1736849845)
      expect(sorted[1]!.name).toEqual('[a1b2c3d4] 15-01-2025-1736936245') // middle (1736936245)
      expect(sorted[2]!.name).toEqual('[a9b0c1d2] 16-01-2025-1737022645') // newest (1737022645)
    })

    test('handles themes with invalid timestamps', () => {
      // Given
      const themes = [
        { id: 2, role: 'unpublished', name: '[a1b2c3d4] 15-01-2025-1736936245' } as Theme,
        { id: 3, role: 'unpublished', name: 'invalid-theme-name' } as Theme,
      ]

      // When
      const sorted = sortHistoryThemesByAge(themes)

      // Then
      expect(sorted[0]!.name).toEqual('[a1b2c3d4] 15-01-2025-1736936245')
      expect(sorted[1]!.name).toEqual('invalid-theme-name') // invalid themes go to end
    })
  })

  describe('deleteHistoryTheme', () => {
    test('successfully deletes theme', async () => {
      // Given
      const themeId = 123
      vi.mocked(themeDelete).mockResolvedValue(undefined as any)

      // When
      const result = await deleteHistoryTheme(themeId, adminSession)

      // Then
      expect(result).toBe(true)
      expect(themeDelete).toHaveBeenCalledTimes(1)
      expect(themeDelete).toHaveBeenCalledWith(themeId, adminSession)
    })

    test('returns false on failure', async () => {
      // Given
      const themeId = 123
      vi.mocked(themeDelete).mockRejectedValue(new Error('Network error'))

      // When
      const result = await deleteHistoryTheme(themeId, adminSession)

      // Then
      expect(result).toBe(false)
      expect(themeDelete).toHaveBeenCalledTimes(1)
      expect(renderText).toHaveBeenCalledWith({
        text: expect.stringContaining('Failed to delete theme 123')
      })
    })
  })

  describe('cleanupExcessHistoryThemes', () => {
    test('deletes excess themes when over retention limit', async () => {
      // Given
      const historyThemes = [
        { id: 1, role: 'unpublished', name: '[a1b2c3d4] 13-01-2025-1736763245' } as Theme,
        { id: 2, role: 'unpublished', name: '[e5f6a7b8] 14-01-2025-1736849645' } as Theme,
        { id: 3, role: 'unpublished', name: '[a9b0c1d2] 15-01-2025-1736936045' } as Theme,
      ]

      // Mock findThemes to return themes when called with empty filter (for getHistoryThemes)
      vi.mocked(findThemes).mockImplementation(async (store, token, filter) => {
        if (JSON.stringify(filter) === '{}') {
          return historyThemes
        }
        return []
      })
      vi.mocked(themeDelete).mockResolvedValue(undefined as any)

      // When
      await cleanupExcessHistoryThemes(adminSession, 2)

      // Then
      expect(themeDelete).toHaveBeenCalledTimes(1)
      expect(themeDelete).toHaveBeenCalledWith(1, adminSession) // oldest theme
      expect(renderText).toHaveBeenCalledWith({
        text: 'Cleaning up 1 excess history themes...'
      })
      expect(renderText).toHaveBeenCalledWith({
        text: 'Cleanup complete: 1 themes deleted successfully, 0 failures'
      })
    })

    test('does nothing when under retention limit', async () => {
      // Given
      const historyThemes = [
        { id: 1, role: 'unpublished', name: '[a1b2c3d4] 15-01-2025-1736936245' } as Theme,
      ]
      vi.mocked(findThemes).mockResolvedValue(historyThemes)

      // When
      await cleanupExcessHistoryThemes(adminSession, 5)

      // Then
      expect(themeDelete).not.toHaveBeenCalled()
    })
  })

  describe('historyDeploy', () => {
    test('deploys new theme with history naming convention', async () => {
      // Given
      const flags: DeployFlags = {
        verbose: false,
        noColor: false,
        password: 'password',
        store: 'test-store',
        publish: false,
        strategy: HISTORY_STRATEGY,
        themeCount: 5,
      }

      vi.mocked(ensureThemeStore).mockReturnValue('test-store')
      vi.mocked(ensureAuthenticatedThemes).mockResolvedValue(adminSession)
      vi.mocked(findPathUp).mockResolvedValue('path')
      vi.mocked(getLatestGitCommit).mockResolvedValue({
        hash: 'ABCDEFGH12345678',
        date: '',
        message: '',
        refs: '',
        body: '',
        author_name: '',
        author_email: '',
      })
      vi.mocked(findThemes).mockResolvedValue([])
      vi.mocked(push).mockResolvedValue()

      // When
      await historyDeploy(flags)

      // Then
      expect(pullLiveThemeSettings).toHaveBeenCalledWith(flags)
      expect(push).toHaveBeenCalledWith(expect.objectContaining({
        ...flags,
        unpublished: true,
        theme: expect.stringMatching(/^\[ABCDEFGH\] \d{2}-\d{2}-\d{4}-\d+$/)
      }))
      expect(renderText).toHaveBeenCalledWith({
        text: expect.stringContaining('Creating new history theme: [ABCDEFGH]')
      })
    })

    test('publishes theme when publish flag is set', async () => {
      // Given
      const flags: DeployFlags = {
        verbose: false,
        noColor: false,
        password: 'password',
        store: 'test-store',
        publish: true,
        strategy: HISTORY_STRATEGY,
        themeCount: 5,
      }

      vi.mocked(ensureThemeStore).mockReturnValue('test-store')
      vi.mocked(ensureAuthenticatedThemes).mockResolvedValue(adminSession)
      vi.mocked(findPathUp).mockResolvedValue('path')
      vi.mocked(getLatestGitCommit).mockResolvedValue({
        hash: 'ABCDEFGH12345678',
        date: '',
        message: '',
        refs: '',
        body: '',
        author_name: '',
        author_email: '',
      })

      // Mock findThemes to handle both cleanup and publishing calls
      // We'll create a theme that matches the expected pattern dynamically
      let mockTheme: Theme | null = null
      let callCount = 0
      vi.mocked(findThemes).mockImplementation(async (store, token, filter) => {
        callCount++
        if (callCount === 1) {
          // First call for publishing - create a theme with the expected git SHA
          // The actual theme name will be generated by the real function
          if (!mockTheme) {
            mockTheme = {
              id: 123,
              role: 'unpublished',
              name: '[ABCDEFGH] test-theme-name' // This will be updated in the next line
            } as Theme
            // Update the name to match what would be generated (we'll check the pattern in the assertion)
            mockTheme.name = `[ABCDEFGH] ${formatDateDDMMYYYY(new Date())}-${Math.floor(Date.now() / 1000)}`
          }
          return [mockTheme]
        } else {
          // Second call for cleanup (getHistoryThemes) - return empty
          return []
        }
      })

      vi.mocked(push).mockResolvedValue()
      vi.mocked(themeUpdate).mockResolvedValue({} as any)

      // When
      await historyDeploy(flags)

      // Then
      expect(themeUpdate).toHaveBeenCalledWith(123, { role: 'main' }, adminSession)
      expect(renderText).toHaveBeenCalledWith({
        text: expect.stringContaining('Published theme:')
      })
    })
  })

  describe('getThemeRetentionLimit', () => {
    test('returns flag value when provided', () => {
      // When
      const limit = getThemeRetentionLimit(15)

      // Then
      expect(limit).toEqual(15)
    })

    test('returns default when no value provided', () => {
      // When
      const limit = getThemeRetentionLimit()

      // Then
      expect(limit).toEqual(10)
    })

    test('returns default when invalid value provided', () => {
      // When
      const limit = getThemeRetentionLimit(0)

      // Then
      expect(limit).toEqual(10)
    })
  })

  describe('deploy with history strategy', () => {
    test('calls historyDeploy when strategy is history', async () => {
      // Given
      const flags: DeployFlags = {
        verbose: false,
        noColor: false,
        password: 'password',
        store: 'test-store',
        publish: false,
        strategy: HISTORY_STRATEGY,
        themeCount: 5,
      }

      vi.mocked(ensureThemeStore).mockReturnValue('test-store')
      vi.mocked(ensureAuthenticatedThemes).mockResolvedValue(adminSession)
      vi.mocked(findPathUp).mockResolvedValue('path')
      vi.mocked(getLatestGitCommit).mockResolvedValue({
        hash: 'ABCDEFGH12345678',
        date: '',
        message: '',
        refs: '',
        body: '',
        author_name: '',
        author_email: '',
      })
      vi.mocked(findThemes).mockResolvedValue([])
      vi.mocked(push).mockResolvedValue()

      // When
      await deploy(flags)

      // Then
      expect(pullLiveThemeSettings).toHaveBeenCalledWith(flags)
    })
  })
})
