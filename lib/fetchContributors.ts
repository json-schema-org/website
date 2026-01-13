/* eslint-disable linebreak-style */
/**
 * Utility for fetching contributor data from the GitHub API at build time.
 *
 * This module provides functionality to fetch contributors from the
 * json-schema-org/json-schema-org.github.io repository, with graceful
 * error handling and rate limit awareness.
 *
 * GitHub API endpoint used:
 * https://api.github.com/repos/json-schema-org/json-schema-org.github.io/contributors
 *
 * To avoid rate limiting, set the GITHUB_TOKEN environment variable with a
 * personal access token. Without a token, the API allows 60 requests/hour.
 * With authentication, this increases to 5,000 requests/hour.
 *
 * Example .env.local:
 * GITHUB_TOKEN=ghp_yourPersonalAccessTokenHere
 */

/**
 * Represents a contributor in the format used by the UI.
 * This matches the structure previously stored in community-users.json.
 */
export interface Contributor {
  /** GitHub username */
  login: string;
  /** GitHub user ID */
  id: number;
  /** URL to user's avatar image */
  avatar_url: string;
  /** URL to user's GitHub profile */
  html_url: string;
  /** Number of contributions (optional, provided by GitHub API) */
  contributions?: number;
}

/**
 * Fetches contributor data from the GitHub API.
 *
 * @returns Promise that resolves to an array of contributors
 * @throws Error if the API request fails and no fallback is available
 */
export async function fetchContributorsFromGitHub(): Promise<Contributor[]> {
  const GITHUB_API_URL =
    'https://api.github.com/repos/json-schema-org/json-schema-org.github.io/contributors?per_page=100';
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

  try {
    console.log('Fetching contributors from GitHub API...');

    const headers: HeadersInit = {
      Accept: 'application/vnd.github.v3+json',
      'User-Agent': 'json-schema-website',
    };

    // Add authentication if token is available
    if (GITHUB_TOKEN) {
      headers['Authorization'] = `Bearer ${GITHUB_TOKEN}`;
      console.log('Using authenticated GitHub API request');
    } else {
      console.warn(
        'GITHUB_TOKEN not found in environment variables. ' +
          'API rate limit will be restricted to 60 requests/hour. ' +
          'Consider adding a GitHub token to .env.local for higher limits.',
      );
    }

    // Create abort controller for timeout (compatible with older Node versions)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(GITHUB_API_URL, {
      headers,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(
        `GitHub API request failed with status ${response.status}: ${errorBody}`,
      );
    }

    // Check rate limit headers
    const rateLimitRemaining = response.headers.get('X-RateLimit-Remaining');

    if (rateLimitRemaining) {
      console.log(
        `GitHub API rate limit: ${rateLimitRemaining} requests remaining`,
      );
    }

    const contributors: Contributor[] = await response.json();

    console.log(
      `Successfully fetched ${contributors.length} contributors from GitHub API`,
    );

    // Normalize the data to ensure it matches our expected structure
    // GitHub API returns the exact fields we need, but we'll map it
    // explicitly for type safety and future-proofing
    const normalizedContributors: Contributor[] = contributors.map(
      (contributor) => ({
        login: contributor.login,
        id: contributor.id,
        avatar_url: contributor.avatar_url,
        html_url: contributor.html_url,
        contributions: contributor.contributions,
      }),
    );

    return normalizedContributors;
  } catch (error) {
    console.error('Error fetching contributors from GitHub API:', error);

    // In production builds, we might want to fail gracefully
    // For now, we'll re-throw the error to make build failures visible
    throw new Error(
      `Failed to fetch contributors from GitHub API: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}

/**
 * Fetches contributors with a fallback to the static JSON file.
 * This provides resilience during builds if the GitHub API is unavailable.
 *
 * @returns Promise that resolves to an array of contributors
 */
export async function fetchContributorsWithFallback(): Promise<Contributor[]> {
  try {
    // Try to fetch from GitHub API first
    return await fetchContributorsFromGitHub();
  } catch (error) {
    console.warn(
      'Failed to fetch from GitHub API, falling back to static file...',
    );
    console.error(error);

    try {
      // Fallback to the static JSON file
      const staticContributors = await import('~/data/community-users.json');
      console.log(
        `Using fallback data with ${staticContributors.default.length} contributors`,
      );
      return staticContributors.default as Contributor[];
    } catch (fallbackError) {
      console.error('Failed to load fallback data:', fallbackError);
      // Return empty array as last resort
      console.warn('Returning empty contributors list as last resort');
      return [];
    }
  }
}
