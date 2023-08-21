`shopkeeper theme`
==================

Deploy source to on-deck theme

* [`shopkeeper theme deploy`](#shopkeeper-theme-deploy)
* [`shopkeeper theme get`](#shopkeeper-theme-get)
* [`shopkeeper theme settings backup`](#shopkeeper-theme-settings-backup)
* [`shopkeeper theme settings download`](#shopkeeper-theme-settings-download)

## `shopkeeper theme deploy`

Deploy source to on-deck theme

```
USAGE
  $ shopkeeper theme deploy [--no-color] [--verbose] [--path <value>] [--password <value>] [-s <value>] [-e
    <value>] [-n] [--green <value>] [--blue <value>]

FLAGS
  -e, --environment=<value>  The environment to apply to the current command.
  -n, --nodelete             Runs the push command without deleting local files.
  -s, --store=<value>        Store URL. It can be the store prefix (johns-apparel) or the full myshopify.com URL
                             (johns-apparel.myshopify.com, https://johns-apparel.myshopify.com).
  --blue=<value>             Blue theme ID
  --green=<value>            Green theme ID
  --no-color                 Disable color output.
  --password=<value>         Password generated from the Theme Access app.
  --path=<value>             [default: /Users/jeff/Beyond/shopkeeper@1] The path to your theme directory.
  --verbose                  Increase the verbosity of the logs.

DESCRIPTION
  Deploy source to on-deck theme
```

_See code: [dist/commands/theme/deploy.ts](https://github.com/TheBeyondGroup/shopkeeper/blob/v1.0.0/dist/commands/theme/deploy.ts)_

## `shopkeeper theme get`

```
USAGE
  $ shopkeeper theme get
```

_See code: [dist/commands/theme/get.ts](https://github.com/TheBeyondGroup/shopkeeper/blob/v1.0.0/dist/commands/theme/get.ts)_

## `shopkeeper theme settings backup`

```
USAGE
  $ shopkeeper theme settings backup
```

_See code: [dist/commands/theme/settings/backup.ts](https://github.com/TheBeyondGroup/shopkeeper/blob/v1.0.0/dist/commands/theme/settings/backup.ts)_

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
  --no-color                 Disable color output.
  --password=<value>         Password generated from the Theme Access app.
  --path=<value>             [default: /Users/jeff/Beyond/shopkeeper@1] The path to your theme directory.
  --verbose                  Increase the verbosity of the logs.

DESCRIPTION
  Download settings from live theme.
```

_See code: [dist/commands/theme/settings/download.ts](https://github.com/TheBeyondGroup/shopkeeper/blob/v1.0.0/dist/commands/theme/settings/download.ts)_
