import { inTemporaryDirectory, mkdir, touchFile, writeFile } from '@shopify/cli-kit/node/fs'
import { joinPath } from '@shopify/cli-kit/node/path'
import { describe, test } from 'vitest'
import { expectFileNotToExist, expectFileToExist, expectFileToHaveContent } from '../../utilities/test-helpers.js'
import { restore } from './restore.js'

describe('restore', () => {
  describe('when file removal skipped', () => {
    test('copies files from bucket into theme', async () => {
      await inTemporaryDirectory(async (tmpDir: string) => {
        // Given
        const shopkeeperRoot = joinPath(tmpDir, '.shopkeeper')
        const productionBucket = joinPath(shopkeeperRoot, 'production')

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

        await mkdir(themeRoot)
        // We are purposely missing the config folder to ensure it can
        // created when settings are restored.
        await touchFile(themeExistingTemplatePath)
        await touchFile(themeTemplatePath)
        await touchFile(themeExistingMetaobjectTemplatePath)
        await touchFile(themeExistingSectionPath)

        // When
        await restore('production', themeRoot, true, shopkeeperRoot)

        // Then
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
  describe('when files removed on restore', () => {
    test('copies files from bucket into theme', async () => {
      await inTemporaryDirectory(async (tmpDir: string) => {
        // Given
        const shopkeeperRoot = joinPath(tmpDir, '.shopkeeper')
        const productionBucket = joinPath(shopkeeperRoot, 'production')

        const bucketConfigPath = joinPath(productionBucket, 'config', 'settings_data.json')

        const bucketTemplatesFolderPath = joinPath(productionBucket, 'templates')
        const bucketTemplatePath = joinPath(productionBucket, 'templates', 'product.json')

        const bucketCustomerTemplatePath = joinPath(bucketTemplatesFolderPath, 'customer', 'account.json')

        const bucketMetaobjectTemplatePath = joinPath(bucketTemplatesFolderPath, 'metaobject', 'toy.json')

        const bucketSectionPath = joinPath(productionBucket, 'sections', 'header-group.json')

        const themeRoot = joinPath(tmpDir, 'theme')
        const themeConfigPath = joinPath(themeRoot, 'config')

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

        await mkdir(themeRoot)
        // We are purposely missing the config folder to ensure it can
        // created when settings are restored.
        await touchFile(themeExistingTemplatePath)
        await touchFile(themeTemplatePath)
        await touchFile(themeExistingMetaobjectTemplatePath)
        await touchFile(themeExistingSectionPath)

        // When
        await restore('production', themeRoot, false, shopkeeperRoot)

        // Then
        // expect files in bucket to be copied to their destination in the theme
        await expectFileToExist(themeConfigPath)
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
