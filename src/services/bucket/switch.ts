import {removeFile} from '@shopify/cli-kit/node/fs'
import {
  copyFiles,
  ensureBucketExists,
  FileMove,
  getBucketPath,
  getBucketSettingsFilePaths,
  getProjectDir,
  getThemeSettingsFilePaths,
  setCurrentBucket,
} from '../../utilities/bucket.js'
import {joinPath} from '@shopify/cli-kit/node/path'

export async function switchBucket(bucket: string, path: string, skipFileRemoval: boolean): Promise<FileMove[]> {
  const bucketRoot = await getBucketPath(bucket)

  ensureBucketExists(bucket, bucketRoot)

  if (!skipFileRemoval) {
    const themeSettingsPaths = await getThemeSettingsFilePaths(path)
    await Promise.all(
      themeSettingsPaths.map(async (file) => {
        const filepath = joinPath(path, file)
        return removeFile(filepath)
      }),
    )
  }

  const settingsFromBucket = await getBucketSettingsFilePaths(bucket)
  let fileMoves = settingsFromBucket.map((settingPath) => {
    return {
      file: settingPath,
      source: joinPath(bucketRoot, settingPath),
      dest: joinPath(path, settingPath),
    }
  })
  fileMoves = await appendEnv(fileMoves, bucketRoot)
  await copyFiles(fileMoves)
  await setCurrentBucket(bucket)
  return fileMoves
}

async function appendEnv(fileMoves: FileMove[], bucketRoot: string): Promise<FileMove[]> {
  const projectDir = await getProjectDir()
  return fileMoves.concat({
    file: '.env',
    source: joinPath(bucketRoot, '.env'),
    dest: joinPath(projectDir, '.env'),
  })
}
