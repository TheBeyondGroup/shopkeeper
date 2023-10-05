# Release

## Prep

Ensure `GITHUB_TOKEN` is set on the environment.

## Making the Release

Update version number in `package.json` and run:

```console
yarn prepack
```
This will update `oclif.manifest.json` which holds the version number used
displayed when `--version` is run.

Open a PR and commit these changes. Merge the PR.

```console
yarn publish
```

When prompted provide the same version number as above.

Open the browser when prompted and login to `npm`.

Then, add a tag and push it up.

```console
git tag <version>
git push --tags

```

Create GitHub Release with the version number as title and autogenerate the
changelog.
