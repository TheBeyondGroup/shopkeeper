# Shopkeeper

Shopkeeper is a CLI for managing Shopify stores.

For usage instructions, see the [command specification](docs/cli.md).

## Development

To install this package globally while you're working on it:

```
npm link
```
If you're using `asdf` to manage your node version, you may need to run `asdf
reshim` to pick up the changes. Also, make sure you're using the same node
version in your shopkeeper directory as you are using elsewhere. `asdf` scopes
global packages by version.

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
npm run build
npm link
```
Note: We use `npm` here because `shopkeeper` is managed with `npm`.
If you're using `asdf` to manage your node versions, you may need to run `asdf reshim`.

In the location where you want to use Shopkeeper, for example, the theme you want to use for testing:
```
yarn link shopkeeper
yarn add --dev link:shopkeeper
```
