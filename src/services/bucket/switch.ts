import { removeFile } from '@shopify/cli-kit/node/fs'
import {
  copyFiles,
  ensureBucketExists,
  FileMove,
  getBucketPath,
  getBucketSettingsFilePaths,
  getProjectPath,
  getShopkeeperPath,
  getThemeSettingsFilePaths,
  setCurrentBucket,
} from '../../utilities/bucket.js'
import { joinPath } from '@shopify/cli-kit/node/path'

export async function switchBucket(bucket: string, path: string, skipFileRemoval: boolean, rootPath?: string): Promise<FileMove[]> {
  const shopkeeperRoot = rootPath || await getShopkeeperPath()
  const bucketRoot = await getBucketPath(shopkeeperRoot, bucket)

  ensureBucketExists(shopkeeperRoot, bucket)

  if (!skipFileRemoval) {
    const themeSettingsPaths = await getThemeSettingsFilePaths(path)
    await Promise.all(
      themeSettingsPaths.map(async (file) => {
        const filepath = joinPath(path, file)
        return removeFile(filepath)
      }),
    )
  }

  const settingsFromBucket = await getBucketSettingsFilePaths(shopkeeperRoot, bucket)
  let fileMoves = settingsFromBucket.map((settingPath) => {
    return {
      file: settingPath,
      source: joinPath(bucketRoot, settingPath),
      dest: joinPath(path, settingPath),
    }
  })
  fileMoves = await appendEnv(shopkeeperRoot, fileMoves, bucketRoot)
  await copyFiles(fileMoves)
  await setCurrentBucket(shopkeeperRoot, bucket)
  return fileMoves
}

async function appendEnv(shopkeeperRoot: string, fileMoves: FileMove[], bucketRoot: string): Promise<FileMove[]> {
  const projectDir = await getProjectPath(shopkeeperRoot)
  return fileMoves.concat({
    file: '.env',
    source: joinPath(bucketRoot, '.env'),
    dest: joinPath(projectDir, '.env'),
  })
}
