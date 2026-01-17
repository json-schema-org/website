# Yarn Lockfile Update Required

## Issue
The CI is failing because `yarn.lock` needs to be updated to match the new `package.json` dependencies.

## Solution
Run the following command to update the lockfile:

```bash
yarn install
```

This will update `yarn.lock` to match the new dependency versions in `package.json`.

## Alternative: Use GitHub Actions
If you can't run yarn locally, you can create a temporary commit that triggers CI, or use a GitHub Actions workflow to update the lockfile.

## Next Steps
1. Run `yarn install` locally (or in CI)
2. Commit the updated `yarn.lock` file
3. Push to the PR branch
4. CI should pass
