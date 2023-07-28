import { removeFile } from "@shopify/cli-kit/node/fs";
import { copyFiles, FileMove, getBucketPath, getBucketSettingsFilePaths, getProjectDir, getThemeSettingsFilePaths, setCurrentBucket } from "../../utilities/bucket.js";

export async function switchBucket(bucket: string, path: string, skipFileRemoval: boolean): Promise<FileMove[]> {
  if (!skipFileRemoval) {
    const themeSettingsPaths = await getThemeSettingsFilePaths(path)
    await Promise.all(themeSettingsPaths.map(async file => {
      return removeFile(`${path}/${file}`)
    }))
  }

  const bucketRoot = await getBucketPath(bucket)
  const settingsFromBucket = await getBucketSettingsFilePaths(bucket)
  let fileMoves = settingsFromBucket.map(settingPath => {
    return {
      file: settingPath,
      source: `${bucketRoot}/${settingPath}`,
      dest: `${path}/${settingPath}`
    }
  })
  fileMoves = await appendEnv(fileMoves, bucketRoot)
  copyFiles(fileMoves)
  setCurrentBucket(bucket)
  return fileMoves
}

async function appendEnv(fileMoves: FileMove[], bucketRoot: string): Promise<FileMove[]> {
  const projectDir = await getProjectDir()
  return fileMoves.concat({
    file: ".env",
    source: `${bucketRoot}/.env`,
    dest: `${projectDir}/.env`
  })
}
