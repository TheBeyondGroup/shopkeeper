oclif-hello-world
=================

oclif example Hello World CLI

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/oclif-hello-world.svg)](https://npmjs.org/package/oclif-hello-world)
[![CircleCI](https://circleci.com/gh/oclif/hello-world/tree/main.svg?style=shield)](https://circleci.com/gh/oclif/hello-world/tree/main)
[![Downloads/week](https://img.shields.io/npm/dw/oclif-hello-world.svg)](https://npmjs.org/package/oclif-hello-world)
[![License](https://img.shields.io/npm/l/oclif-hello-world.svg)](https://github.com/oclif/hello-world/blob/main/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g shopkeeper
$ shopkeeper COMMAND
running command...
$ shopkeeper (--version)
shopkeeper/1.0.0 darwin-x64 node-v16.13.2
$ shopkeeper --help [COMMAND]
USAGE
  $ shopkeeper COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`shopkeeper bucket create`](#shopkeeper-bucket-create)
* [`shopkeeper bucket current`](#shopkeeper-bucket-current)
* [`shopkeeper bucket init`](#shopkeeper-bucket-init)
* [`shopkeeper bucket restore`](#shopkeeper-bucket-restore)
* [`shopkeeper bucket save`](#shopkeeper-bucket-save)
* [`shopkeeper bucket switch`](#shopkeeper-bucket-switch)
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
* [`shopkeeper theme get`](#shopkeeper-theme-get)
* [`shopkeeper theme settings backup`](#shopkeeper-theme-settings-backup)
* [`shopkeeper theme settings download`](#shopkeeper-theme-settings-download)

## `shopkeeper bucket create`

```
USAGE
  $ shopkeeper bucket create
```

## `shopkeeper bucket current`

```
USAGE
  $ shopkeeper bucket current
```

## `shopkeeper bucket init`

```
USAGE
  $ shopkeeper bucket init
```

## `shopkeeper bucket restore`

```
USAGE
  $ shopkeeper bucket restore
```

## `shopkeeper bucket save`

```
USAGE
  $ shopkeeper bucket save
```

## `shopkeeper bucket switch`

```
USAGE
  $ shopkeeper bucket switch
```

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

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v5.2.0/src/commands/help.ts)_

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

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v2.2.2/src/commands/plugins/index.ts)_

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

DESCRIPTION
  Displays installation properties of a plugin.

EXAMPLES
  $ shopkeeper plugins:inspect myplugin
```

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

## `shopkeeper theme deploy`

```
USAGE
  $ shopkeeper theme deploy
```

## `shopkeeper theme get`

```
USAGE
  $ shopkeeper theme get
```

## `shopkeeper theme settings backup`

```
USAGE
  $ shopkeeper theme settings backup
```

## `shopkeeper theme settings download`

```
USAGE
  $ shopkeeper theme settings download
```
<!-- commandsstop -->
