import { joinPath } from '@shopify/cli-kit/node/path'
import { emptyDir } from 'fs-extra/esm'
import {
  copyFiles,
  ensureBucketExists,
  FileMove,
  getBucketPath,
  getSettingsFolders,
  getShopkeeperPath,
  getThemeSettingsFilePaths,
} from '../../utilities/bucket.js'

export async function save(bucket: string, path: string, skipEmptyDirectory: boolean, rootPath?: string): Promise<FileMove[]> {
  const shopkeeperRoot = rootPath || await getShopkeeperPath()
  const bucketRoot = await getBucketPath(shopkeeperRoot, bucket)

  await ensureBucketExists(shopkeeperRoot, bucket)

  if (!skipEmptyDirectory) {
    await Promise.all(
      getSettingsFolders().map(async (folder) => {
        const filePath = joinPath(bucketRoot, folder)
        return emptyDir(filePath)
      }),
    )
  }

  const settingsFromTheme = await getThemeSettingsFilePaths(path)
  const fileMoves = settingsFromTheme.map((settingPath) => {
    return {
      file: settingPath,
      source: joinPath(path, settingPath),
      dest: joinPath(bucketRoot, settingPath),
    }
  })

  await copyFiles(fileMoves)
  return fileMoves
}
