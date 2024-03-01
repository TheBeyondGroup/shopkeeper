import {joinPath} from '@shopify/cli-kit/node/path'
import {emptyDir} from 'fs-extra/esm'
import {
  copyFiles,
  ensureBucketExists,
  FileMove,
  getBucketPath,
  getSettingsFolders,
  getThemeSettingsFilePaths,
} from '../../utilities/bucket.js'

export async function save(bucket: string, path: string, skipEmptyDirectory: boolean): Promise<FileMove[]> {
  const settingsFromTheme = await getThemeSettingsFilePaths(path)
  const bucketRoot = await getBucketPath(bucket)

  await ensureBucketExists(bucket, bucketRoot)

  if (!skipEmptyDirectory) {
    await Promise.all(
      getSettingsFolders().map(async (folder) => {
        const filePath = joinPath(bucketRoot, folder)
        return emptyDir(filePath)
      }),
    )
  }

  const fileMoves = settingsFromTheme.map((settingPath) => {
    return {
      file: settingPath,
      source: joinPath(path, settingPath),
      dest: joinPath(bucketRoot, settingPath),
    }
  })
  copyFiles(fileMoves)
  return fileMoves
}
