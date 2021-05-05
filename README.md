# Shopkeeper

Shopkeeper is a CLI for managing Shopify stores.

For usage instructions, see the [command specification](docs/cli.md).

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
