import { mkdir, touchFile } from "@shopify/cli-kit/node/fs"
import { getBucketPath } from "../../utilities/bucket.js"

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
}
