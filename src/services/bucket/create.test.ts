import { inTemporaryDirectory } from '@shopify/cli-kit/node/fs'
import { describe, expect, test, vi } from 'vitest'
import { create } from './create.js'
import { expectFileToExist } from '../../utilities/test-helpers.js'
import { joinPath } from '@shopify/cli-kit/node/path'
import { renderSuccess } from '@shopify/cli-kit/node/ui'

vi.mock('@shopify/cli-kit/node/ui')

describe('create', () => {
  test('creates bucket and shows message', async () => {
    await inTemporaryDirectory(async (tmpDir: string) => {
      // Given
      const bucketName = 'production'
      const shopkeeperRoot = joinPath(tmpDir, '.shopkeeper')
      const expectedBucketPath = joinPath(shopkeeperRoot, bucketName)

      // When
      await create([bucketName], shopkeeperRoot)

      // Then
      expectFileToExist(expectedBucketPath)
      expect(renderSuccess).toHaveBeenCalledWith({
        body: ['production was created.']
      })
    })
  })

  test('creates mulitple buckets and shows message', async () => {
    await inTemporaryDirectory(async (tmpDir: string) => {
      // Given
      const buckets = ['production', 'staging']
      const shopkeeperRoot = joinPath(tmpDir, '.shopkeeper')
      const expectProductionBucketPath = joinPath(shopkeeperRoot, 'production')
      const expectStagingBucketPath = joinPath(shopkeeperRoot, 'staging')

      // When
      await create(buckets, shopkeeperRoot)

      // Then
      expectFileToExist(expectProductionBucketPath)
      expectFileToExist(expectStagingBucketPath)
      expect(renderSuccess).toHaveBeenCalledWith({
        body: ['The following buckets were added:', { list: { items: buckets } }]
      })
    })
  })
})
