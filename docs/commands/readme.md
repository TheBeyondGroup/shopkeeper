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
* [`shopkeeper help [COMMANDS]`](#shopkeeper-help-commands)
* [`shopkeeper theme create`](#shopkeeper-theme-create)
* [`shopkeeper theme deploy`](#shopkeeper-theme-deploy)
* [`shopkeeper theme get`](#shopkeeper-theme-get)
* [`shopkeeper theme settings download`](#shopkeeper-theme-settings-download)

## `shopkeeper bucket create`

Create a bucket in .shopkeeper

```
USAGE
  $ shopkeeper bucket create -b <value> [--no-color] [--verbose]

FLAGS
  -b, --bucket=<value>...  (required)
      --no-color           Disable color output.
      --verbose            Increase the verbosity of the logs.

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
  --no-color  Disable color output.
  --verbose   Increase the verbosity of the logs.

DESCRIPTION
  Output the current bucket
```

_See code: [src/commands/bucket/current.ts](https://github.com/TheBeyondGroup/shopkeeper/tree/main/src/src/commands/bucket/current.ts)_

## `shopkeeper bucket delete`

Delete a bucket

```
USAGE
  $ shopkeeper bucket delete -b <value> [--no-color] [--verbose] [-f]

FLAGS
  -b, --bucket=<value>...  (required)
  -f, --force              Skip confirmation.
      --no-color           Disable color output.
      --verbose            Increase the verbosity of the logs.

DESCRIPTION
  Delete a bucket
```

_See code: [src/commands/bucket/delete.ts](https://github.com/TheBeyondGroup/shopkeeper/tree/main/src/src/commands/bucket/delete.ts)_

## `shopkeeper bucket init`

Initialize .shopkeeper directory in the current directory

```
USAGE
  $ shopkeeper bucket init [--no-color] [--verbose] [-b <value>]

FLAGS
  -b, --bucket=<value>...
      --no-color           Disable color output.
      --verbose            Increase the verbosity of the logs.

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
  --no-color  Disable color output.
  --verbose   Increase the verbosity of the logs.

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
  -e, --environment=<value>  The environment to apply to the current command.
  -n, --nodelete             Runs the restore command without removing the theme's JSON settings.
      --bucket=<value>       The bucket you want to restore your settings from.
      --no-color             Disable color output.
      --path=<value>         The path to your theme directory.
      --verbose              Increase the verbosity of the logs.

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
  -e, --environment=<value>  The environment to apply to the current command.
  -n, --nodelete             Runs the save command without deleting the bucket's contents.
      --bucket=<value>       The bucket where you want to save your settings.
      --no-color             Disable color output.
      --path=<value>         The path to your theme directory.
      --verbose              Increase the verbosity of the logs.

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
  -e, --environment=<value>  The environment to apply to the current command.
  -n, --nodelete             Runs the restore command without removing the theme's JSON settings.
      --bucket=<value>       The bucket to switch to
      --no-color             Disable color output.
      --path=<value>         The path to your theme directory.
      --verbose              Increase the verbosity of the logs.

DESCRIPTION
  Switches the current bucket by copying settings and .env
```

_See code: [src/commands/bucket/switch.ts](https://github.com/TheBeyondGroup/shopkeeper/tree/main/src/src/commands/bucket/switch.ts)_

## `shopkeeper help [COMMANDS]`

Display help for shopkeeper.

```
USAGE
  $ shopkeeper help [COMMANDS] [-n]

ARGUMENTS
  COMMANDS  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for shopkeeper.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v6.0.1/src/commands/help.ts)_

## `shopkeeper theme create`

Create a theme with a name or ID. Update theme if one with name already exists

```
USAGE
  $ shopkeeper theme create -t <value> [--no-color] [--verbose] [--path <value>] [--password <value>] [-s <value>]
    [-e <value>] [-n] [-j]

FLAGS
  -e, --environment=<value>  The environment to apply to the current command.
  -j, --json                 Output JSON instead of a UI.
  -n, --nodelete             Runs the push command without deleting local files.
  -s, --store=<value>        Store URL. It can be the store prefix (johns-apparel) or the full myshopify.com URL
                             (johns-apparel.myshopify.com, https://johns-apparel.myshopify.com).
  -t, --theme=<value>        (required) Theme ID or name of the remote theme.
      --no-color             Disable color output.
      --password=<value>     Password generated from the Theme Access app.
      --path=<value>         The path to your theme directory.
      --verbose              Increase the verbosity of the logs.

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
    <value>] [-n] [--publish] [--green <value>] [--blue <value>] [--strategy blue-green|basic]

FLAGS
  -e, --environment=<value>  The environment to apply to the current command.
  -n, --nodelete             Runs the push command without deleting local files.
  -s, --store=<value>        Store URL. It can be the store prefix (johns-apparel) or the full myshopify.com URL
                             (johns-apparel.myshopify.com, https://johns-apparel.myshopify.com).
      --blue=<value>         Blue theme ID
      --green=<value>        Green theme ID
      --no-color             Disable color output.
      --password=<value>     Password generated from the Theme Access app.
      --path=<value>         The path to your theme directory.
      --publish              Publishes the on-deck theme after deploying
      --strategy=<option>    [default: blue-green] Strategy to use for deployment
                             <options: blue-green|basic>
      --verbose              Increase the verbosity of the logs.

DESCRIPTION
  Deploy theme source to store
```

_See code: [src/commands/theme/deploy.ts](https://github.com/TheBeyondGroup/shopkeeper/tree/main/src/src/commands/theme/deploy.ts)_

## `shopkeeper theme get`

Get details of theme

```
USAGE
  $ shopkeeper theme get -t <value> [--no-color] [--verbose] [-s <value>] [--password <value>] [-j]

FLAGS
  -j, --json              Output JSON instead of a UI.
  -s, --store=<value>     Store URL. It can be the store prefix (johns-apparel) or the full myshopify.com URL
                          (johns-apparel.myshopify.com, https://johns-apparel.myshopify.com).
  -t, --theme=<value>     (required) Theme ID or name of the remote theme.
      --no-color          Disable color output.
      --password=<value>  Password generated from the Theme Access app.
      --verbose           Increase the verbosity of the logs.

DESCRIPTION
  Get details of theme
```

_See code: [src/commands/theme/get.ts](https://github.com/TheBeyondGroup/shopkeeper/tree/main/src/src/commands/theme/get.ts)_

## `shopkeeper theme settings download`

Download settings from live theme.

```
USAGE
  $ shopkeeper theme settings download [--no-color] [--verbose] [--path <value>] [--password <value>] [-s <value>] [-e
    <value>] [-t <value>] [-n]

FLAGS
  -e, --environment=<value>  The environment to apply to the current command.
  -n, --nodelete             Runs the pull command without deleting local files.
  -s, --store=<value>        Store URL. It can be the store prefix (johns-apparel) or the full myshopify.com URL
                             (johns-apparel.myshopify.com, https://johns-apparel.myshopify.com).
  -t, --theme=<value>        Theme ID or name of the remote theme.
      --no-color             Disable color output.
      --password=<value>     Password generated from the Theme Access app.
      --path=<value>         The path to your theme directory.
      --verbose              Increase the verbosity of the logs.

DESCRIPTION
  Download settings from live theme.
```

_See code: [src/commands/theme/settings/download.ts](https://github.com/TheBeyondGroup/shopkeeper/tree/main/src/src/commands/theme/settings/download.ts)_
<!-- commandsstop -->
