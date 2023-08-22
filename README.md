# Shopkeeper
<a href="http://twitter.com/_thebeyondgroup"><img src="https://img.shields.io/twitter/follow/_thebeyondgroup?style=flat-square" alt="Twitter Followers"></a>
<img src="https://img.shields.io/badge/License-MIT-green.svg" alt="License">

Shopkeeper is a CLI to help manage Shopify stores. It is built as a plugin
to allow seamless integration with the Shopify CLI theme developers use every day.

It can be used as a standalone CLI (`shopkeeper command`) 
or integrated with the Shopify CLI (`shopify COMMAND`).

It helps developers:
* Manage settings
* Deploy theme changes


## Installation

You can install the CLI globally with:

```sh-session
npm install -g @thebeyondgroup/shopkeeper
```

Or if your theme has a `package.json`:

```sh-session
npm add --save-dev @thebeyondgroup/shopkeeper
```
> :rotating_light: It is not currently possible to use Shopkeeper 
> as a plugin with a homebrew installation of the Shopify CLI.
> You would need to install it as a global npm package and 
> use the `shopkeeper` executable.

## Commands

To learn the full capability of Shopkeeper, see the [command docs](docs/commands) 

## Manage Settings

Shopkeeper makes it easy to manage multiple Shopify stores from a single codebase.
In particular, it makes it easy to switch between store instances and manage theme settings.

Add a `.shopkeeper` folder to the root of your project to store buckets of settings.

> :warning: We refer to groups of settings because the term environment is overloaded in
> Shopify development. You might have a product and staging store instance. These might be
> referred to as "environments." To add to the confusion, Shopify recently added the ability to
> specify groups of flags in a `shopify.theme.toml` file and calls these groups 
> [environments](https://shopify.dev/docs/themes/tools/cli/environments).
>
> Therefore, we call our groups of settings buckets :bucket:

For example, here we introduce a `production` bucket that
refers to a Shopify instance. In multi-store,
multi-region setups, you might have a directory for each region. Say `canada`,
`united-states`, or `united-kingdom`. Or you might use a bucket to contains the settings for
an A/B test.

Here we see an example bucket created from the default 
installation of [Dawn](https://github.com/shopify/dawn):

```sh-session
.shopkeeper
└── production
    ├── config
    │   └── settings_data.json
    ├── sections
    │   ├── footer-group.json
    │   └── header-group.json
    └── templates
        ├── 404.json
        ├── article.json
        ├── blog.json
        ├── cart.json
        ├── collection.json
        ├── customers
        │   ├── account.json
        │   ├── activate_account.json
        │   ├── addresses.json
        │   ├── login.json
        │   ├── order.json
        │   ├── register.json
        │   └── reset_password.json
        ├── index.json
        ├── list-collections.json
        ├── page.contact.json
        ├── page.json
        ├── password.json
        ├── product.json
        └── search.json
```

Each folder contains theme settings stored in their corresponding `config` and
`templates` folders. It also contains a `.env` file that's copied to the project
root as `.env ` when the bucket is switched.

## Deploy Changes

Shopkeeper supports multiple deployment strategies:

* Basic
* Blue/Green

Shopkeeper extends the Shopify CLI `theme` topic with a 
[`deploy`](docs/commands/readme#shopkeeper-theme-deploy) command.

### Basic Deployment

When you run `shopkeeper theme deploy --strategy basic`, Shopkeeper will:
1. Download settings from the live theme
2. Push code to the live theme
3. Update the live theme's name to be `[HEAD_SHA] Production`

> :warning: the default deployment strategy is `blue-green`, so the `--strategy` must be set.

### Blue/Green Deployment

A blue/green deployment strategy alternates between a blue and a green theme.
One theme is live and the other we refer to as on-deck. For example, using this
approach, if a the blue :large_blue_circle: theme is live, the green :green_circle: theme is on-deck.

When you run `shopkeeper theme deploy`, Shopkeeper will:

1. Download settings from the live theme
2. Push code to the on-deck theme
3. Rename the on-deck theme to be `[HEAD] Production - <Color>`

Using blue/green deploys requires additional setup. You must specify the theme IDs for the blue
and green themes. You can pass these values as flags:

```sh-session
shopkeeper theme deploy --blue 13455343 --green 654321

```

A better option is to set the flags in the bucket's `.env` file. Every flag in the Shopify CLI can be set
with an environment variable. Shopkeeper follows this pattern:

| Flag                  | Use                                   |
| ---------------------- | ------------------------------------- |
| `SKR_FLAG_BLUE_THEME_ID`| blue theme ID, cannot be name as name will be update   |
| `SKR_FLAG_GREEN_THEME_ID`| green theme ID, cannot be name as name will be update   |

Using a tool like [direnv](https://direnv.net), you can have your environment variables automatically
updated when you switch buckets.

## Contribute
If you'd like to contribute to the project, check out the [contributors docs](docs/contribute.md) to get started.
