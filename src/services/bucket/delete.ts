import { pluralize } from '@shopify/cli-kit/common/string'
import { rmdir } from '@shopify/cli-kit/node/fs'
import { renderConfirmationPrompt, renderInfo, renderSuccess } from '@shopify/cli-kit/node/ui'
import { getBucketPath, getShopkeeperPath } from '../../utilities/bucket.js'

export async function deleteBucket(buckets: string[], force: Boolean, rootPath?: string) {
  const shopkeeperRoot = rootPath || await getShopkeeperPath()

  let didDelete = false
  if (force) {
    await Promise.all(
      buckets.map(async (bucket) => {
        const bucketPath = await getBucketPath(shopkeeperRoot, bucket)
        return await rmdir(bucketPath, { force: true })
      }),
    )
    didDelete = true
  } else {
    const shouldDelete = await renderConfirmationPrompt({ message: `Do you want to delete ${buckets.join(' ')}` })
    if (shouldDelete) {
      await Promise.all(
        buckets.map(async (bucket) => {
          const bucketPath = await getBucketPath(shopkeeperRoot, bucket)
          return await rmdir(bucketPath, { force: true })
        }),
      )
    }
    didDelete = shouldDelete
  }
  if (didDelete) {
    renderSuccess({
      body: pluralize(
        buckets,
        (buckets) => ['The following buckets were deleted:', { list: { items: buckets } }],
        (bucket) => [`${bucket} was deleted.`],
      ),
    })
  } else {
    renderInfo({ body: 'Delete skipped' })
  }
}
