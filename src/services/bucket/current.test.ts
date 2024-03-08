import { fileExists, inTemporaryDirectory, mkdir, writeFile } from '@shopify/cli-kit/node/fs'
import { joinPath } from '@shopify/cli-kit/node/path'
import { renderInfo } from '@shopify/cli-kit/node/ui'
import { describe, expect, test, vi } from 'vitest'
import { current } from './current.js'

vi.mock('@shopify/cli-kit/node/ui')

describe('current', () => {
  test('gets current bucket with 0.x current file', async () => {
    await inTemporaryDirectory(async (tmpDir: string) => {
      // Given
      const shopkeeperRoot = joinPath(tmpDir, '.shopkeeper')
      const legacyCurrentFile = joinPath(shopkeeperRoot, '.current-store')
      const newCurrentFile = joinPath(shopkeeperRoot, '.current-bucket')
      await mkdir(shopkeeperRoot)
      await writeFile(legacyCurrentFile, 'production \n')

      // When
      await current(shopkeeperRoot)

      // Then
      const newCurrentFileExist = await fileExists(newCurrentFile)
      expect(newCurrentFileExist).toBe(true)

      const legacyCurrentFileExists = await fileExists(legacyCurrentFile)
      expect(legacyCurrentFileExists).toBe(false)

      expect(renderInfo).toHaveBeenCalledWith({
        headline: 'Current bucket',
        body: 'production is selected',
      })
    })
  })

  test('gets current bucket with 1.x current file', async () => {
    await inTemporaryDirectory(async (tmpDir: string) => {
      // Given
      const shopkeeperRoot = joinPath(tmpDir, '.shopkeeper')
      const newCurrentFile = joinPath(shopkeeperRoot, '.current-bucket')
      await mkdir(shopkeeperRoot)
      await writeFile(newCurrentFile, 'production \n')

      // When
      await current(shopkeeperRoot)

      // Then
      const newCurrentFileExist = await fileExists(newCurrentFile)
      expect(newCurrentFileExist).toBe(true)

      expect(renderInfo).toHaveBeenCalledWith({
        headline: 'Current bucket',
        body: 'production is selected',
      })
    })
  })
})
