# Product Requirements Document: History Deployment Strategy

## Introduction/Overview

The history deployment strategy is a new deployment option for the Shopkeeper CLI that maintains a rolling history of theme deployments to enable easy point-in-time rollbacks. Unlike the existing basic and blue-green strategies, the history strategy creates a new theme for each deployment while automatically managing cleanup of older themes based on a configurable retention limit.

This feature solves the problem of needing to rollback to a specific point in time when issues are discovered in production, providing developers with a safety net and deployment confidence.

## Goals

1. Enable point-in-time rollbacks by maintaining a history of deployed themes
2. Automatically manage theme cleanup to prevent store clutter
3. Provide configurable retention limits via flag and environment variable
4. Integrate seamlessly with existing deployment workflow
5. Maintain compatibility with existing publish behavior

## User Stories

1. **As a developer**, I want to deploy my theme with history tracking so that I can easily rollback if issues are discovered in production.

2. **As a team lead**, I want to configure how many historical themes are retained so that I can balance rollback capability with store organization.

3. **As a developer**, I want to see clear timestamps in theme names so that I can identify when each deployment was made.

4. **As a developer**, I want automatic cleanup of old themes so that my store doesn't get cluttered with too many historical versions.

5. **As a developer**, I want the history strategy to respect the publish flag so that I can control when themes go live.

## Functional Requirements

1. The system must support a new deployment strategy called "history" that can be specified via the `--strategy history` flag.

2. The system must create a new theme for each deployment with the naming convention: `[GIT_SHA] DD-MM-YYYY-timestamp` where timestamp is UTC seconds since epoch.

3. The system must support a `--theme-count` flag to specify the maximum number of history themes to retain.

4. The system must support a `SKR_HISTORY_THEME_COUNT` environment variable to specify the default maximum number of history themes to retain.

5. The system must use a default retention limit of 10 themes when neither flag nor environment variable is specified.

6. The system must identify history themes by their naming convention pattern and only manage themes that match this pattern.

7. The system must delete the oldest history themes first when the retention limit is exceeded, based on the timestamp in the theme name.

8. The system must respect the `--publish` flag behavior - only publishing the newly deployed theme if the flag is set.

9. The system must retry theme deletion operations up to 3 times before reporting failure and continuing with the deployment.

10. The system must report the results of theme cleanup operations, including any failed deletions.

11. The system must pull live theme settings before deploying, consistent with other strategies.

12. The system must use the same git commit hash format (8 characters) as existing strategies.

## Non-Goals (Out of Scope)

1. This feature will not provide a rollback command - it only maintains the theme history for manual rollback.
2. This feature will not manage themes created by other deployment strategies or manually created themes.
3. This feature will not provide theme comparison or diff functionality.
4. This feature will not automatically rollback based on performance metrics or error rates.
5. This feature will not provide a UI for browsing historical themes.

## Design Considerations

The implementation should follow the existing pattern in `deploy.ts` with a new function `historyDeploy(flags: DeployFlags)` that:
- Follows the same structure as `blueGreenDeploy` and `basicDeploy`
- Uses existing utilities from the theme service where possible
- Integrates with the switch statement in the main `deploy` function

Theme name parsing should be robust to handle edge cases where themes might have similar but not identical naming patterns.

## Technical Considerations

1. **Theme API Integration**: Should use existing `themeCreate`, `themeUpdate`, and `themeDelete` functions from the Shopify CLI kit.

2. **Git Integration**: Should reuse the existing `gitHeadHash()` function for consistency.

3. **Error Handling**: Should implement retry logic with exponential backoff for theme deletions.

4. **Theme Filtering**: Need to implement reliable pattern matching to identify history themes vs other themes.

5. **Date Parsing**: Need to parse timestamps from theme names to determine deletion order.

6. **Environment Variable**: Should follow existing patterns in the codebase for environment variable handling.

## Success Metrics

1. **Deployment Success Rate**: History deployments should have the same success rate as existing strategies (>99%).

2. **Theme Management**: Cleanup operations should successfully maintain the specified retention limit in >95% of deployments.

3. **Performance**: History deployments should complete within 20% of the time of basic deployments (accounting for cleanup operations).

4. **Error Recovery**: Failed theme deletions should not prevent successful deployment completion.

## Open Questions

1. Should there be a maximum allowable retention limit to prevent accidental misconfiguration?

2. Should the system warn users when the retention limit is set very high (e.g., >50 themes)?

3. Should there be a separate command to manually clean up history themes outside of deployment?

4. How should the system handle timezone considerations for the timestamp display, or is UTC sufficient?

5. Should the system provide verbose logging of which themes are being deleted during cleanup?
