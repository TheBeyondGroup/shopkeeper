import { inTemporaryDirectory, mkdir, touchFile } from '@shopify/cli-kit/node/fs'
import { joinPath } from '@shopify/cli-kit/node/path'
import { describe, test } from 'vitest'
import { expectFileNotToExist, expectFileToExist } from '../../utilities/test-helpers.js'
import { save } from './save.js'

describe('save', () => {
  describe('when file removal skipped', () => {
    test('copies files from theme into bucket', async () => {
      await inTemporaryDirectory(async (tmpDir: string) => {
        // Given
        const shopkeeperRoot = joinPath(tmpDir, '.shopkeeper')
        const productionBucket = joinPath(shopkeeperRoot, 'production')

        const bucketConfigFolderPath = joinPath(productionBucket, 'config')
        const bucketConfigPath = joinPath(bucketConfigFolderPath, 'settings_data.json')

        const bucketTemplatesFolderPath = joinPath(productionBucket, 'templates')
        const bucketTemplatePath = joinPath(bucketTemplatesFolderPath, 'product.json')
        const bucketExistingTemplatePath = joinPath(bucketTemplatesFolderPath, 'product.existing.json')

        const bucketCustomerTemplatePath = joinPath(bucketTemplatesFolderPath, 'customer', 'account.json')

        const bucketMetaobjectTemplatePath = joinPath(bucketTemplatesFolderPath, 'metaobject', 'toy.json')
        const bucketExistingMetaobjectTemplatePath = joinPath(bucketTemplatesFolderPath, 'metaobject', 'existing.json')

        const bucketSectionPath = joinPath(productionBucket, 'sections', 'header-group.json')
        const bucketExistingSectionPath = joinPath(productionBucket, 'sections', 'existing-section-group.json')

        const themeRoot = joinPath(tmpDir, 'theme')
        const themeConfigPath = joinPath(themeRoot, 'config', 'settings_data.json')
        const themeTemplatesPath = joinPath(themeRoot, 'templates')
        const themeTemplatePath = joinPath(themeTemplatesPath, 'product.json')
        const themeCustomerTemplatePath = joinPath(themeTemplatesPath, 'customer', 'account.json')
        const themeMetaobjectTemplatePath = joinPath(themeTemplatesPath, 'metaobject', 'toy.json')
        const themeSectionPath = joinPath(themeRoot, 'sections', 'header-group.json')

        await mkdir(productionBucket)
        await mkdir(bucketConfigFolderPath)
        await touchFile(bucketExistingTemplatePath)
        await touchFile(bucketExistingMetaobjectTemplatePath)
        await touchFile(bucketExistingSectionPath)

        await mkdir(themeRoot)
        await touchFile(themeConfigPath)
        await touchFile(themeTemplatePath)
        await touchFile(themeCustomerTemplatePath)
        await touchFile(themeMetaobjectTemplatePath)
        await touchFile(themeSectionPath)

        // When
        await save('production', themeRoot, true, shopkeeperRoot)

        // Then
        // expect files in theme to be copied to their destination in the bucket
        await expectFileToExist(bucketConfigPath)
        await expectFileToExist(bucketTemplatePath)
        await expectFileToExist(bucketCustomerTemplatePath)
        await expectFileToExist(bucketMetaobjectTemplatePath)
        await expectFileToExist(bucketSectionPath)

        // expect existing files in bucket to be preserved
        await expectFileToExist(bucketExistingTemplatePath)
        await expectFileToExist(bucketExistingMetaobjectTemplatePath)
        await expectFileToExist(bucketExistingSectionPath)
      })
    })
  })
  describe('when files removed on restore', () => {
    test('copies files from theme into bucket', async () => {
      await inTemporaryDirectory(async (tmpDir: string) => {
        // Given
        const shopkeeperRoot = joinPath(tmpDir, '.shopkeeper')
        const productionBucket = joinPath(shopkeeperRoot, 'production')

        const bucketConfigFolderPath = joinPath(productionBucket, 'config')
        const bucketConfigPath = joinPath(bucketConfigFolderPath, 'settings_data.json')

        const bucketTemplatesFolderPath = joinPath(productionBucket, 'templates')
        const bucketTemplatePath = joinPath(bucketTemplatesFolderPath, 'product.json')
        const bucketExistingTemplatePath = joinPath(bucketTemplatesFolderPath, 'product.existing.json')

        const bucketCustomerTemplatePath = joinPath(bucketTemplatesFolderPath, 'customer', 'account.json')

        const bucketMetaobjectTemplatePath = joinPath(bucketTemplatesFolderPath, 'metaobject', 'toy.json')
        const bucketExistingMetaobjectTemplatePath = joinPath(bucketTemplatesFolderPath, 'metaobject', 'existing.json')

        const bucketSectionPath = joinPath(productionBucket, 'sections', 'header-group.json')
        const bucketExistingSectionPath = joinPath(productionBucket, 'sections', 'existing-section-group.json')

        const themeRoot = joinPath(tmpDir, 'theme')
        const themeConfigPath = joinPath(themeRoot, 'config', 'settings_data.json')
        const themeTemplatesPath = joinPath(themeRoot, 'templates')
        const themeTemplatePath = joinPath(themeTemplatesPath, 'product.json')
        const themeCustomerTemplatePath = joinPath(themeTemplatesPath, 'customer', 'account.json')
        const themeMetaobjectTemplatePath = joinPath(themeTemplatesPath, 'metaobject', 'toy.json')
        const themeSectionPath = joinPath(themeRoot, 'sections', 'header-group.json')

        await mkdir(productionBucket)
        await touchFile(bucketExistingTemplatePath)
        await touchFile(bucketExistingMetaobjectTemplatePath)
        await touchFile(bucketExistingSectionPath)

        await mkdir(themeRoot)
        await touchFile(themeConfigPath)
        await touchFile(themeTemplatePath)
        await touchFile(themeCustomerTemplatePath)
        await touchFile(themeMetaobjectTemplatePath)
        await touchFile(themeSectionPath)

        // When
        await save('production', themeRoot, false, shopkeeperRoot)

        // Then
        // expect files in theme to be copied to their destination in the bucket
        await expectFileToExist(bucketConfigPath)
        await expectFileToExist(bucketTemplatePath)
        await expectFileToExist(bucketCustomerTemplatePath)
        await expectFileToExist(bucketMetaobjectTemplatePath)
        await expectFileToExist(bucketSectionPath)

        // expect existing files in bucket to be removed
        await expectFileNotToExist(bucketExistingTemplatePath)
        await expectFileNotToExist(bucketExistingMetaobjectTemplatePath)
        await expectFileNotToExist(bucketExistingSectionPath)
      })
    })
  })
})
