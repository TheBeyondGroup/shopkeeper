# Commands
<!-- commands -->
* [`shopkeeper bucket create`](#shopkeeper-bucket-create)
* [`shopkeeper bucket current`](#shopkeeper-bucket-current)
* [`shopkeeper bucket delete`](#shopkeeper-bucket-delete)
* [`shopkeeper bucket init`](#shopkeeper-bucket-init)
* [`shopkeeper bucket list`](#shopkeeper-bucket-list)
* [`shopkeeper bucket restore`](#shopkeeper-bucket-restore)
* [`shopkeeper bucket save`](#shopkeeper-bucket-save)
* [`shopkeeper bucket switch`](#shopkeeper-bucket-switch)
* [`shopkeeper help [COMMAND]`](#shopkeeper-help-command)
* [`shopkeeper theme create`](#shopkeeper-theme-create)
* [`shopkeeper theme deploy`](#shopkeeper-theme-deploy)
* [`shopkeeper theme get`](#shopkeeper-theme-get)
* [`shopkeeper theme settings pull`](#shopkeeper-theme-settings-pull)
* [`shopkeeper theme translations mirror`](#shopkeeper-theme-translations-mirror)

## `shopkeeper bucket create`

Create a bucket in .shopkeeper

```
USAGE
  $ shopkeeper bucket create -b <value>... [--no-color] [--verbose]

FLAGS
  -b, --bucket=<value>...  (required) [env: SKR_FLAG_BUCKET]
      --no-color           [env: SHOPIFY_FLAG_NO_COLOR] Disable color output.
      --verbose            [env: SHOPIFY_FLAG_VERBOSE] Increase the verbosity of the output.

DESCRIPTION
  Create a bucket in .shopkeeper
```

_See code: [src/commands/bucket/create.ts](https://github.com/TheBeyondGroup/shopkeeper/tree/main/src/src/commands/bucket/create.ts)_

## `shopkeeper bucket current`

Output the current bucket

```
USAGE
  $ shopkeeper bucket current [--no-color] [--verbose]

FLAGS
  --no-color  [env: SHOPIFY_FLAG_NO_COLOR] Disable color output.
  --verbose   [env: SHOPIFY_FLAG_VERBOSE] Increase the verbosity of the output.

DESCRIPTION
  Output the current bucket
```

_See code: [src/commands/bucket/current.ts](https://github.com/TheBeyondGroup/shopkeeper/tree/main/src/src/commands/bucket/current.ts)_

## `shopkeeper bucket delete`

Delete a bucket

```
USAGE
  $ shopkeeper bucket delete -b <value>... [--no-color] [--verbose] [-f]

FLAGS
  -b, --bucket=<value>...  (required) [env: SKR_FLAG_BUCKET]
  -f, --force              [env: SHOPIFY_FLAG_FORCE] Skip confirmation.
      --no-color           [env: SHOPIFY_FLAG_NO_COLOR] Disable color output.
      --verbose            [env: SHOPIFY_FLAG_VERBOSE] Increase the verbosity of the output.

DESCRIPTION
  Delete a bucket
```

_See code: [src/commands/bucket/delete.ts](https://github.com/TheBeyondGroup/shopkeeper/tree/main/src/src/commands/bucket/delete.ts)_

## `shopkeeper bucket init`

Initialize .shopkeeper directory in the current directory

```
USAGE
  $ shopkeeper bucket init [--no-color] [--verbose] [-b <value>...]

FLAGS
  -b, --bucket=<value>...  [env: SKR_FLAG_BUCKET]
      --no-color           [env: SHOPIFY_FLAG_NO_COLOR] Disable color output.
      --verbose            [env: SHOPIFY_FLAG_VERBOSE] Increase the verbosity of the output.

DESCRIPTION
  Initialize .shopkeeper directory in the current directory
```

_See code: [src/commands/bucket/init.ts](https://github.com/TheBeyondGroup/shopkeeper/tree/main/src/src/commands/bucket/init.ts)_

## `shopkeeper bucket list`

List buckets

```
USAGE
  $ shopkeeper bucket list [--no-color] [--verbose]

FLAGS
  --no-color  [env: SHOPIFY_FLAG_NO_COLOR] Disable color output.
  --verbose   [env: SHOPIFY_FLAG_VERBOSE] Increase the verbosity of the output.

DESCRIPTION
  List buckets
```

_See code: [src/commands/bucket/list.ts](https://github.com/TheBeyondGroup/shopkeeper/tree/main/src/src/commands/bucket/list.ts)_

## `shopkeeper bucket restore`

Restores the theme settings from the specified bucket

```
USAGE
  $ shopkeeper bucket restore [--no-color] [--verbose] [--path <value>] [-e <value>] [--bucket <value>] [-n]

FLAGS
  -e, --environment=<value>  [env: SHOPIFY_FLAG_ENVIRONMENT] The environment to apply to the current command.
  -n, --nodelete             [env: SHOPIFY_FLAG_NODELETE] Runs the restore command without removing the theme's JSON
                             settings.
      --bucket=<value>       The bucket you want to restore your settings from.
      --no-color             [env: SHOPIFY_FLAG_NO_COLOR] Disable color output.
      --path=<value>         [env: SHOPIFY_FLAG_PATH] The path to your theme directory.
      --verbose              [env: SHOPIFY_FLAG_VERBOSE] Increase the verbosity of the output.

DESCRIPTION
  Restores the theme settings from the specified bucket
```

_See code: [src/commands/bucket/restore.ts](https://github.com/TheBeyondGroup/shopkeeper/tree/main/src/src/commands/bucket/restore.ts)_

## `shopkeeper bucket save`

Saves the current theme settings to the specified bucket

```
USAGE
  $ shopkeeper bucket save [--no-color] [--verbose] [--path <value>] [-e <value>] [--bucket <value>] [-n]

FLAGS
  -e, --environment=<value>  [env: SHOPIFY_FLAG_ENVIRONMENT] The environment to apply to the current command.
  -n, --nodelete             [env: SHOPIFY_FLAG_NODELETE] Runs the save command without deleting the bucket's contents.
      --bucket=<value>       The bucket where you want to save your settings.
      --no-color             [env: SHOPIFY_FLAG_NO_COLOR] Disable color output.
      --path=<value>         [env: SHOPIFY_FLAG_PATH] The path to your theme directory.
      --verbose              [env: SHOPIFY_FLAG_VERBOSE] Increase the verbosity of the output.

DESCRIPTION
  Saves the current theme settings to the specified bucket
```

_See code: [src/commands/bucket/save.ts](https://github.com/TheBeyondGroup/shopkeeper/tree/main/src/src/commands/bucket/save.ts)_

## `shopkeeper bucket switch`

Switches the current bucket by copying settings and .env

```
USAGE
  $ shopkeeper bucket switch [--no-color] [--verbose] [--path <value>] [-e <value>] [--bucket <value>] [-n]

FLAGS
  -e, --environment=<value>  [env: SHOPIFY_FLAG_ENVIRONMENT] The environment to apply to the current command.
  -n, --nodelete             [env: SHOPIFY_FLAG_NODELETE] Runs the restore command without removing the theme's JSON
                             settings.
      --bucket=<value>       The bucket to switch to
      --no-color             [env: SHOPIFY_FLAG_NO_COLOR] Disable color output.
      --path=<value>         [env: SHOPIFY_FLAG_PATH] The path to your theme directory.
      --verbose              [env: SHOPIFY_FLAG_VERBOSE] Increase the verbosity of the output.

DESCRIPTION
  Switches the current bucket by copying settings and .env
```

_See code: [src/commands/bucket/switch.ts](https://github.com/TheBeyondGroup/shopkeeper/tree/main/src/src/commands/bucket/switch.ts)_

## `shopkeeper help [COMMAND]`

Display help for shopkeeper.

```
USAGE
  $ shopkeeper help [COMMAND...] [-n]

ARGUMENTS
  [COMMAND...]  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for shopkeeper.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/6.2.41/src/commands/help.ts)_

## `shopkeeper theme create`

Create a theme with a name or ID. Update theme if one with name already exists

```
USAGE
  $ shopkeeper theme create -t <value> [--no-color] [--verbose] [--path <value>] [--password <value>] [-s <value>]
    [-e <value>] [-n] [-j]

FLAGS
  -e, --environment=<value>  [env: SHOPIFY_FLAG_ENVIRONMENT] The environment to apply to the current command.
  -j, --json                 [env: SHOPIFY_FLAG_JSON] Output JSON instead of a UI.
  -n, --nodelete             [env: SHOPIFY_FLAG_NODELETE] Runs the push command without deleting local files.
  -s, --store=<value>        [env: SHOPIFY_FLAG_STORE] Store URL. It can be the store prefix (example) or the full
                             myshopify.com URL (example.myshopify.com, https://example.myshopify.com).
  -t, --theme=<value>        (required) [env: SHOPIFY_FLAG_THEME_ID] Theme ID or name of the remote theme.
      --no-color             [env: SHOPIFY_FLAG_NO_COLOR] Disable color output.
      --password=<value>     [env: SHOPIFY_CLI_THEME_TOKEN] Password generated from the Theme Access app.
      --path=<value>         [env: SHOPIFY_FLAG_PATH] The path to your theme directory.
      --verbose              [env: SHOPIFY_FLAG_VERBOSE] Increase the verbosity of the output.

DESCRIPTION
  Create a theme with a name or ID. Update theme if one with name already exists

  Create a theme with theme name or ID.
  In most cases, you should use theme push.

  This command exists for the case when you want create a theme by name that may
  or may not exist. It will ensure that if one with the same name already exists,
  it is updated.

  theme push --unpublished --theme yellow will create a new theme named yellow each
  time the command is run.

  As a result this command exists.
```

_See code: [src/commands/theme/create.ts](https://github.com/TheBeyondGroup/shopkeeper/tree/main/src/src/commands/theme/create.ts)_

## `shopkeeper theme deploy`

Deploy theme source to store

```
USAGE
  $ shopkeeper theme deploy [--no-color] [--verbose] [--path <value>] [--password <value>] [-s <value>] [-e
    <value>] [-n] [--publish] [--green <value>] [--blue <value>] [--strategy blue-green|basic] [--mirror-translations]

FLAGS
  -e, --environment=<value>  [env: SHOPIFY_FLAG_ENVIRONMENT] The environment to apply to the current command.
  -n, --nodelete             [env: SHOPIFY_FLAG_NODELETE] Runs the push command without deleting local files.
  -s, --store=<value>        [env: SHOPIFY_FLAG_STORE] Store URL. It can be the store prefix (example) or the full
                             myshopify.com URL (example.myshopify.com, https://example.myshopify.com).
      --blue=<value>         [env: SKR_FLAG_BLUE_THEME_ID] Blue theme ID
      --green=<value>        [env: SKR_FLAG_GREEN_THEME_ID] Green theme ID
      --mirror-translations  [env: SKR_FLAG_MIRROR_TRANSLATIONS] Opt-in. Before deploying code, mirror theme-scoped
                             translations (Translate & Adapt template / locale-content / settings translations) from the
                             currently-live theme onto the on-deck theme. Default off; most stores do not register
                             theme-scoped translations, and the pre-flight cost is not justified for them. Stores that
                             use Translate & Adapt should enable this via SKR_FLAG_MIRROR_TRANSLATIONS=true.
      --no-color             [env: SHOPIFY_FLAG_NO_COLOR] Disable color output.
      --password=<value>     [env: SHOPIFY_CLI_THEME_TOKEN] Password generated from the Theme Access app.
      --path=<value>         [env: SHOPIFY_FLAG_PATH] The path to your theme directory.
      --publish              [env: SKR_FLAG_PUBLISH] Publishes the on-deck theme after deploying
      --strategy=<option>    [default: blue-green, env: SKR_FLAG_STRATEGY] Strategy to use for deployment
                             <options: blue-green|basic>
      --verbose              [env: SHOPIFY_FLAG_VERBOSE] Increase the verbosity of the output.

DESCRIPTION
  Deploy theme source to store
```

_See code: [src/commands/theme/deploy.ts](https://github.com/TheBeyondGroup/shopkeeper/tree/main/src/src/commands/theme/deploy.ts)_

## `shopkeeper theme get`

Get details of theme

```
USAGE
  $ shopkeeper theme get -t <value> [--no-color] [--verbose] [-s <value>] [--password <value>] [-e <value>] [-j]

FLAGS
  -e, --environment=<value>  [env: SHOPIFY_FLAG_ENVIRONMENT] The environment to apply to the current command.
  -j, --json                 [env: SHOPIFY_FLAG_JSON] Output JSON instead of a UI.
  -s, --store=<value>        [env: SHOPIFY_FLAG_STORE] Store URL. It can be the store prefix (example) or the full
                             myshopify.com URL (example.myshopify.com, https://example.myshopify.com).
  -t, --theme=<value>        (required) [env: SHOPIFY_FLAG_THEME_ID] Theme ID or name of the remote theme.
      --no-color             [env: SHOPIFY_FLAG_NO_COLOR] Disable color output.
      --password=<value>     [env: SHOPIFY_CLI_THEME_TOKEN] Password generated from the Theme Access app.
      --verbose              [env: SHOPIFY_FLAG_VERBOSE] Increase the verbosity of the output.

DESCRIPTION
  Get details of theme
```

_See code: [src/commands/theme/get.ts](https://github.com/TheBeyondGroup/shopkeeper/tree/main/src/src/commands/theme/get.ts)_

## `shopkeeper theme settings pull`

Pull settings from live theme.

```
USAGE
  $ shopkeeper theme settings pull [--no-color] [--verbose] [--path <value>] [--password <value>] [-s <value>] [-e
    <value>] [-d] [-l] [-t <value>] [-n]

FLAGS
  -d, --development          [env: SHOPIFY_FLAG_DEVELOPMENT] Pull settings files from your remote development theme.
  -e, --environment=<value>  [env: SHOPIFY_FLAG_ENVIRONMENT] The environment to apply to the current command.
  -l, --live                 [env: SHOPIFY_FLAG_LIVE] Pull settings files from your remote live theme.
  -n, --nodelete             [env: SHOPIFY_FLAG_NODELETE] Runs the pull command without deleting local files.
  -s, --store=<value>        [env: SHOPIFY_FLAG_STORE] Store URL. It can be the store prefix (example) or the full
                             myshopify.com URL (example.myshopify.com, https://example.myshopify.com).
  -t, --theme=<value>        [env: SHOPIFY_FLAG_THEME_ID] Theme ID or name of the remote theme.
      --no-color             [env: SHOPIFY_FLAG_NO_COLOR] Disable color output.
      --password=<value>     [env: SHOPIFY_CLI_THEME_TOKEN] Password generated from the Theme Access app.
      --path=<value>         [env: SHOPIFY_FLAG_PATH] The path to your theme directory.
      --verbose              [env: SHOPIFY_FLAG_VERBOSE] Increase the verbosity of the output.

DESCRIPTION
  Pull settings from live theme.
```

_See code: [src/commands/theme/settings/pull.ts](https://github.com/TheBeyondGroup/shopkeeper/tree/main/src/src/commands/theme/settings/pull.ts)_

## `shopkeeper theme translations mirror`

Mirror theme-scoped translations from one theme to another. Translations registered via the Translate & Adapt app (or any caller of translationsRegister) are keyed to a specific theme GID and do NOT migrate between themes — so a blue/green deploy strands them on the previously-live color unless something explicitly carries them across. This command does that.

```
USAGE
  $ shopkeeper theme translations mirror [--no-color] [--verbose] [-s <value>] [--password <value>] [-e <value>] [--from
    <value>] [--to <value>] [--blue <value>] [--green <value>] [--locale <value>] [--resource-type <value>] [--dry-run]

FLAGS
  -e, --environment=<value>    [env: SHOPIFY_FLAG_ENVIRONMENT] The environment to apply to the current command.
  -s, --store=<value>          [env: SHOPIFY_FLAG_STORE] Store URL. It can be the store prefix (example) or the full
                               myshopify.com URL (example.myshopify.com, https://example.myshopify.com).
      --blue=<value>           [env: SKR_FLAG_BLUE_THEME_ID] Blue theme ID. Used when --from/--to are not provided: live
                               theme becomes source, on-deck becomes target.
      --dry-run                [env: SKR_FLAG_DRY_RUN] Build the write plan and print a summary, but do not invoke
                               translationsRegister.
      --from=<value>           [env: SKR_FLAG_FROM_THEME_ID] Source theme ID. When provided, must be combined with --to.
                               Use this to anchor the mirror direction explicitly (e.g. for recovery scenarios where the
                               most-up-to-date translation source is no longer [live]).
      --green=<value>          [env: SKR_FLAG_GREEN_THEME_ID] Green theme ID. Pairs with --blue.
      --locale=<value>         [env: SKR_FLAG_LOCALE] Mirror only this locale (e.g. "fr"). Defaults to every published
                               non-primary locale on the store.
      --no-color               [env: SHOPIFY_FLAG_NO_COLOR] Disable color output.
      --password=<value>       [env: SHOPIFY_CLI_THEME_TOKEN] Password generated from the Theme Access app.
      --resource-type=<value>  [env: SKR_FLAG_RESOURCE_TYPE] Restrict the mirror to a single theme-scoped resource type.
                               Useful for targeted ops or testing. Allowed: ONLINE_STORE_THEME,
                               ONLINE_STORE_THEME_APP_EMBED, ONLINE_STORE_THEME_JSON_TEMPLATE,
                               ONLINE_STORE_THEME_LOCALE_CONTENT, ONLINE_STORE_THEME_SECTION_GROUP,
                               ONLINE_STORE_THEME_SETTINGS_CATEGORY, ONLINE_STORE_THEME_SETTINGS_DATA_SECTIONS.
      --to=<value>             [env: SKR_FLAG_TO_THEME_ID] Target theme ID. When provided, must be combined with --from.
      --verbose                [env: SHOPIFY_FLAG_VERBOSE] Increase the verbosity of the output.

DESCRIPTION
  Mirror theme-scoped translations from one theme to another. Translations registered via the Translate & Adapt app (or
  any caller of translationsRegister) are keyed to a specific theme GID and do NOT migrate between themes — so a
  blue/green deploy strands them on the previously-live color unless something explicitly carries them across. This
  command does that.

EXAMPLES
  Mirror live -> on-deck before a blue/green deploy (standard use):

    $ shopkeeper theme translations mirror --blue 134599540817 --green 134599737425

  Recover translations stranded on a no-longer-live theme:

    $ shopkeeper theme translations mirror --from 134599540817 --to 134599737425

  Dry-run (print plan without writing):

    $ shopkeeper theme translations mirror --blue 1 --green 2 --dry-run
```

_See code: [src/commands/theme/translations/mirror.ts](https://github.com/TheBeyondGroup/shopkeeper/tree/main/src/src/commands/theme/translations/mirror.ts)_
<!-- commandsstop -->
