# Shopkeeper

Shopkeeper is a CLI for managing Shopify stores.

## Usage
`shopkeeper themekit`
  * delegates command to Shopify's themekit

`shopkeeper theme settings download`
  * downloads settings from published theme
  * -e --env override by config.yml environment
  * -t --theme-id override by theme id number

`shopkeeper theme settings sync`
  * syncs the settings between two environment
  * -s --source-env -d --destination-env

`shopkeeper theme deploy`
  * deploys theme based on strategy
  * --strategy defaults to bg (blue/green)
  * -e --env environment to deploy

`shopkeeper theme publish`
  * publishes theme
  *  -e --env environment to publish
  *  -t --theme-id theme_id to publish

`shopkeeper theme delete`
  * delete theme
  * -t --theme-id
  * -f --force

`shopkeeper theme create`
  * Creates a new theme with a name and uploads the current working directory
  * -n --name name of the new theme

## Development

To install this package globally while you're working on it:

```
yarn global add file:$PWD --prefix /usr/local
```

Then you'll be able to run:

```
shopkeeper
```

⚠️ This takes the current version of the code and installs it globally.

To run the CLI from the package while in development, use `yarn shopkeeper ` as is defined
in the scripts.

### Using Package Locally

In shopkeeper root:
```
yarn link
```

In location where you want to use Shopkeeper, for example, the theme you want to use for testing:
```
yarn link shopkeeper
yarn add --dev link:shopkeeper
```

### Using the version on GitHub
You can use a personal access token. This is what we'll do with our deploys for the being.
