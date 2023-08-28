import { renderTable } from "@shopify/cli-kit/node/ui"
import { getBuckets } from "../../utilities/bucket.js"

export async function list() {
  const buckets = await getBuckets()

  renderTable({
    rows: buckets.map(bucket => ({ bucket })),
    columns: { bucket: { header: "bucket" } }
  })
}
