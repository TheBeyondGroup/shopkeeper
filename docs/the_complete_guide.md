# The Complete Guide to Shopkeeper

Like all good tales, we must begin with a call to adventure. The adventure of
Shopkeeper begins with [The Beyond Group](https://thebeyondgroup.com) needing
to maintain three expansions stores using a single theme and wanting to use a
build system to support the development of a theme for a client.

Unfortunately, the Shopify GitHub integration doesn't work in this case. It
expects a single usage of a theme to be represented by a single repo. It will
automatically open PRs as customizations are made and there is no way to
separate a theme's data from its files. 

We want to use a single theme and repo for all three expansion stores to
reduce development effort. We only want a store's settings to differ. We also
want a development workflow that parallels something you might use when doing
custom full-stack web development. We want to open PRs for changes, have
preview environments created and updated automatically with each commit pushed,
and for preview environments to be cleaned up once PRs are merged.

The [Shopify CLI](https://shopify.dev/docs/themes/tools/cli/) provides a
wonderful set of primitive commands to interact with a single store and a
single theme. With this foundation, we can build a workflow and more
sophisticated commands to solve the problem we have just described.

We decided to use GitHub Actions for CI/CD and to build Shopkeeper to encapsulate
the common operations the workflow above would require.

The first step to build this workflow is to establish a way to manage theme
settings. Theme settings are important because they are the data that defines
how a storefront looks. Mess them up and the storefront is broken. How to sync
settings from the live theme to a new theme is something that theme developers
have to consider as they work. 

## Manage Settings
To manage theme settings we create buckets of settings. These buckets of settings
are kept in a `.shopkeeper` directory in the root of your project.

Run `shopkeeper bucket init` to create this directory. To add a `production`
bucket, run `shopkeeper bucket create --bucket production`.

```console
.shopkeeper
├── production
│   ├── config
│   ├── sections
│   ├── templates
│   ├── .env
│   └── .env.sample
└── .current-bucket
```

Each folder in the bucket refers to the corresponding folders in the theme
directory structure where a `.json` file might be found.

To learn the tool, let's build a sample project. We create a directory called
`client-theme`, we can bootstrap a theme project using
[Dawn](https://github.com/shopify/dawn):

```console
mkdir client-theme
cd client-theme
npm init
npm install --save-dev @thebeyondgroup/shopkeeper
npx shopify theme init --path theme
cd theme
rm -rf .git # theme init clones the Dawn repo. We'll create our git repo at our project root
cd ..
git init
```

We add a `package.json` file and add the CLI tools we'll use. By installing
Shopkeeper this way, it automatically installs itself as Shopify CLI plugin and
we can run the Shopkeeper commands via the `shopify` executable. We create the
theme files in subdirectory named `theme`. You could name it something else if
you prefer. Just be sure to use that name whenever a command requires a path.

Next, we initialize Shopkeeper and create a bucket to hold our production
settings:

```console
npx shopify bucket init
npx shopify bucket create --bucket production
```
We also install [direnv](https://direnv.net) in our shell so our environment
variables are updated anytime we update our `.env` file.

Run the following to configure `direnv`:

```console
echo "dotenv .env" > .envrc
direnv allow
```

Why we do this will be come clear in the next steps. Our final bit of setup is
to edit `.shopkeeper/production/.env` to contain:

```console
SHOPIFY_CLI_THEME_TOKEN="<your theme access password>"
SHOPIFY_FLAG_STORE="<your store url>"
SHOPIFY_FLAG_PATH="theme"
```

By setting these variables, we can omit them when calling CLI commands. Shopify CLI flags have
a corresponding environment variable. If you set it, it provides the value to
the flag and you don't need to pass the flag.

Assuming we have the correct store URL and password, we can now run:

```console
shopify bucket switch --bucket production --nodelete
```

This copies the `.env` from `.shopkeeper/production` into our project
directory, which `direnv` reloads. We pass the `--nodelete` command so we don't
clobber the settings currently in the repo. `bucket switch` also copies the
bucket's `.env` to the root of the project. With `direnv` installed, our
environment is updated to have our store's URL and password. Now, we can pull
down the latest settings from our live theme:

```console
shopify theme settings download
```
This pulls down the latest settings into `theme`. We can then store these in
our `production` bucket by running:

```console
shopify bucket save --bucket production
```

We add the following lines to our project's `.gitignore`:

```gitconfig
# Shopkeeper #
##########
.shopkeeper/**/**/.env
.shopkeeper/.current-bucket
.env

# Theme #
##########
theme/assets
theme/config/settings_data.json
theme/templates/**/*.json
theme/sections/*.json
```

Adding this config makes only the settings in `.shopkeeper` trackable by `git`.
It decouples the theme settings data from the theme code. Doing so makes the bucket the
source of truth for settings &mdash; a key requirement when automating
deployments to multiple stores.

Let's look at a couple more commands before combining these tools with GitHub Actions.

To switch between buckets, run:

```console
shopify bucket switch --bucket <bucket name>
```

Sometimes you'll want to update the settings in `theme` to those in a bucket.
To do that, run:

```console
shopify bucket restore --bucket <bucket name>
```

Each of `bucket save`, `bucket restore`, and `bucket switch` can be passed a
`--nodelete` flag. When you pass this flag settings files at the destination
are not removed first. Files from the source are added and pre-existing files
are overwritten with the file at the source.

With this knowledge, let's see how to use Shopkeeper to build CI/CD for themes.

## Deployment

Shopkeeper makes it straightforward to set up CI/CD using GitHub Actions. The
same pattern can be adapted to other source code management systems like
Bitbucket and GitLab.

Let's begin with running deployments locally and then we'll apply these
concepts to GitHub Actions.

As a Shopify theme developer, you are likely familiar with using `shopify push`
to upload code to a theme. It's a low-level command that doesn't take settings
into account.

Shopkeeper supports multiple deployment strategies:

* Basic
* Blue/Green

By default, Shopkeeper assumes you want to use a [blue/green deployment
strategy](https://en.wikipedia.org/wiki/Blue–green_deployment). A blue/green
deployment strategy in the context of Shopify theme development
means alternating between a blue and a green theme. One theme is live and the
other we refer to as on-deck. For example, using this approach, if the blue
:large_blue_circle: theme is live, the green :green_circle: theme is on-deck.
When updates are to be made to a storefront, the on-deck receives the changes
and when it is ready, it is published.

The advantage of a using a blue/green strategy is that you won't end up with a
proliferation of themes in the admin. You will need just two themes. While
Shopify Plus stores can have many unpublished themes, without some organization
it's easy to lose track of what changes are contained in each theme.

To setup your project for blue/green deployments, we need to create a second
theme. In this example, we'll designate the live theme as blue and this new
theme as green.

```console
shopify theme push --unpublished --theme green
```

We'll list the themes on our store using:

```console
shopify theme list
```

Take note of the IDs for the live :large_blue_circle: theme and our newly
created `green` :green_circle: theme. Next, we'll add these two IDs to our
`.env` in `.shopkeeper/production`:

```console
SHOPIFY_CLI_THEME_TOKEN="<your theme access password>"
SHOPIFY_FLAG_STORE="<your store url>"
SHOPIFY_FLAG_PATH="theme"
SKR_FLAG_GREEN_THEME_ID=<green id>
SKR_FLAG_BLUE_THEME_ID=<blue id>
```

By setting these envronment variables we eliminate our need to pass the
`--green` and `--blue` flags each time we run `shopify theme deploy`. Also, by
putting these values in our `.env`, our development context is updated when we
switch buckets.

When you run `shopkeeper theme deploy`, Shopkeeper will:

1. Download settings from the live theme
2. Push code to the on-deck theme
3. Rename the on-deck theme to be `[<HEAD_SHA>] Production - <color>`

Don't worry about updating the name of the live theme. It will be updated when
it becomes the on-deck theme. Also, note this command does not automatically
publish the on-deck theme. Quite often you'll want to take a moment to run
final checks before publishing the theme.

When you're ready, you can publish the on-deck theme by running:

```console
shopify theme publish --theme $SKR_FLAG_<color>_THEME_ID
```
You can also publish it from the admin.

And now for the grand finale. It's time to bring in the robots. :robot:

### CI/CD with GitHub Actions

Shopkeeper is a handy when used locally. Where it really shines :sparkles:
is when used in combination with [GitHub Actions](https://docs.github.com/en/actions).

To automate your workflow with GitHub Actions, the following workflows are needed:
| Workflow   | Purpose    |
|--------------- | --------------- |
| [Blue/Green Deploy](#automate-bluegreen-deploys)   | On merge to `main`, deploy code to on-deck theme |
| [Backup Theme Settings](#backup-theme-settings) | On a set interval, create PRs for theme settings |
| [Generate Preview Theme](#generate-preview-theme) | When a branch receives a push, create/update a preview theme |
| [Delete Preview Theme](#delete-preview-theme) | When a PR is closed, delete the preview theme |

This next sections assumes a working knowledge of GitHub Actions. Also, each of these workflows assumes you have
a `build:prod` script in your `package.json` that takes care of prepare `theme` for deployment.

#### Automate Blue/Green Deploys

Let's start with automating our blue/green deploys. 

In `.github/workflows/blue-green.yml`, write:

```yaml
name: Shopify Blue/Green Deploy

# Controls when the action will run.
# Triggers the workflow on push or pull request events but only for the master branch
on:
  push:
    branches: [main]

  # Allows you to run this workflow manually from the Actions tab
  workflow_dispatch:

jobs:
  deploy:
    # The type of runner that the job will run on
    runs-on: ubuntu-latest
    env:
      SHOPIFY_CLI_THEME_TOKEN: ${{ secrets.SHOPIFY_CLI_THEME_TOKEN }}
      SHOPIFY_FLAG_STORE: ${{ vars.SHOPIFY_FLAG_STORE }}
      SHOPIFY_FLAG_PATH: ${{ vars.SHOPIFY_FLAG_PATH }}
      SKR_FLAG_BLUE_THEME_ID: ${{ secrets.SKR_FLAG_BLUE_THEME_ID }}
      SKR_FLAG_GREEN_THEME_ID: ${{ secrets.SKR_FLAG_GREEN_THEME_ID }}
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v3
        with:
          node-version: "19"
          cache: "yarn"
      - uses: ruby/setup-ruby@v1
        with:
          ruby-version: 3.2
          bundler: 'latest'
      - name: Install packages
        run: yarn install
      - name: Select theme settings
        run: npx shopify bucket restore --bucket production
      - name: Build assets
        run: yarn build:prod
      - name: Deploy to on deck theme
        uses: nick-fields/retry@v2
        with:
          timeout_minutes: 10
          max_attempts: 3
          retry_on: error
          command: npx shopify theme deploy
```

When a PR is merged to `main`, a commit is added and this workflow is
triggered. It build the theme and then deploys it to the on-deck theme.

#### Backup Theme Settings

In `.github/workflows/backup-theme-settings.yml`, write:

```yaml
name: Backup Theme Settings

on:
  schedule: # run the settings backup every hour
    - cron: "0 */1 * * *"
  workflow_dispatch:

jobs:
  backup:
    runs-on: ubuntu-latest
    env:
      SHOPIFY_CLI_THEME_TOKEN: ${{ secrets.SHOPIFY_CLI_THEME_TOKEN }}
      SHOPIFY_FLAG_STORE: ${{ vars.SHOPIFY_FLAG_STORE }}
      SHOPIFY_FLAG_PATH: ${{ vars.SHOPIFY_FLAG_PATH }}
      GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
      SETTINGS_APPROVER: ${{ secrets.SETTINGS_APPROVER }}
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v3
        with:
          node-version: "19"
          cache: "yarn"
      - uses: ruby/setup-ruby@v1
        with:
          ruby-version: 3.2
          bundler: 'latest'
      - name: Install packages
        run: yarn install
      - name: Download published theme settings
        run: npx shopify theme settings download
      - name: Store the settings
        run: npx shopify bucket save --bucket production
      - name: Set up up git user
        run: |
          # Setup username and email
          git config user.name "GitHub Actions Bot"
          git config user.email "ops@thebeyondgroup.la"
      - name: Store datetime
        run: echo "NOW=$(date +"%Y-%m-%d-%H")" >> $GITHUB_ENV
      - name: Store branch name
        run: echo "NEW_BRANCH=github-action/settings-$NOW" >> $GITHUB_ENV
      - name: Create PR
        run: |
          if [[ -z $(git status -s) ]]
          then
            echo "No changes. Nothing to commit"
          else
            gh label create settings-update --force
            git checkout -b $NEW_BRANCH
            git add .
            git commit -m "Update theme settings as of $NOW"
            git push origin  $NEW_BRANCH
            gh pr create --title "Update theme settings as of $NOW" --body "Update to latest theme settings"--label settings-update
            # We can't approve the PR with same token that created it.
            OLD_GITHUB_TOKEN=$GITHUB_TOKEN
            GITHUB_TOKEN=$SETTINGS_APPROVER
            gh pr review --approve
            GITHUB_TOKEN=$OLD_GITHUB_TOKEN
            gh pr merge --merge
          fi
```

To back up theme settings, we need to know when any theme settings file
changes. To keep things simple, we use a scheduled job to run every hour to
pull down the settings and attempt to make a commit. We make the commit using
[gh](https://cli.github.com/). We can't approve the PR using the same user that
created it, so we add a secret `SETTINGS_APPROVER` with a PAT with permissions
to approve the PR.

#### Generate Preview Theme

In `.github/workflows/generate-preview-theme.yml`, write:

```yaml
name: Generate Preview

on:
  pull_request:
    types:
      - reopened
    branches-ignore:
      - "github-action/**"
  push:
    branches-ignore:
      - "master"
      - "github-action/**"

  workflow_dispatch:

jobs:
  preview:
    runs-on: ubuntu-latest
    env:
      SHOPIFY_CLI_THEME_TOKEN: ${{ secrets.SHOPIFY_CLI_THEME_TOKEN }}
      SHOPIFY_FLAG_STORE: ${{ vars.SHOPIFY_FLAG_STORE }}
      SHOPIFY_FLAG_PATH: ${{ vars.SHOPIFY_FLAG_PATH }}
    steps:
      - uses: actions/checkout@v4
      - uses: rlespinasse/github-slug-action@v4
        with:
          slug-maxlength: 50 # Shopify preview environment name cannot be more than 50 chars
      - uses: actions/setup-node@v3
        with:
          node-version: "19"
          cache: "yarn"
      - uses: ruby/setup-ruby@v1
        with:
          ruby-version: 3.2
          bundler: 'latest'
      - uses: 8BitJonny/gh-get-current-pr@2.2.0
        id: pr_status
        with:
          # Verbose setting SHA when using Pull_Request event trigger
          sha: ${{ github.event.pull_request.head.sha }}
          # Only return if PR is still open. (By default it returns PRs in any state.)
          filterOutClosed: true
          # Only return if PR is not in draft state. (By default it returns PRs in any state.)
          filterOutDraft: true
      - name: Install packages
        run: yarn install
      - name: Select theme settings
        run: npx shopify bucket restore --bucket production
      - name: Build assets
        run: yarn build:prod
      - name: Create theme
        uses: nick-fields/retry@v2
        with:
          timeout_minutes: 10
          max_attempts: 3
          retry_on: error
          command: npx shopify theme create --theme ${{ env.GITHUB_REF_NAME_SLUG_URL }}
      - name: Get theme ID
        run: echo "THEME_ID=$(npx shopify theme get --theme ${{ env.GITHUB_REF_NAME_SLUG_URL }})" >> $GITHUB_ENV
      - name: Add preview link to PR
        if: steps.pr_status.outputs.pr_found == 'true'
        uses: unsplash/comment-on-pr@master
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          msg: |
           **Preview:** [Storefront](https://${{ vars.SHOPIFY_FLAG_STORE }}?preview_theme_id=${{ env.THEME_ID }}) | [Admin](https://${{ vars.SHOPIFY_FLAG_STORE }}/admin/themes/${{ env.THEME_ID }}/editor)
          delete_prev_regex_msg: "Preview:" # OPTIONAL
```
To generate a preview theme, we listen to pushes on any branch other than `main`
and ones starting with `github-action/`. Branches starting with `github-action/`
are used for settings commits. We restore the theme settings from our
`production` bucket, build the theme, and push it to Shopify.

> :warning: We use a special `theme create` command that's provided by Shopkeeper that ensures theme
> creation is idempotent. You can't guarantee the order your workflows will run,
> so we need to make sure that an update is created no matter if it already
> exists.`theme push --unpublished` is not idempotent and will add many themes of
> the same name, so it cannot be used.

When a PR is opened, we generate a comment on the PR with a link to the preview
theme on Shopify. 

#### Delete Preview Theme

In `.github/workflows/delete-preview-theme.yml`, write:

```yaml
name: Delete Preview Theme

on:
  pull_request:
    types: [closed]
    branches-ignore: ["github-action/**"]

jobs:
  delete:
    runs-on: ubuntu-latest
    env:
      SHOPIFY_CLI_THEME_TOKEN: ${{ secrets.SHOPIFY_CLI_THEME_TOKEN }}
      SHOPIFY_FLAG_STORE: ${{ secrets.SHOPIFY_FLAG_STORE }}
    steps:
      - uses: actions/checkout@v4
      - uses: rlespinasse/github-slug-action@v4
        with:
          slug-maxlength: 50 # Shopify preview environment name cannot be more than 50 chars
      - uses: actions/setup-node@v3
        with:
          node-version: "19"
          cache: "yarn"
      - uses: ruby/setup-ruby@v1
        with:
          ruby-version: 3.2
          bundler: 'latest'
      - name: Install packages
        run: yarn install
      - name: Delete theme
        run: npx shopify theme delete --theme ${{ env.GITHUB_REF_NAME_SLUG_URL }} --force
```
Latest but not least, we clean up after ourselves. When a PR is closed, we
delete the theme corresponding to its branch.

## Conclusion

We started our tale with a problem of three stores and one theme. We grew, we
learned and the outcome is a comfy, cozy Shopify theme development workflow.

To recap, Shopkeeper is a Shopify CLI plugin that augments the theme commands
it provides. It provides an opinionated, conventional way to handle theme
settings. It provides settings-aware ways to deploy themes.
