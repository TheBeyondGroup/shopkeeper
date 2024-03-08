import { inTemporaryDirectory } from '@shopify/cli-kit/node/fs'
import { joinPath } from '@shopify/cli-kit/node/path'
import { describe, expect, test, vi } from 'vitest'
import { expectFileNotToExist, expectFileToExist } from '../../utilities/test-helpers.js'
import { createBuckets } from '../../utilities/bucket.js'
import { deleteBucket } from './delete.js'
import { renderConfirmationPrompt, renderInfo, renderSuccess } from '@shopify/cli-kit/node/ui'

vi.mock('@shopify/cli-kit/node/ui')

describe('delete', () => {
  describe('when forced', () => {
    test('deletes bucket without confirmation', async () => {
      await inTemporaryDirectory(async (tmpDir: string) => {
        // Given
        const bucketName = 'production'
        const shopkeeperRoot = joinPath(tmpDir, '.shopkeeper')
        const expectedBucketPath = joinPath(shopkeeperRoot, bucketName)
        await createBuckets(shopkeeperRoot, [bucketName])

        // When
        await deleteBucket([bucketName], true, shopkeeperRoot)


        // Then
        expectFileNotToExist(expectedBucketPath)
        expect(renderSuccess).toHaveBeenCalledWith({ body: ['production was deleted.'] })
      })
    })
    test('deletes buckets without confirmation', async () => {
      await inTemporaryDirectory(async (tmpDir: string) => {
        // Given
        const buckets = ['production', 'staging']
        const shopkeeperRoot = joinPath(tmpDir, '.shopkeeper')
        const expectProductionBucketPath = joinPath(shopkeeperRoot, 'production')
        const expectStagingBucketPath = joinPath(shopkeeperRoot, 'staging')
        await createBuckets(shopkeeperRoot, buckets)

        // When
        await deleteBucket(buckets, true, shopkeeperRoot)


        // Then
        expectFileNotToExist(expectProductionBucketPath)
        expectFileNotToExist(expectStagingBucketPath)
        expect(renderSuccess).toHaveBeenCalledWith({
          body: ['The following buckets were deleted:', { list: { items: buckets } }]
        })
      })
    })
  })
  describe('when asked for confirmation', () => {
    test('deletes bucket after receiving confirmation', async () => {
      await inTemporaryDirectory(async (tmpDir: string) => {
        // Given
        const bucketName = 'production'
        const shopkeeperRoot = joinPath(tmpDir, '.shopkeeper')
        const expectedBucketPath = joinPath(shopkeeperRoot, bucketName)
        await createBuckets(shopkeeperRoot, [bucketName])
        vi.mocked(renderConfirmationPrompt).mockResolvedValue(true)

        // When
        await deleteBucket([bucketName], false, shopkeeperRoot)


        // Then
        expectFileNotToExist(expectedBucketPath)
        expect(renderSuccess).toHaveBeenCalledWith({ body: ['production was deleted.'] })
      })
    })
    test('deletes buckets after receiving confirmation', async () => {
      await inTemporaryDirectory(async (tmpDir: string) => {
        // Given
        const buckets = ['production', 'staging']
        const shopkeeperRoot = joinPath(tmpDir, '.shopkeeper')
        const expectProductionBucketPath = joinPath(shopkeeperRoot, 'production')
        const expectStagingBucketPath = joinPath(shopkeeperRoot, 'staging')
        await createBuckets(shopkeeperRoot, buckets)
        vi.mocked(renderConfirmationPrompt).mockResolvedValue(true)

        // When
        await deleteBucket(buckets, false, shopkeeperRoot)


        // Then
        expectFileNotToExist(expectProductionBucketPath)
        expectFileNotToExist(expectStagingBucketPath)
        expect(renderSuccess).toHaveBeenCalledWith({
          body: ['The following buckets were deleted:', { list: { items: buckets } }]
        })
      })
    })
    test('does not delete files after being denied confirmation', async () => {
      await inTemporaryDirectory(async (tmpDir: string) => {
        // Given
        const bucketName = 'production'
        const shopkeeperRoot = joinPath(tmpDir, '.shopkeeper')
        const expectedBucketPath = joinPath(shopkeeperRoot, bucketName)
        await createBuckets(shopkeeperRoot, [bucketName])
        vi.mocked(renderConfirmationPrompt).mockResolvedValue(false)

        // When
        await deleteBucket([bucketName], false, shopkeeperRoot)


        // Then
        expectFileToExist(expectedBucketPath)
        expect(renderInfo).toHaveBeenCalledWith({ body: 'Delete skipped' })
      })

    })
  })
})
