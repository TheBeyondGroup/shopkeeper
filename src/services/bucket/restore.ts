import { removeFile } from '@shopify/cli-kit/node/fs'
import {
  copyFiles,
  ensureBucketExists,
  FileMove,
  getBucketPath,
  getBucketSettingsFilePaths,
  getShopkeeperPath,
  getThemeSettingsFilePaths,
} from '../../utilities/bucket.js'
import { joinPath } from '@shopify/cli-kit/node/path'

export async function restore(bucket: string, path: string, skipFileRemoval: boolean, rootPath?: string): Promise<FileMove[]> {
  const shopkeeperRoot = rootPath || await getShopkeeperPath()
  const bucketRoot = await getBucketPath(shopkeeperRoot, bucket)
  await ensureBucketExists(shopkeeperRoot, bucket)

  if (!skipFileRemoval) {
    const themeSettingsPaths = await getThemeSettingsFilePaths(path)
    await Promise.all(
      themeSettingsPaths.map(async (file) => {
        return removeFile(joinPath(path, file))
      }),
    )
  }

  const settingsFromBucket = await getBucketSettingsFilePaths(shopkeeperRoot, bucket)
  const fileMoves = settingsFromBucket.map((settingPath) => {
    return {
      file: settingPath,
      source: joinPath(bucketRoot, settingPath),
      dest: joinPath(path, settingPath),
    }
  })
  await copyFiles(fileMoves)
  return fileMoves
}
