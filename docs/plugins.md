`shopkeeper plugins`
====================

List installed plugins.

* [`shopkeeper plugins`](#shopkeeper-plugins)
* [`shopkeeper plugins:install PLUGIN...`](#shopkeeper-pluginsinstall-plugin)
* [`shopkeeper plugins:inspect PLUGIN...`](#shopkeeper-pluginsinspect-plugin)
* [`shopkeeper plugins:install PLUGIN...`](#shopkeeper-pluginsinstall-plugin-1)
* [`shopkeeper plugins:link PLUGIN`](#shopkeeper-pluginslink-plugin)
* [`shopkeeper plugins:uninstall PLUGIN...`](#shopkeeper-pluginsuninstall-plugin)
* [`shopkeeper plugins:uninstall PLUGIN...`](#shopkeeper-pluginsuninstall-plugin-1)
* [`shopkeeper plugins:uninstall PLUGIN...`](#shopkeeper-pluginsuninstall-plugin-2)
* [`shopkeeper plugins update`](#shopkeeper-plugins-update)

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
