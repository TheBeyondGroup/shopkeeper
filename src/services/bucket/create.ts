import { mkdir, findPathUp, touchFile } from "@shopify/cli-kit/node/fs"

export async function create(buckets: string[]) {
  const bucketRoot = await findPathUp("./.shopkeeper", { type: "directory" })

  buckets.forEach(async bucket => {
    const bucketPath = `${bucketRoot}/${bucket}`
    await mkdir(bucketPath)
    await touchFile(`${bucketPath}/.env`)
    await touchFile(`${bucketPath}/.env.sample`)
    await mkdir(`${bucketPath}/config`)
    await mkdir(`${bucketPath}/templates`)
    await mkdir(`${bucketPath}/sections`)
  })
}

