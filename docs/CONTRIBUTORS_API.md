# GitHub Contributors API Integration

## Overview

The Community page (`/community`) now fetches contributor data dynamically from the GitHub API at build time, replacing the previously hard-coded `community-users.json` file.

## What Changed?

### Before
- Contributor data was manually maintained in `data/community-users.json`
- Required manual updates to add new contributors
- Could easily become outdated

### After
- Contributor data is automatically fetched from the GitHub API during build
- Data is always up-to-date with the latest contributors
- Falls back to static file if API is unavailable
- Maintains the same data structure and UI behavior

## Implementation Details

### Architecture

1. **Utility Module** (`lib/fetchContributors.ts`)
   - `fetchContributorsFromGitHub()`: Main function to fetch from GitHub API
   - `fetchContributorsWithFallback()`: Safely fetches with fallback to static file
   - `Contributor` interface: TypeScript type definition for contributor objects

2. **Build-Time Fetching** (`pages/community/index.page.tsx`)
   - Uses Next.js `getStaticProps` to fetch data at build time
   - Passes contributor data as props to the page component
   - No client-side API calls - all data is static after build

3. **Fallback Strategy**
   - If GitHub API fails, falls back to `data/community-users.json`
   - If fallback also fails, returns empty array
   - Build logs clearly indicate which data source was used

### GitHub API Endpoint

```
https://api.github.com/repos/json-schema-org/json-schema-org.github.io/contributors
```

### Data Structure

The API returns and the UI expects:

```typescript
interface Contributor {
  login: string;           // GitHub username
  id: number;              // GitHub user ID
  avatar_url: string;      // Avatar image URL
  html_url: string;        // Profile URL
  contributions?: number;  // Number of contributions
}
```

## Configuration

### GitHub Token (Recommended)

To avoid GitHub API rate limiting, set a personal access token:

1. Create a GitHub Personal Access Token (no special scopes needed for public repos)
2. Add to your `.env.local` file:

```env
GITHUB_TOKEN=ghp_yourPersonalAccessTokenHere
```

### Rate Limits

- **Without token**: 60 requests/hour
- **With token**: 5,000 requests/hour

Since this only makes one request per build, a token is optional but recommended for busy CI/CD pipelines.

## Build Process

### Local Development

```bash
npm run dev
# Or
yarn dev
```

The data is fetched when you first load the page in development mode or whenever you trigger a page refresh.

### Production Build

```bash
npm run build
# Or
yarn build
```

Contributors are fetched once during the build process and baked into the static HTML.

### Build Logs

You'll see console output like:

```
Fetching contributors from GitHub API...
Using authenticated GitHub API request
GitHub API rate limit: 4999 requests remaining
Successfully fetched 142 contributors from GitHub API
```

Or if using fallback:

```
Failed to fetch from GitHub API, falling back to static file...
Using fallback data with 142 contributors
```

## Testing

### Test the GitHub API Fetch

1. Delete or rename `data/community-users.json` temporarily
2. Run `npm run build`
3. Check build logs to confirm API fetch succeeded
4. Restore the file for fallback support

### Test the Fallback

1. Remove or invalidate the `GITHUB_TOKEN` environment variable
2. Temporarily modify the API URL in `lib/fetchContributors.ts` to an invalid endpoint
3. Run `npm run build`
4. Confirm fallback to static file is triggered in logs
5. Restore the correct URL

## Maintenance

### Updating the Static Fallback File

While the static file is now primarily a fallback, you can update it manually if needed:

1. Fetch latest contributors:
   ```bash
   curl -H "Accept: application/vnd.github.v3+json" \
        https://api.github.com/repos/json-schema-org/json-schema-org.github.io/contributors \
        > data/community-users.json
   ```

2. Or use the GitHub CLI:
   ```bash
   gh api repos/json-schema-org/json-schema-org.github.io/contributors > data/community-users.json
   ```

### Monitoring

Check your GitHub API rate limit status:

```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
     https://api.github.com/rate_limit
```

## UI Behavior

The UI continues to work exactly as before:

- Displays contributor avatars in a grid
- Filters out bots (`dependabot[bot]`, `the-json-schema-bot[bot]`)
- Randomly shuffles contributors
- Shows top 60 contributors
- All existing styling and animations remain unchanged

## Troubleshooting

### Build Fails with API Error

If the build fails due to GitHub API issues:

1. Check if `data/community-users.json` exists as a fallback
2. Verify your `GITHUB_TOKEN` is valid (if using one)
3. Check GitHub API status: https://www.githubstatus.com/
4. Review build logs for specific error messages

### No Contributors Showing

1. Check browser console for errors
2. Verify `getStaticProps` returned contributors in page props
3. Ensure build completed successfully
4. Check that filtering logic isn't removing all contributors

### Rate Limit Exceeded

If you see rate limit errors:

1. Add a `GITHUB_TOKEN` to `.env.local`
2. Wait for rate limit to reset (check `X-RateLimit-Reset` header)
3. Consider implementing caching if rebuilding frequently

## Benefits

✅ **Always Up-to-Date**: Contributors appear automatically when they contribute  
✅ **Zero Maintenance**: No manual JSON file updates needed  
✅ **Build-Time**: No runtime performance impact  
✅ **Resilient**: Graceful fallback if API is unavailable  
✅ **Type-Safe**: Full TypeScript support  
✅ **Backward Compatible**: UI and behavior unchanged  

## Future Enhancements

Potential improvements for the future:

- **Incremental Static Regeneration (ISR)**: Refresh contributors periodically without full rebuild
- **Multi-Repository Support**: Aggregate contributors from multiple JSON Schema repos
- **Contributor Metadata**: Show contribution counts, recent activity, etc.
- **Caching Layer**: Cache API responses to reduce API calls during development
- **Analytics**: Track which contributors are most active

## Questions?

For questions or issues related to this implementation, please:

1. Check this documentation first
2. Review the code in `lib/fetchContributors.ts` and `pages/community/index.page.tsx`
3. Open an issue on GitHub with details about the problem
4. Include build logs if experiencing build-time errors
