import { findPathUp, fileExistsSync, readFile } from "@shopify/cli-kit/node/fs";
import {
  currentBucketFile,
  legacyCurrentBucketFile,
  shopkeeperDirectory,
} from "../../utilities/index.js";
import { renderInfo } from "@shopify/cli-kit/node/ui";
import { renameSync } from "fs";
import { AbortError } from "@shopify/cli-kit/node/error";

export async function current() {
  const bucketRoot = await findPathUp(`./${shopkeeperDirectory}`, {
    type: "directory",
  });

  if (bucketRoot === undefined) {
    throw new AbortError("Cannot find .shopkeeper directory.");
  }

  let currentBucket: string;
  const legacyBucketPath = `${bucketRoot}/${legacyCurrentBucketFile}`;
  const currentBucketPath = `${bucketRoot}/${currentBucketFile}`;
  if (fileExistsSync(legacyBucketPath)) {
    currentBucket = await readFile(legacyBucketPath);
    renameSync(legacyBucketPath, currentBucketPath);
  } else {
    currentBucket = await readFile(currentBucketPath);
  }

  renderInfo({
    headline: "Current bucket",
    body: `${currentBucket.trim()} is selected`,
  });
}
