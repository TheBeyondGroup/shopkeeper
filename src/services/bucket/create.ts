import { pluralize } from "@shopify/cli-kit/common/string"
import { mkdir, touchFile } from "@shopify/cli-kit/node/fs"
import { renderSuccess } from "@shopify/cli-kit/node/ui"
import { getBucketPath } from "../../utilities/bucket.js"
import { SHOPKEEPER_DIRECTORY } from "../../utilities/constants.js"

export async function create(buckets: string[]) {

  buckets.forEach(async bucket => {
    const bucketPath = await getBucketPath(bucket)
    await mkdir(bucketPath)
    await touchFile(`${bucketPath}/.env`)
    await touchFile(`${bucketPath}/.env.sample`)
    await mkdir(`${bucketPath}/config`)
    await mkdir(`${bucketPath}/templates`)
    await mkdir(`${bucketPath}/sections`)
  })

  renderSuccess({
    body: pluralize(
      buckets,
      (buckets) => ['The following buckets were added:', { list: { items: buckets } }],
      (bucket) => [`${bucket} was created.`]
    )
  })
}
