import { emptyDir } from "fs-extra/esm"
import { copyFiles, FileMove, getBucketPath, getSettingsFolders, getThemeSettingsFilePaths } from "../../utilities/bucket.js"


export async function save(bucket: string, path: string, skipEmptyDirectory: boolean): Promise<FileMove[]> {
  const themeSettingsPaths = await getThemeSettingsFilePaths(path)
  const bucketRoot = await getBucketPath(bucket)

  if (!skipEmptyDirectory) {
    getSettingsFolders().forEach(async folder => {
      await emptyDir(`${bucketRoot}/${folder}`)
    })
  }

  const fileMoves = themeSettingsPaths.map(settingPath => {
    return {
      file: settingPath,
      source: `${path}/${settingPath}`,
      dest: `${bucketRoot}/${settingPath}`
    }
  })
  copyFiles(fileMoves)
  return fileMoves
}
