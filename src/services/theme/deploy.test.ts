import { beforeEach, describe, expect, test, vi } from 'vitest'
import { basicDeploy, blueGreenDeploy, deploy, getLiveTheme, getOnDeckThemeId, gitHeadHash } from './deploy.js'
import { findPathUp } from "@shopify/cli-kit/node/fs";
import { getLatestGitCommit } from "@shopify/cli-kit/node/git";
import { BLUE_GREEN_STRATEGY } from '../../utilities/constants.js';
import { findThemes } from "@shopify/theme/dist/cli/utilities/theme-selector.js";
import { Theme } from '@shopify/cli-kit/node/themes/types';
import { renderText } from '@shopify/cli-kit/node/ui'
import { updateTheme } from "@shopify/cli-kit/node/themes/api";
import { pullLiveThemeSettings, push, pushToLive } from "../../utilities/theme.js";

vi.mock("@shopify/cli-kit/node/fs")
vi.mock("@shopify/cli-kit/node/git")
vi.mock('@shopify/cli-kit/node/ui')
vi.mock('@shopify/cli-kit/node/themes/api')
vi.mock('@shopify/theme/dist/cli/utilities/theme-selector.js')
vi.mock('../../utilities/theme.js')

describe('deploy', () => {
  const adminSession = { token: 'ABC', storeFqdn: 'example.myshopify.com' }
  const path = '/my-theme'

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
        vi.mocked(findThemes).mockResolvedValue([liveTheme])
        vi.mocked(updateTheme).mockResolvedValue(themes[1])
        vi.mocked(findPathUp).mockResolvedValue("path")
        vi.mocked(getLatestGitCommit).mockResolvedValue({
          hash: "BABCD1234AB",
          date: '',
          message: "",
          refs: '',
          body: '',
          author_name: '',
          author_email: ''
        })

        // When
        await deploy(adminSession, path, true, [], BLUE_GREEN_STRATEGY, blue, green)

        // Then
        expect(renderText).toHaveBeenCalledTimes(2)
        expect(renderText).toHaveBeenCalledWith({ text: "Pulling theme settings" })
        expect(pullLiveThemeSettings).toBeCalledWith(adminSession, path, [])
        expect(push).toBeCalledWith(adminSession, path, true, [], green)
        expect(renderText).toHaveBeenCalledWith({ text: "Green renamed to [BABCD123] Production - Green" })
      })
    })

    describe('when no strategy is passsed', () => {
      test('makes basic deploy', async () => {
        // Given
        const liveTheme = theme(1, 'main')
        vi.mocked(findThemes).mockResolvedValue([liveTheme])
        vi.mocked(updateTheme).mockResolvedValue(liveTheme)
        vi.mocked(findPathUp).mockResolvedValue("path")
        vi.mocked(getLatestGitCommit).mockResolvedValue({
          hash: "AABCD1234AB",
          date: '',
          message: "",
          refs: '',
          body: '',
          author_name: '',
          author_email: ''
        })

        // When
        await deploy(adminSession, path, true, [], 'ANYTHING', 0, 0)

        // Then
        expect(renderText).toHaveBeenCalledTimes(2)
        expect(renderText).toHaveBeenCalledWith({ text: "Pulling theme settings" })
        expect(pullLiveThemeSettings).toBeCalledWith(adminSession, path, [])
        expect(pushToLive).toBeCalledWith(adminSession, path, [])
        expect(renderText).toHaveBeenCalledWith({ text: "Live theme renamed to [AABCD123] Production" })
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
      vi.mocked(findThemes).mockResolvedValue([liveTheme])
      vi.mocked(updateTheme).mockResolvedValue(themes[1])
      vi.mocked(findPathUp).mockResolvedValue("path")
      vi.mocked(getLatestGitCommit).mockResolvedValue({
        hash: "BABCD1234AB",
        date: '',
        message: "",
        refs: '',
        body: '',
        author_name: '',
        author_email: ''
      })

      // When
      await blueGreenDeploy(adminSession, path, true, [], blue, green)

      // Then
      expect(renderText).toHaveBeenCalledTimes(2)
      expect(renderText).toHaveBeenCalledWith({ text: "Pulling theme settings" })
      expect(pullLiveThemeSettings).toBeCalledWith(adminSession, path, [])
      expect(push).toBeCalledWith(adminSession, path, true, [], green)
      expect(renderText).toHaveBeenCalledWith({ text: "Green renamed to [BABCD123] Production - Green" })
    })
  })

  describe('basicDeploy', () => {
    test('pulls live theme settings and updates theme', async () => {
      // Given
      const ondeckThemeId = 1
      const publishedThemeId = 2
      const themes = [theme(ondeckThemeId, 'unpublished'), theme(publishedThemeId, 'main')]
      vi.mocked(findThemes).mockResolvedValue(themes)
      vi.mocked(updateTheme).mockResolvedValue(themes[0])
      vi.mocked(findPathUp).mockResolvedValue("path")
      vi.mocked(getLatestGitCommit).mockResolvedValue({
        hash: "AABCD1234AB",
        date: '',
        message: "",
        refs: '',
        body: '',
        author_name: '',
        author_email: ''
      })

      // When
      await basicDeploy(adminSession, path, [])

      // Then
      expect(renderText).toHaveBeenCalledTimes(2)
      expect(renderText).toHaveBeenCalledWith({ text: "Pulling theme settings" })
      expect(pullLiveThemeSettings).toBeCalledWith(adminSession, path, [])
      expect(pushToLive).toBeCalledWith(adminSession, path, [])
      expect(renderText).toHaveBeenCalledWith({ text: "Live theme renamed to [AABCD123] Production" })
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
        const errorFunc = async () => { await getLiveTheme(adminSession) }

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
          id: blueTheme, name: "Blue"
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
          id: greenTheme, name: "Green"
        })

      })
    })
  })

  describe('gitHeadHash', () => {
    test('returns the first 8 chars', async () => {
      // Given
      vi.mocked(findPathUp).mockResolvedValue("path")
      vi.mocked(getLatestGitCommit).mockResolvedValue({
        hash: "ABCDEFGHIJKLMNOP",
        date: '',
        message: "",
        refs: '',
        body: '',
        author_name: '',
        author_email: ''
      })

      // When
      const hash = await gitHeadHash()

      // Then
      expect(hash).toEqual("ABCDEFGH")
    })
  })
})
