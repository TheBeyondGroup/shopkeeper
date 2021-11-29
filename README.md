# Shopkeeper

Shopkeeper is a CLI for managing Shopify stores.

For usage instructions, see the [command specification](docs/cli.md).

## Workflow

**To download the published theme's settings**

```
$ npx shopkeeper theme settings restore <environment>
$ npx shopkeeper theme settings download
```

**To backup the theme settings in your local theme directory**

```
$ npx shopkeeper theme settings save <environment>
```

## How it Works

Shopkeeper makes it easy to manage multiple Shopify stores from a single codebase.
In particular, it makes it easy to change the environment and manage theme settings.

Add a `.shopkeeper` folder to the root of your project to store your
environments. For example, here we introduce a `production` environment that
refers to a particular a production Shopify instance. In multi-store,
multi-region setups, you might have a directory for each region. Say `canada`,
`united-states`, or `united-kingdom`.

```
.shopkeeper
├── production
│   ├── config
│   │   └── settings_data.json
│   ├── env
│   ├── env.sample
│   └── templates
│       ├── index.json
│       └── page.about-us.json
└── settings.yml
```

Each folder contains theme settings stored in their corresponding `config` and
`templates` folders. It also contains a `env` file that's copied to the project
root as `.env ` when the environment is switched.

Shopkeeper depends on the following environment variables being set:

| Name                  | Use                                   |
| --------------------- | ------------------------------------- |
| `PROD_STORE_URL`      | `<store-name>`.myshopify.com          |
| `PROD_PASSWORD`       | Shopify private app password          |
| `STAGING_THEME_ID`    | theme id to use for the staging theme |
| `PROD_BLUE_THEME_ID`  | theme id to use for the blue theme    |
| `PROD_GREEN_THEME_ID` | theme id to use for the green theme   |

We recommend setting up your ThemeKit `config.yml` to use environment variables
set in the `.env` and loaded into the shell context using something like
[direnv](https://direnv.net/). The following `config.yml` shows how the file can
be setup to support the blue/green deployment strategy Shopkeeper employs.

```
# config.yml
development:
  password: ${DEV_PASSWORD}
  theme_id: ${DEV_THEME_ID}
  store: ${PROD_STORE_URL}
  directory: shopify
staging:
  password: ${PROD_PASSWORD}
  theme_id: ${STAGING_THEME_ID}
  store: ${PROD_STORE_URL}
  directory: shopify
production-blue:
  password: ${PROD_PASSWORD}
  theme_id: ${PROD_BLUE_THEME_ID}
  store: ${PROD_STORE_URL}
  directory: shopify
production-green:
  password: ${PROD_PASSWORD}
  theme_id: ${PROD_GREEN_THEME_ID}
  store: ${PROD_STORE_URL}
  directory: shopify
```

## Configuration

Use `settings.yml` to customize the name of your theme.

```
productionThemeName: "Your Name Production - " "Defaults to Production"
stagingThemeName: "Your Name Staging" # Defaults to "Staging"
themeDirectory: "dist" # Defaults to "shopify"; relative to your project directory
```

The `productionThemeName` is used as a prefix for the blue and green themes. It will
turn into `Your Name Production - Blue`. Also, on each deploy the current git SHA will
be prepended `[abc1234]Your Name Production - Blue`

## Development

To install this package globally while you're working on it:

```
npm run build
npm link
```

If you're using `asdf` to manage your node version, you may need to run `asdf reshim` to pick up the changes. Also, make sure you're using the same node
version in your shopkeeper directory as you are using elsewhere. `asdf` scopes
global packages by version.

Then you'll be able to run:

```
$ shopkeeper
```

⚠️ This takes the current version of the code and installs it globally.

To run the CLI from the package while in development, use `yarn shopkeeper ` as is defined
in the scripts.

### Using Package Locally

In shopkeeper root:

```
npm run build
yarn link
```

Note: We use `yarn` here because our projects are managed using yarn.
If you're using `asdf` to manage your node versions, you may need to run `asdf reshim`.
If you're using `npm`, use `npm link`.

In the location where you want to use Shopkeeper, for example, the theme you want to use for testing:

```
yarn link shopkeeper
yarn add --dev link:shopkeeper
```
