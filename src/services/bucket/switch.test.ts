import { inTemporaryDirectory, mkdir, touchFile, writeFile } from '@shopify/cli-kit/node/fs'
import { joinPath } from '@shopify/cli-kit/node/path'
import { describe, test } from 'vitest'
import { DEFAULT_ENV_FILE } from '../../utilities/bucket.js'
import { CURRENT_BUCKET_FILE } from '../../utilities/constants.js'
import { switchBucket } from './switch.js'
import { expectFileNotToExist, expectFileToExist, expectFileToHaveContent } from '../../utilities/test-helpers.js'


describe('switch', () => {
  describe('switchBucket', () => {
    describe('when file removal skipped', () => {
      test('copies files from bucket into theme without deleting destination', async () => {
        await inTemporaryDirectory(async (tmpDir: string) => {
          // Given
          const shopkeeperRoot = joinPath(tmpDir, '.shopkeeper')
          const productionBucket = joinPath(shopkeeperRoot, 'production')

          const currentBucketPath = joinPath(shopkeeperRoot, CURRENT_BUCKET_FILE)
          const bucketEnvPath = joinPath(productionBucket, '.env')
          const projectEnvPath = joinPath(tmpDir, '.env')

          const bucketConfigPath = joinPath(productionBucket, 'config', 'settings_data.json')

          const bucketTemplatesFolderPath = joinPath(productionBucket, 'templates')
          const bucketTemplatePath = joinPath(productionBucket, 'templates', 'product.json')

          const bucketCustomerTemplatePath = joinPath(bucketTemplatesFolderPath, 'customer', 'account.json')

          const bucketMetaobjectTemplatePath = joinPath(bucketTemplatesFolderPath, 'metaobject', 'toy.json')

          const bucketSectionPath = joinPath(productionBucket, 'sections', 'header-group.json')

          const themeRoot = joinPath(tmpDir, 'theme')
          const themeTemplatesPath = joinPath(themeRoot, 'templates')
          const themeExistingTemplatePath = joinPath(themeTemplatesPath, 'product.existing.json')

          const themeTemplatePath = joinPath(themeTemplatesPath, 'product.json')

          const themeCustomerTemplatesPath = joinPath(themeTemplatesPath, 'customer', 'account.json')

          const themeMetaobjectTemplatePath = joinPath(themeTemplatesPath, 'metaobject', 'toy.json')
          const themeExistingMetaobjectTemplatePath = joinPath(themeTemplatesPath, 'metaobject', 'existing.json')

          const themeSectionPath = joinPath(themeRoot, 'sections', 'header-group.json')
          const themeExistingSectionPath = joinPath(themeRoot, 'sections', 'existing-section-group.json')

          await mkdir(productionBucket)
          await touchFile(bucketConfigPath)
          await touchFile(bucketTemplatePath)
          await touchFile(bucketCustomerTemplatePath)
          await touchFile(bucketMetaobjectTemplatePath)
          await touchFile(bucketSectionPath)
          await writeFile(bucketEnvPath, DEFAULT_ENV_FILE)
          await writeFile(currentBucketPath, 'production \n')

          await mkdir(themeRoot)
          await touchFile(themeExistingTemplatePath)
          await touchFile(themeTemplatePath)
          await touchFile(themeExistingMetaobjectTemplatePath)
          await touchFile(themeExistingSectionPath)

          // When
          await switchBucket('production', themeRoot, true, shopkeeperRoot)

          // Then
          // expect current bucket to be updated
          await expectFileToHaveContent(currentBucketPath, 'production')

          // expect env to be updated
          await expectFileToHaveContent(projectEnvPath, DEFAULT_ENV_FILE)

          // expect files in bucket to be copied to their destination in the theme
          await expectFileToExist(themeTemplatePath)
          await expectFileToExist(themeCustomerTemplatesPath)
          await expectFileToExist(themeMetaobjectTemplatePath)
          await expectFileToExist(themeSectionPath)

          // expect existing files in theme to be preserved
          await expectFileToExist(themeExistingTemplatePath)
          await expectFileToExist(themeExistingMetaobjectTemplatePath)
          await expectFileToExist(themeExistingSectionPath)
        })
      })
    })
    describe('when files removed on switch', () => {
      test('copies files from bucket into theme', async () => {
        await inTemporaryDirectory(async (tmpDir: string) => {
          // Given
          const shopkeeperRoot = joinPath(tmpDir, '.shopkeeper')
          const productionBucket = joinPath(shopkeeperRoot, 'production')

          const currentBucketPath = joinPath(shopkeeperRoot, CURRENT_BUCKET_FILE)
          const bucketEnvPath = joinPath(productionBucket, '.env')
          const projectEnvPath = joinPath(tmpDir, '.env')

          const bucketConfigPath = joinPath(productionBucket, 'config', 'settings_data.json')

          const bucketTemplatesFolderPath = joinPath(productionBucket, 'templates')
          const bucketTemplatePath = joinPath(productionBucket, 'templates', 'product.json')

          const bucketCustomerTemplatePath = joinPath(bucketTemplatesFolderPath, 'customer', 'account.json')

          const bucketMetaobjectTemplatePath = joinPath(bucketTemplatesFolderPath, 'metaobject', 'toy.json')

          const bucketSectionPath = joinPath(productionBucket, 'sections', 'header-group.json')

          const themeRoot = joinPath(tmpDir, 'theme')
          const themeTemplatesPath = joinPath(themeRoot, 'templates')
          const themeExistingTemplatePath = joinPath(themeTemplatesPath, 'product.existing.json')

          const themeTemplatePath = joinPath(themeTemplatesPath, 'product.json')

          const themeCustomerTemplatesPath = joinPath(themeTemplatesPath, 'customer', 'account.json')

          const themeMetaobjectTemplatePath = joinPath(themeTemplatesPath, 'metaobject', 'toy.json')
          const themeExistingMetaobjectTemplatePath = joinPath(themeTemplatesPath, 'metaobject', 'existing.json')

          const themeSectionPath = joinPath(themeRoot, 'sections', 'header-group.json')
          const themeExistingSectionPath = joinPath(themeRoot, 'sections', 'existing-section-group.json')

          await mkdir(productionBucket)
          await touchFile(bucketConfigPath)
          await touchFile(bucketTemplatePath)
          await touchFile(bucketCustomerTemplatePath)
          await touchFile(bucketMetaobjectTemplatePath)
          await touchFile(bucketSectionPath)
          await writeFile(bucketEnvPath, DEFAULT_ENV_FILE)
          await writeFile(currentBucketPath, 'production \n')

          await mkdir(themeRoot)
          await touchFile(themeExistingTemplatePath)
          await touchFile(themeTemplatePath)
          await touchFile(themeExistingMetaobjectTemplatePath)
          await touchFile(themeExistingSectionPath)

          // When
          await switchBucket('production', themeRoot, false, shopkeeperRoot)

          // Then
          // expect current bucket to be updated
          await expectFileToHaveContent(currentBucketPath, 'production')

          // expect env to be updated
          await expectFileToHaveContent(projectEnvPath, DEFAULT_ENV_FILE)

          // expect files in bucket to be copied to their destination in the theme
          await expectFileToExist(themeTemplatePath)
          await expectFileToExist(themeCustomerTemplatesPath)
          await expectFileToExist(themeMetaobjectTemplatePath)
          await expectFileToExist(themeSectionPath)

          // expect existing files in theme to be removed
          await expectFileNotToExist(themeExistingTemplatePath)
          await expectFileNotToExist(themeExistingMetaobjectTemplatePath)
          await expectFileNotToExist(themeExistingSectionPath)

        })
      })
    })
  })
})
