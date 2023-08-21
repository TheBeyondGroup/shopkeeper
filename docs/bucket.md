`shopkeeper bucket`
===================

Create a bucket in .shopkeeper

* [`shopkeeper bucket create`](#shopkeeper-bucket-create)
* [`shopkeeper bucket current`](#shopkeeper-bucket-current)
* [`shopkeeper bucket init`](#shopkeeper-bucket-init)
* [`shopkeeper bucket restore [BUCKET]`](#shopkeeper-bucket-restore-bucket)
* [`shopkeeper bucket save [BUCKET]`](#shopkeeper-bucket-save-bucket)
* [`shopkeeper bucket switch [BUCKET]`](#shopkeeper-bucket-switch-bucket)

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
  --path=<value>             [default: /Users/jeff/Beyond/shopkeeper@1] The path to your theme directory.
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
  --path=<value>             [default: /Users/jeff/Beyond/shopkeeper@1] The path to your theme directory.
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
  --path=<value>             [default: /Users/jeff/Beyond/shopkeeper@1] The path to your theme directory.
  --verbose                  Increase the verbosity of the logs.

DESCRIPTION
  Switches the current bucket by copying settings and .env
```

_See code: [dist/commands/bucket/switch.ts](https://github.com/TheBeyondGroup/shopkeeper/blob/v1.0.0/dist/commands/bucket/switch.ts)_
