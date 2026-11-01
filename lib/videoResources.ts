/* eslint-disable linebreak-style */
/**
 * Video resource model and validation utilities for community educational videos.
 *
 * Duplicate URL comparison policy:
 * URLs are canonicalized by parsing with the standard URL API:
 * - Protocol and hostname are normalized to lowercase.
 * - Standard HTTPS port (443) is omitted.
 * - Trailing slashes on root paths are normalized.
 * - Any query parameters and non-root paths are preserved in order.
 * If two entries resolve to the same normalized URL string, they are treated as duplicates.
 */

export interface VideoResource {
  title: string;
  description: string;
  url: string;
}

export class VideoValidationError extends Error {
  public readonly entryIndex: number;
  public readonly field?: string;

  constructor(message: string, entryIndex: number, field?: string) {
    super(
      `[Video Resource Error at entry #${entryIndex + 1}${field ? ` field '${field}'` : ''}]: ${message}`,
    );
    this.name = 'VideoValidationError';
    this.entryIndex = entryIndex;
    this.field = field;
  }
}

/**
 * Normalizes a URL for canonical duplicate detection.
 */
export function canonicalizeUrl(rawUrl: string): string {
  const parsed = new URL(rawUrl);
  // Ensure protocol and hostname are lowercase (standard URL does this)
  let normalizedPath = parsed.pathname;
  if (normalizedPath === '/') {
    normalizedPath = '';
  } else if (normalizedPath.endsWith('/')) {
    normalizedPath = normalizedPath.slice(0, -1);
  }
  return `${parsed.protocol}//${parsed.host}${normalizedPath}${parsed.search}${parsed.hash}`;
}

/**
 * Validates an array of video resources.
 * Throws a VideoValidationError on the first invalid entry encountered.
 */
export function validateVideoResources(data: unknown): VideoResource[] {
  if (!Array.isArray(data)) {
    throw new Error('Video resources data must be an array');
  }

  const seenUrls = new Set<string>();
  const validatedList: VideoResource[] = [];

  for (let index = 0; index < data.length; index++) {
    const entry = data[index];

    if (entry === null || typeof entry !== 'object' || Array.isArray(entry)) {
      throw new VideoValidationError('Entry must be a valid object', index);
    }

    const { title, description, url } = entry as Record<string, unknown>;

    // 1. Title validation
    if (title === undefined || title === null) {
      throw new VideoValidationError('Missing required field', index, 'title');
    }
    if (typeof title !== 'string') {
      throw new VideoValidationError('Title must be a string', index, 'title');
    }
    if (title.trim().length === 0) {
      throw new VideoValidationError(
        'Title cannot be empty or whitespace-only',
        index,
        'title',
      );
    }

    // 2. Description validation
    if (description === undefined || description === null) {
      throw new VideoValidationError(
        'Missing required field',
        index,
        'description',
      );
    }
    if (typeof description !== 'string') {
      throw new VideoValidationError(
        'Description must be a string',
        index,
        'description',
      );
    }
    if (description.trim().length === 0) {
      throw new VideoValidationError(
        'Description cannot be empty or whitespace-only',
        index,
        'description',
      );
    }

    // 3. URL validation
    if (url === undefined || url === null) {
      throw new VideoValidationError('Missing required field', index, 'url');
    }
    if (typeof url !== 'string') {
      throw new VideoValidationError('URL must be a string', index, 'url');
    }
    const trimmedUrl = url.trim();
    if (trimmedUrl.length === 0) {
      throw new VideoValidationError(
        'URL cannot be empty or whitespace-only',
        index,
        'url',
      );
    }

    let parsedUrl: URL;
    try {
      parsedUrl = new URL(trimmedUrl);
    } catch {
      throw new VideoValidationError(
        `Malformed or relative URL: "${trimmedUrl}"`,
        index,
        'url',
      );
    }

    if (parsedUrl.protocol !== 'https:') {
      throw new VideoValidationError(
        `URL protocol must be "https:", received "${parsedUrl.protocol}"`,
        index,
        'url',
      );
    }

    if (parsedUrl.username || parsedUrl.password) {
      throw new VideoValidationError(
        'URL must not contain embedded user credentials',
        index,
        'url',
      );
    }

    // 4. Duplicate URL detection
    const canonical = canonicalizeUrl(trimmedUrl);
    if (seenUrls.has(canonical)) {
      throw new VideoValidationError(
        `Duplicate video URL detected: "${trimmedUrl}"`,
        index,
        'url',
      );
    }
    seenUrls.add(canonical);

    validatedList.push({
      title: title.trim(),
      description: description.trim(),
      url: trimmedUrl,
    });
  }

  return validatedList;
}
