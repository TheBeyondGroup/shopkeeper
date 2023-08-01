import { removeFile } from "@shopify/cli-kit/node/fs"
import { copyFiles, FileMove, getBucketPath, getBucketSettingsFilePaths, getThemeSettingsFilePaths } from "../../utilities/bucket.js"

export async function restore(bucket: string, path: string, skipFileRemoval: boolean): Promise<FileMove[]> {
  if (!skipFileRemoval) {
    const themeSettingsPaths = await getThemeSettingsFilePaths(path)
    await Promise.all(themeSettingsPaths.map(async file => {
      return removeFile(`${path}/${file}`)
    }))
  }

  const bucketRoot = await getBucketPath(bucket)
  const settingsFromBucket = await getBucketSettingsFilePaths(bucket)
  const fileMoves = settingsFromBucket.map(settingPath => {
    return {
      file: settingPath,
      source: `${bucketRoot}/${settingPath}`,
      dest: `${path}/${settingPath}`
    }
  })
  copyFiles(fileMoves)
  return fileMoves
}
