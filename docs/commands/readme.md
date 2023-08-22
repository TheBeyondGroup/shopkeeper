# Commands
<!-- commands -->
* [`shopkeeper bucket create`](#shopkeeper-bucket-create)
* [`shopkeeper bucket current`](#shopkeeper-bucket-current)
* [`shopkeeper bucket init`](#shopkeeper-bucket-init)
* [`shopkeeper bucket restore [BUCKET]`](#shopkeeper-bucket-restore-bucket)
* [`shopkeeper bucket save [BUCKET]`](#shopkeeper-bucket-save-bucket)
* [`shopkeeper bucket switch [BUCKET]`](#shopkeeper-bucket-switch-bucket)
* [`shopkeeper help [COMMANDS]`](#shopkeeper-help-commands)
* [`shopkeeper plugins`](#shopkeeper-plugins)
* [`shopkeeper plugins:install PLUGIN...`](#shopkeeper-pluginsinstall-plugin)
* [`shopkeeper plugins:inspect PLUGIN...`](#shopkeeper-pluginsinspect-plugin)
* [`shopkeeper plugins:install PLUGIN...`](#shopkeeper-pluginsinstall-plugin-1)
* [`shopkeeper plugins:link PLUGIN`](#shopkeeper-pluginslink-plugin)
* [`shopkeeper plugins:uninstall PLUGIN...`](#shopkeeper-pluginsuninstall-plugin)
* [`shopkeeper plugins:uninstall PLUGIN...`](#shopkeeper-pluginsuninstall-plugin-1)
* [`shopkeeper plugins:uninstall PLUGIN...`](#shopkeeper-pluginsuninstall-plugin-2)
* [`shopkeeper plugins update`](#shopkeeper-plugins-update)
* [`shopkeeper theme deploy`](#shopkeeper-theme-deploy)
* [`shopkeeper theme settings download`](#shopkeeper-theme-settings-download)

## `shopkeeper bucket create`

Create a bucket in .shopkeeper

```
USAGE
  $ shopkeeper bucket create [--no-color] [--verbose]

FLAGS
  --no-color  Disable color output.
  --verbose   Increase the verbosity of the logs.

DESCRIPTION
  Create a bucket in .shopkeeper
```

_See code: [dist/commands/bucket/create.ts](https://github.com/TheBeyondGroup/shopkeeper/blob/v1.0.0/dist/commands/bucket/create.ts)_

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

_See code: [dist/commands/bucket/current.ts](https://github.com/TheBeyondGroup/shopkeeper/blob/v1.0.0/dist/commands/bucket/current.ts)_

## `shopkeeper bucket init`

Initialize .shopkeeper directory in the current directory

```
USAGE
  $ shopkeeper bucket init [--no-color] [--verbose]

FLAGS
  --no-color  Disable color output.
  --verbose   Increase the verbosity of the logs.

DESCRIPTION
  Initialize .shopkeeper directory in the current directory
```

_See code: [dist/commands/bucket/init.ts](https://github.com/TheBeyondGroup/shopkeeper/blob/v1.0.0/dist/commands/bucket/init.ts)_

## `shopkeeper bucket restore [BUCKET]`

Restores the theme settings from the specified bucket

```
USAGE
  $ shopkeeper bucket restore [BUCKET] [--no-color] [--verbose] [--path <value>] [-e <value>] [-n]

ARGUMENTS
  BUCKET  The bucket you want to restore your settings from.

FLAGS
  -e, --environment=<value>  The environment to apply to the current command.
  -n, --nodelete             Runs the restore command without removing the theme's JSON settings.
  --no-color                 Disable color output.
  --path=<value>             [default: .] The path to your theme directory.
  --verbose                  Increase the verbosity of the logs.

DESCRIPTION
  Restores the theme settings from the specified bucket
```

_See code: [dist/commands/bucket/restore.ts](https://github.com/TheBeyondGroup/shopkeeper/blob/v1.0.0/dist/commands/bucket/restore.ts)_

## `shopkeeper bucket save [BUCKET]`

Saves the current theme settings to the specified bucket

```
USAGE
  $ shopkeeper bucket save [BUCKET] [--no-color] [--verbose] [--path <value>] [-e <value>] [-n]

ARGUMENTS
  BUCKET  The bucket where you want to save your settings.

FLAGS
  -e, --environment=<value>  The environment to apply to the current command.
  -n, --nodelete             Runs the save command without deleting the bucket's contents.
  --no-color                 Disable color output.
  --path=<value>             [default: .] The path to your theme directory.
  --verbose                  Increase the verbosity of the logs.

DESCRIPTION
  Saves the current theme settings to the specified bucket
```

_See code: [dist/commands/bucket/save.ts](https://github.com/TheBeyondGroup/shopkeeper/blob/v1.0.0/dist/commands/bucket/save.ts)_

## `shopkeeper bucket switch [BUCKET]`

Switches the current bucket by copying settings and .env

```
USAGE
  $ shopkeeper bucket switch [BUCKET] [--no-color] [--verbose] [--path <value>] [-e <value>] [-n]

ARGUMENTS
  BUCKET  The bucket to switch to

FLAGS
  -e, --environment=<value>  The environment to apply to the current command.
  -n, --nodelete             Runs the restore command without removing the theme's JSON settings.
  --no-color                 Disable color output.
  --path=<value>             [default: .] The path to your theme directory.
  --verbose                  Increase the verbosity of the logs.

DESCRIPTION
  Switches the current bucket by copying settings and .env
```

_See code: [dist/commands/bucket/switch.ts](https://github.com/TheBeyondGroup/shopkeeper/blob/v1.0.0/dist/commands/bucket/switch.ts)_

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

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v5.2.1/src/commands/help.ts)_

## `shopkeeper plugins`

List installed plugins.

```
USAGE
  $ shopkeeper plugins [--core]

FLAGS
  --core  Show core plugins.

DESCRIPTION
  List installed plugins.

EXAMPLES
  $ shopkeeper plugins
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v2.4.7/src/commands/plugins/index.ts)_

## `shopkeeper plugins:install PLUGIN...`

Installs a plugin into the CLI.

```
USAGE
  $ shopkeeper plugins:install PLUGIN...

ARGUMENTS
  PLUGIN  Plugin to install.

FLAGS
  -f, --force    Run yarn install with force flag.
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Installs a plugin into the CLI.
  Can be installed from npm or a git url.

  Installation of a user-installed plugin will override a core plugin.

  e.g. If you have a core plugin that has a 'hello' command, installing a user-installed plugin with a 'hello' command
  will override the core plugin implementation. This is useful if a user needs to update core plugin functionality in
  the CLI without the need to patch and update the whole CLI.


ALIASES
  $ shopkeeper plugins add

EXAMPLES
  $ shopkeeper plugins:install myplugin 

  $ shopkeeper plugins:install https://github.com/someuser/someplugin

  $ shopkeeper plugins:install someuser/someplugin
```

## `shopkeeper plugins:inspect PLUGIN...`

Displays installation properties of a plugin.

```
USAGE
  $ shopkeeper plugins:inspect PLUGIN...

ARGUMENTS
  PLUGIN  [default: .] Plugin to inspect.

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Displays installation properties of a plugin.

EXAMPLES
  $ shopkeeper plugins:inspect myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v2.4.7/src/commands/plugins/inspect.ts)_

## `shopkeeper plugins:install PLUGIN...`

Installs a plugin into the CLI.

```
USAGE
  $ shopkeeper plugins:install PLUGIN...

ARGUMENTS
  PLUGIN  Plugin to install.

FLAGS
  -f, --force    Run yarn install with force flag.
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Installs a plugin into the CLI.
  Can be installed from npm or a git url.

  Installation of a user-installed plugin will override a core plugin.

  e.g. If you have a core plugin that has a 'hello' command, installing a user-installed plugin with a 'hello' command
  will override the core plugin implementation. This is useful if a user needs to update core plugin functionality in
  the CLI without the need to patch and update the whole CLI.


ALIASES
  $ shopkeeper plugins add

EXAMPLES
  $ shopkeeper plugins:install myplugin 

  $ shopkeeper plugins:install https://github.com/someuser/someplugin

  $ shopkeeper plugins:install someuser/someplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v2.4.7/src/commands/plugins/install.ts)_

## `shopkeeper plugins:link PLUGIN`

Links a plugin into the CLI for development.

```
USAGE
  $ shopkeeper plugins:link PLUGIN

ARGUMENTS
  PATH  [default: .] path to plugin

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Links a plugin into the CLI for development.
  Installation of a linked plugin will override a user-installed or core plugin.

  e.g. If you have a user-installed or core plugin that has a 'hello' command, installing a linked plugin with a 'hello'
  command will override the user-installed or core plugin implementation. This is useful for development work.


EXAMPLES
  $ shopkeeper plugins:link myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v2.4.7/src/commands/plugins/link.ts)_

## `shopkeeper plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ shopkeeper plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ shopkeeper plugins unlink
  $ shopkeeper plugins remove
```

## `shopkeeper plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ shopkeeper plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ shopkeeper plugins unlink
  $ shopkeeper plugins remove
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v2.4.7/src/commands/plugins/uninstall.ts)_

## `shopkeeper plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ shopkeeper plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ shopkeeper plugins unlink
  $ shopkeeper plugins remove
```

## `shopkeeper plugins update`

Update installed plugins.

```
USAGE
  $ shopkeeper plugins update [-h] [-v]

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Update installed plugins.
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v2.4.7/src/commands/plugins/update.ts)_

## `shopkeeper theme deploy`

Deploy theme source to store

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
  --path=<value>             [default: .] The path to your theme directory.
  --verbose                  Increase the verbosity of the logs.

DESCRIPTION
  Deploy theme source to store
```

_See code: [dist/commands/theme/deploy.ts](https://github.com/TheBeyondGroup/shopkeeper/blob/v1.0.0/dist/commands/theme/deploy.ts)_

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
  --path=<value>             [default: .] The path to your theme directory.
  --verbose                  Increase the verbosity of the logs.

DESCRIPTION
  Download settings from live theme.
```

_See code: [dist/commands/theme/settings/download.ts](https://github.com/TheBeyondGroup/shopkeeper/blob/v1.0.0/dist/commands/theme/settings/download.ts)_
<!-- commandsstop -->
