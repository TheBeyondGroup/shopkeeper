import {fileExistsSync, readFile, renameFile} from '@shopify/cli-kit/node/fs'
import {renderInfo} from '@shopify/cli-kit/node/ui'
import {getShopkeeperPath} from '../../utilities/bucket.js'
import {CURRENT_BUCKET_FILE, LEGACY_CURRENT_BUCKET_FILE} from '../../utilities/constants.js'
import {joinPath} from '@shopify/cli-kit/node/path'

export async function current() {
  const shopkeeperRoot = await getShopkeeperPath()

  let currentBucket: string
  const legacyBucketPath = joinPath(shopkeeperRoot, LEGACY_CURRENT_BUCKET_FILE)
  const currentBucketPath = joinPath(shopkeeperRoot, CURRENT_BUCKET_FILE)
  if (fileExistsSync(legacyBucketPath)) {
    currentBucket = await readFile(legacyBucketPath)
    await renameFile(legacyBucketPath, currentBucketPath)
  } else {
    currentBucket = await readFile(currentBucketPath)
  }

  renderInfo({
    headline: 'Current bucket',
    body: `${currentBucket.trim()} is selected`,
  })
}
