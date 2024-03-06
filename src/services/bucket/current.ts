import { renderInfo } from '@shopify/cli-kit/node/ui'
import { getCurrentBucket, getShopkeeperPath } from '../../utilities/bucket.js'

export async function current(rootPath: string | null = null) {
  const shopkeeperRoot = rootPath || await getShopkeeperPath()
  const currentBucket = await getCurrentBucket(shopkeeperRoot)

  renderInfo({
    headline: 'Current bucket',
    body: `${currentBucket} is selected`,
  })
}
