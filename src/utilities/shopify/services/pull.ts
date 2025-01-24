export interface PullFlags {
  /**
   * The directory path to download the theme.
   */
  path?: string

  /**
   * The password for authenticating with the store.
   */
  password?: string

  /**
   * Store URL. It can be the store prefix (example.myshopify.com) or the full myshopify.com URL (https://example.myshopify.com).
   */
  store?: string

  /**
   * Theme ID or name of the remote theme.
   */
  theme?: string

  /**
   * Pull theme files from your remote development theme.
   */
  development?: boolean

  /**
   * Pull theme files from your remote live theme.
   */
  live?: boolean

  /**
   * Runs the pull command without deleting local files.
   */
  nodelete?: boolean

  /**
   * Download only the specified files (Multiple flags allowed).
   */
  only?: string[]

  /**
   * Skip downloading the specified files (Multiple flags allowed).
   */
  ignore?: string[]

  /**
   * Proceed without confirmation, if current directory does not seem to be theme directory.
   */
  force?: boolean

  /**
   * Disable color output.
   */
  noColor?: boolean

  /**
   * Increase the verbosity of the output.
   */
  verbose?: boolean
}
