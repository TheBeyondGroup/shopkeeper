# Shopkeeper
<a href="http://twitter.com/_thebeyondgroup"><img src="https://img.shields.io/twitter/follow/_thebeyondgroup?style=flat-square" alt="Twitter Followers"></a>
<img src="https://img.shields.io/badge/License-MIT-green.svg" alt="License">

Shopkeeper is a CLI to help manage Shopify stores. 

It is built as an oclif plugin to allow seamless integration with the Shopify
CLI theme developers use every day.

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
> :rotating_light: It is not currently possible to use Shopkeeper as a plugin
> to the homebrew installation of the Shopify CLI. To use it, you need to
> install it as a global npm package and use the `shopkeeper` executable.

### tl;dr

Assuming you've set `SHOPIFY_CLI_THEME_TOKEN`, `SHOPIFY_FLAG_STORE`,
`SHOPIFY_FLAG_PATH`, or are setting their corresponding flags when calling a
command:

To download settings from the live theme:
```sh-session
shopkeeper theme settings download
```
To switch buckets:
```sh-session
shopkeeper bucket switch <bucket name>
```

To deploy _directly_ to the live theme after pulling down the live theme's settings:
```sh-session
shopkeeper theme deploy --strategy basic
```

For a more complete introduction and walkthrough of how to use Shopkeeper, see
[guide](/docs/the_complete_guide.md).

## Commands

To learn the full capability of Shopkeeper, see the [command docs](docs/commands).

When using it as a standalone, call commands using `shopkeeper COMMAND`.
When using it as a plugin to the Shopify CLI, you can call command using `shopify COMMAND`.

You can verify Shopkeeper has been correctly installed as a plugin by running `shopify commands`.
If you can see the bucket commands listed, Shopkeeper is installed correctly.

Use `npx` to run the version local to your project's `node_modules`.

## Manage Settings

Shopkeeper makes it easy to manage multiple Shopify stores from a single
codebase. In particular, it makes it easy to switch between store instances and
manage theme settings.

It uses a `.shopkeeper` folder at the root of your project to store buckets of settings.

> :brain: We refer to groups of settings because the term environment is
> overloaded in Shopify development. You might have production and staging
> store instances. These might be referred to as "environments." To add to the
> confusion, Shopify recently added the ability to specify groups of flags in a
> `shopify.theme.toml` file and calls these groups
> [environments](https://shopify.dev/docs/themes/tools/cli/environments).
>
> Therefore, we call our groups of settings buckets. :bucket:

In multi-store, multi-region setups, you might have a directory for
each region. Say `canada`, `united-states`, or `united-kingdom`. Or you might
use a bucket to contains the settings for an A/B test.

Here we see an example `production` bucket created from the default 
installation of [Dawn](https://github.com/shopify/dawn):

```sh-session
.shopkeeper
├── production
│   ├── config
│   │   └── settings_data.json
│   ├── sections
│   │   ├── footer-group.json
│   │   └── header-group.json
│   ├── templates
│   │   ├── customers
│   │   │   ├── account.json
│   │   │   ├── activate_account.json
│   │   │   ├── addresses.json
│   │   │   ├── login.json
│   │   │   ├── order.json
│   │   │   ├── register.json
│   │   │   └── reset_password.json
│   │   ├── 404.json
│   │   ├── article.json
│   │   ├── blog.json
│   │   ├── cart.json
│   │   ├── collection.json
│   │   ├── index.json
│   │   ├── list-collections.json
│   │   ├── page.contact.json
│   │   ├── page.json
│   │   ├── password.json
│   │   ├── product.json
│   │   └── search.json
│   ├── .env
│   └── .env.sample
└── .current-bucket
```

Each folder contains theme settings stored in their corresponding `config`,
`sections`, and `templates` folders. It also contains a `.env` file that's
copied to the project root as `.env ` when the bucket is switched.

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
approach, if a the blue :large_blue_circle: theme is live, the green
:green_circle: theme is on-deck.

When you run `shopkeeper theme deploy`, Shopkeeper will:

1. Download settings from the live theme
2. Push code to the on-deck theme
3. Rename the on-deck theme to be `[<HEAD_SHA>] Production - <color>`

Using blue/green deploys requires additional setup. You must specify the theme IDs for the blue
and green themes. You can pass these values as flags:

```sh-session
shopkeeper theme deploy --blue 13455343 --green 654321

```

A better option is to set the flags in the bucket's `.env` file. Every flag in
the Shopify CLI can be set with an environment variable. Shopkeeper follows
this pattern:

| Flag                  | Use                                   |
| ---------------------- | ------------------------------------- |
| `SKR_FLAG_BLUE_THEME_ID`| blue theme ID, cannot be name as name will be update   |
| `SKR_FLAG_GREEN_THEME_ID`| green theme ID, cannot be name as name will be update   |

Using a tool like [direnv](https://direnv.net), you can have your environment variables automatically
updated when you switch buckets.

## Contribute
If you'd like to contribute to the project, check out the [contributors docs](docs/contribute.md) to get started.
