# Shopkeeper CLI

This is a description of the commands provided by `shopkeeper `. 

## Philosophy

Shopkeeper is inspired by [`hub`](https://github.com/github/hub), which augments
`git` with GitHub specific functionality.

We are working towards a CLI that will allow you to use Shopkeeper as your 
primary tool for interacting with Shopify themes.

Shopkeeper's approach and commands embody the approach we at The Beyond Group
use to build and deploy themes. You might want to do something in a different way
than us and we're open to extensions that extend and enhance our defaults.

Also, like all software, there are refinements that can be done to this CLI.
We're open to quality of life improvements like error handling, documentation,
and shell output. The foundation has been laid. Let's build!

## Comands

The following is a description of the commands available in `shopkeeper`.
Commands are organized into namespaces (ex. `theme` or `settings`) and each
scenario the command supports is enumerated below.

We ultimately want to support the same configuration precendence as `themekit`.
For now, however, there will be gaps as we implement only enough of the commands
to meet the needs of our GitHub Actions. For now, the commands will depend on
the environment variables `PROD_STORE_URL` and `PROD_PASSWORD`.


### Settings
**`shopkeeper theme deploy`**

```
shopkeeper theme deploy
```
Called without flags, this command completes a blue/green deploy of the current
working directory. A blue/green deploy consists of:

1. Downloads the published theme's settings
2. Determines the ondeck theme
3. Uploads the current working directory to the on deck theme

The command requires the `config.yml` to have the environments `production-blue`
and `production-green` defined.

```
shopkeeper theme deploy --staging
```
Called with the flag `--staging`, this command completes a blue/green deploy of
the current working directory and also deploys to the theme named `staging` in
the theme's `config.yml`.

**`shopkeeper theme rollback` (FUTURE)**

```
shopkeeper theme rollback
```
Called without flags, this command rolls back to the previously published theme.
If blue is published, it publishes green. If green is published, it publishes
blue. The settings of theme rolled back to are not modified.

```
shopkeeper theme rollback --with-settings
```
Called without flags, this command rolls back to the previously published theme.
If blue is published, it publishes green. If green is published, it publishes
blue. Before publishing, the theme settings from the published theme are copied
to the rollback theme.

**`shopkeeper settings download`**

```
shopkeeper settings download
```
Called without flags, this command downloads the settings from the store's published
theme to the theme in the current working directory.

**`shopkeeper settings upload`**

Called without flags, this command uploads the settings from the theme in the current working directory.

**`shopkeeper settings sync` (FUTURE)**

### Publish
**`shopkeeper theme publish`**

```
shopkeeper theme publish
```
Called without flags, this command publishes the on deck theme. If the blue theme is published, this command will publish the green theme. The opposite is true.

```
shopkeeper theme publish --theme-id 123123
```
Called with the flag, `--theme-id`, this command publishes the theme with the given id. If the id is not present, a message is shown. If publishing is successful, a message is shown indicating success.

### Delete
**`shopkeeper theme delete`**

```
shopkeeper theme delete
```
Called without flags, this command fails with status code 1.

```
shopkeeper theme delete --theme-id 12343434
```
Called with the flag `--theme-id <shopify theme id>`, this command requests
confirmation and deletes the theme with the passed id. If the theme id is
currently live, the command will fail with an error message.

```
shopkeeper theme delete --theme-id 12343434 --force
```
Called with the flags `--theme-id <shopify theme id> --force`, this command
deletes the theme with the passed id without asking for confirmation. If the
theme id is currently live, the command will fail with an error message.

### Create
**`shopkeeper theme create`**

Called without flags, this commands fails with status code 1.

```
shopkeeper theme create --name "author/feature-branch-name"
```
Called with the flag `--name`, this command downloads the theme settings from the
live theme, creates a new theme on shopify with the passed in name, and uploads the current working directory.

### Create
**`shopkeeper theme get-id`**

Called without flags, this commands fails with status code 1.

```
shopkeeper theme get-id --name "author/feature-branch-name"
```
Called with the flag `--name`, this command returns the id of the theme. If a theme
with the passed name cannot be found, this command fails with status code 1.

### `themekit`

`themekit` delegates all commands and options to themekit

`shopkeeper themekit <any args or commands that themekit provides>`

### Other notes
Settings Sync
There are scenarios where we want to merge the settings from a source environment into those found in the destination. We don't want to naively overwrrite the destination's settings.

1. Download the destination's settings to the local machine
2. Download the source's settings to the local machine
3. Generate a diff
4. If the diff is acceptable, upload to destination
5. If the merge needs to be reconciled, manage the diff with git (or visual git tools)
    * `git add --patch` or `git add -interactive` are both options for handling this merge
    ```
    import { spawn } from 'child_process';
    spawn("git", ["add", "--patch"], {stdio: 'inherit'});
    ```

5. If the diff is not acceptable, rollback the local settings to what's in the repository
