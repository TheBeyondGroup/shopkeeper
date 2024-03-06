import { renderTable } from "@shopify/cli-kit/node/ui"
import { getBuckets, getShopkeeperPath } from "../../utilities/bucket.js"

export async function list(rootPath?: string) {
  const shopkeeperRoot = rootPath || await getShopkeeperPath()
  const buckets = await getBuckets(shopkeeperRoot)

  renderTable({
    rows: buckets.map(bucket => ({ bucket })),
    columns: { bucket: { header: "bucket" } }
  })
}
