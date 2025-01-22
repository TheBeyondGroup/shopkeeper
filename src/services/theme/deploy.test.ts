import {beforeEach, describe, expect, test, vi} from 'vitest'
import {
  basicDeploy,
  blueGreenDeploy,
  deploy,
  DeployFlags,
  getLiveTheme,
  getOnDeckThemeId,
  gitHeadHash,
} from './deploy.js'
import {findPathUp} from '@shopify/cli-kit/node/fs'
import {getLatestGitCommit} from '@shopify/cli-kit/node/git'
import {BLUE_GREEN_STRATEGY} from '../../utilities/constants.js'
import {Theme} from '@shopify/cli-kit/node/themes/types'
import {renderText} from '@shopify/cli-kit/node/ui'
import {themeUpdate} from '@shopify/cli-kit/node/themes/api'
import {deployToLive, deployTheme, pullLiveThemeSettings} from '../../utilities/theme.js'
import {findThemes} from '../../utilities/shopify/theme-selector.js'
import {ensureAuthenticatedThemes} from '@shopify/cli-kit/node/session'
import {getThemeStore} from '../../utilities/shopify/services/local-storage.js'

vi.mock('@shopify/cli-kit/node/fs')
vi.mock('@shopify/cli-kit/node/git')
vi.mock('@shopify/cli-kit/node/ui')
vi.mock('@shopify/cli-kit/node/themes/api')
vi.mock('@shopify/cli-kit/node/session')
vi.mock('../../utilities/shopify/theme-selector.js')
vi.mock('../../utilities/theme.js')
vi.mock('../../utilities/shopify/services/local-storage.js')

describe('deploy', () => {
  const adminSession = {token: 'ABC', storeFqdn: 'example.myshopify.com'}
  const path = '/my-theme'

  function theme(id: number, role: string) {
    return {id, role, name: `theme (${id})`} as Theme
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
        expect(renderText).toHaveBeenCalledWith({text: 'Pulling theme settings'})
        expect(pullLiveThemeSettings).toBeCalledWith(flags)
        expect(deployTheme).toBeCalledWith(green, flags)
        expect(renderText).toHaveBeenCalledWith({text: 'Green renamed to [BABCD123] Production - Green'})
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
        expect(renderText).toHaveBeenCalledWith({text: 'Pulling theme settings'})
        expect(pullLiveThemeSettings).toBeCalledWith(flags)
        expect(deployToLive).toBeCalledWith(flags)
        expect(renderText).toHaveBeenCalledWith({text: 'Live theme renamed to [AABCD123] Production'})
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
      expect(renderText).toHaveBeenCalledWith({text: 'Pulling theme settings'})
      expect(pullLiveThemeSettings).toBeCalledWith(flags)
      expect(deployTheme).toBeCalledWith(green, flags)
      expect(renderText).toHaveBeenCalledWith({text: 'Green renamed to [BABCD123] Production - Green'})
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
      expect(renderText).toHaveBeenCalledWith({text: 'Pulling theme settings'})
      expect(pullLiveThemeSettings).toBeCalledWith(flags)
      expect(deployToLive).toBeCalledWith(flags)
      expect(renderText).toHaveBeenCalledWith({text: 'Live theme renamed to [AABCD123] Production'})
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
        expect(errorFunc).rejects.toThrowError(/Something very bad has happened. The store doesn't have a live theme./)
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
})
