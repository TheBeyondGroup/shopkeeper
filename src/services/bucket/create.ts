import { pluralize } from "@shopify/cli-kit/common/string"
import { renderSuccess } from "@shopify/cli-kit/node/ui"
import { createBuckets, getShopkeeperPath } from "../../utilities/bucket.js"

export async function create(buckets: string[], rootPath?: string) {
  const shopkeeperRoot = rootPath || await getShopkeeperPath()
  await createBuckets(shopkeeperRoot, buckets)

  renderSuccess({
    body: pluralize(
      buckets,
      (buckets) => ['The following buckets were added:', { list: { items: buckets } }],
      (bucket) => [`${bucket} was created.`]
    )
  })
}

