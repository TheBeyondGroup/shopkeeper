import { inTemporaryDirectory } from '@shopify/cli-kit/node/fs'
import { joinPath } from '@shopify/cli-kit/node/path'
import { describe, expect, test, vi } from 'vitest'
import { createBuckets } from '../../utilities/bucket.js'
import { list } from './list.js'
import { renderTable } from '@shopify/cli-kit/node/ui'

vi.mock('@shopify/cli-kit/node/ui')

describe('list', () => {
  test('renders a table of buckets', async () => {
    await inTemporaryDirectory(async (tmpDir: string) => {
      // Given
      const bucketName = 'production'
      const shopkeeperRoot = joinPath(tmpDir, '.shopkeeper')
      await createBuckets(shopkeeperRoot, [bucketName])

      // When
      await list(shopkeeperRoot)

      // Then
      expect(renderTable).toHaveBeenCalledWith({
        rows: [{ bucket: 'production' }],
        columns: { bucket: { header: "bucket" } }
      })
    })
  })
})
