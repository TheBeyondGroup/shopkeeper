Shopify is the source of truth

When a PR is opened, we

- restore the production bucket
- build the code
- push the theme

This has the effect of giving the preview theme the code that's in the repo.
Assuming the branch has been rebased recently, the settings will be fresh.

When a PR is merged, we:

- restore the production bucket
- build theme
- download the latest theme settings from live
- push the theme to the destination

This means that the theme on shopify will contain the contents of `shopify`

When settings sync runs, we:

- download the latest theme settings files
- copy settings into the production bucket
