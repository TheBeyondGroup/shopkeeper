export interface PushFlags {
  /** The path to your theme directory. */
  path?: string

  /** Password generated from the Theme Access app. */
  password?: string

  /** Store URL. It can be the store prefix (example) or the full myshopify.com URL (example.myshopify.com, https://example.myshopify.com). */
  store?: string

  /** Theme ID or name of the remote theme. */
  theme?: string

  /** Push theme files from your remote development theme. */
  development?: boolean

  /** Push theme files from your remote live theme. */
  live?: boolean

  /** Create a new unpublished theme and push to it. */
  unpublished?: boolean

  /** Runs the push command without deleting local files. */
  nodelete?: boolean

  /** Push only the specified files (Multiple flags allowed). */
  only?: string[]

  /** Skip downloading the specified files (Multiple flags allowed). */
  ignore?: string[]

  /** Output JSON instead of a UI. */
  json?: boolean

  /** Allow push to a live theme. */
  allowLive?: boolean

  /** Publish as the live theme after uploading. */
  publish?: boolean

  /** Proceed without confirmation, if current directory does not seem to be theme directory. */
  force?: boolean

  /** Disable color output. */
  noColor?: boolean

  /** Increase the verbosity of the output. */
  verbose?: boolean

  /** Require theme check to pass without errors before pushing. Warnings are allowed. */
  strict?: boolean
}
