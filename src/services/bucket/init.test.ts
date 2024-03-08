import { inTemporaryDirectory, readFile, writeFile } from '@shopify/cli-kit/node/fs'
import { joinPath } from '@shopify/cli-kit/node/path'
import { describe, expect, test, vi } from 'vitest'
import { DEFAULT_GITIGNORE_FILE, init } from './init.js'
import { expectFileToExist, expectFileToHaveContent } from '../../utilities/test-helpers.js'
import { renderSuccess } from '@shopify/cli-kit/node/ui'

vi.mock('@shopify/cli-kit/node/ui')

describe('init', () => {
  describe('init', () => {
    describe('when .gitignore exists', () => {
      test('creates buckets and updates .gitignore', async () => {
        await inTemporaryDirectory(async (tmpDir: string) => {
          // Given
          const bucketName = 'production'
          const shopkeeperRoot = joinPath(tmpDir, '.shopkeeper')
          const gitignorePath = joinPath(tmpDir, '.gitignore')
          await writeFile(gitignorePath, '# Content #')

          // When
          await init([bucketName], tmpDir)

          // Then
          expectFileToExist(shopkeeperRoot)
          expectFileToHaveContent(gitignorePath, DEFAULT_GITIGNORE_FILE)
          expect(renderSuccess).toHaveBeenCalledWith({
            headline: 'Shopkeeper initialized',
            body: {
              list: {
                items: ['.shopkeeper directory created', '.gitignore updated']
              },
            },
            customSections: [
              {
                title: 'Buckets created:',
                body: {
                  list: {
                    items: ['production'],
                  },
                },
              },
            ]
          })
        })
      })
    })

    describe('when .gitignore does not exist', () => {
      test('creates buckets and creates .gitignore', async () => {
        await inTemporaryDirectory(async (tmpDir: string) => {
          // Given
          const bucketName = 'production'
          const shopkeeperRoot = joinPath(tmpDir, '.shopkeeper')
          const gitignorePath = joinPath(tmpDir, '.gitignore')

          // When
          await init([bucketName], tmpDir)

          // Then
          expectFileToExist(shopkeeperRoot)
          expectFileToHaveContent(gitignorePath, DEFAULT_GITIGNORE_FILE)
          expect(renderSuccess).toHaveBeenCalledWith({
            headline: 'Shopkeeper initialized',
            body: {
              list: {
                items: ['.shopkeeper directory created', '.gitignore updated']
              },
            },
            customSections: [
              {
                title: 'Buckets created:',
                body: {
                  list: {
                    items: ['production'],
                  },
                },
              },
            ]
          })
        })
      })
    })
  })
})
