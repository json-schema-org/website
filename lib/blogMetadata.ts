export const PRODUCTION_ORIGIN = 'https://json-schema.org';

export interface RawBlogAuthor {
  name?: string;
  photo?: string;
  twitter?: string;
  byline?: string;
  link?: string;
  [key: string]: unknown;
}

export interface RawBlogFrontmatter {
  title?: string;
  date?: string | Date;
  cover?: string;
  excerpt?: string;
  seoDescription?: string;
  canonicalLink?: string;
  authors?: (RawBlogAuthor | string)[];
  author?: RawBlogAuthor | string;
  language?: string;
  tags?: string[];
  type?: string;
  [key: string]: unknown;
}

export interface BlogMetadata {
  title: string;
  description: string;
  pageUrl: string;
  canonicalUrl: string;
  coverUrl: string | null;
  authors: string[];
  twitterCreator: string | null;
  date: string | null;
  language: string | null;
}

/**
 * Strips inline Markdown syntax, HTML tags, and HTML entities to produce clean plain text.
 * Avoids mechanical truncation and preserves complete words and punctuation.
 */
export function sanitizePlainText(input: string): string {
  if (!input || typeof input !== 'string') {
    return '';
  }

  let text = input;

  // 1. Remove HTML tags iteratively to prevent nested tag bypass
  let prevText = '';
  while (prevText !== text) {
    prevText = text;
    text = text.replace(/<[^>]*>/g, '');
  }
  text = text.replace(/[<>]/g, '');

  // 2. Remove Markdown images: ![alt](url) -> alt
  text = text.replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1');

  // 3. Remove Markdown links: [text](url) -> text
  text = text.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');

  // 4. Remove bold & italic formatting: **text**, *text*, __text__, _text_
  text = text.replace(/(\*\*|__)(.*?)\1/g, '$2');
  text = text.replace(/(\*|_)(.*?)\1/g, '$2');

  // 5. Remove strikethrough: ~~text~~ -> text
  text = text.replace(/~~(.*?)~~/g, '$1');

  // 6. Remove inline code backticks: `code` -> code
  text = text.replace(/`([^`]+)`/g, '$1');

  // 7. Decode common HTML entities in a single pass to prevent double-unescaping
  const entities: Record<string, string> = {
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': String.fromCharCode(39),
    '&apos;': String.fromCharCode(39),
    '&nbsp;': ' ',
    '&amp;': '&',
  };
  text = text.replace(
    /&(?:lt|gt|quot|#39|apos|nbsp|amp);/g,
    (match) => entities[match] || match,
  );

  // 8. Collapse whitespace and trim
  text = text.replace(/\s+/g, ' ').trim();

  return text;
}

/**
 * Normalizes and validates a canonical URL according to the site's clean-URL policy.
 * - Enforces http/https protocols.
 * - Rejects malformed or unsafe schemes (e.g. javascript:, data:, file:).
 * - Strips query parameters and fragments.
 * - Preserves external pathnames and intentional trailing slashes.
 */
export function normalizeCanonicalUrl(rawUrl: string, slug?: string): string {
  if (!rawUrl || typeof rawUrl !== 'string' || !rawUrl.trim()) {
    throw new Error(
      `Empty or invalid canonicalLink${slug ? ` in "${slug}"` : ''}.`,
    );
  }

  let parsed: URL;
  try {
    parsed = new URL(rawUrl.trim());
  } catch {
    throw new Error(
      `Malformed canonicalLink URL "${rawUrl}"${slug ? ` in blog post "${slug}"` : ''}.`,
    );
  }

  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    throw new Error(
      `Unsupported protocol "${parsed.protocol}" in canonicalLink "${rawUrl}"${
        slug ? ` in blog post "${slug}"` : ''
      }. Only http: and https: are allowed.`,
    );
  }

  // Strip query parameters and hash fragments under clean-URL policy
  parsed.search = '';
  parsed.hash = '';

  return parsed.toString();
}

/**
 * Normalizes an asset URL (e.g. article cover image) to an absolute URL.
 * Preserves external http(s) URLs and resolves relative/root paths against production origin.
 */
export function normalizeAssetUrl(
  rawUrl: string | undefined | null,
  origin: string = PRODUCTION_ORIGIN,
): string | null {
  if (!rawUrl || typeof rawUrl !== 'string') {
    return null;
  }

  const trimmed = rawUrl.trim();
  if (!trimmed) {
    return null;
  }

  if (trimmed.startsWith('/')) {
    return `${origin}${trimmed}`;
  }

  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
      return parsed.toString();
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Resolves the article description using the defined precedence rules:
 * 1. Non-empty `seoDescription` frontmatter.
 * 2. Non-empty `excerpt` frontmatter.
 * Whitespace-only values fall back to the next source.
 * If neither source exists or produces non-empty text, throws an actionable build-time diagnostic.
 */
export function resolveArticleDescription(
  frontmatter: RawBlogFrontmatter,
  slug: string,
): string {
  if (
    typeof frontmatter.seoDescription === 'string' &&
    frontmatter.seoDescription.trim().length > 0
  ) {
    const cleaned = sanitizePlainText(frontmatter.seoDescription);
    if (cleaned.length > 0) {
      return cleaned;
    }
  }

  if (
    typeof frontmatter.excerpt === 'string' &&
    frontmatter.excerpt.trim().length > 0
  ) {
    const cleaned = sanitizePlainText(frontmatter.excerpt);
    if (cleaned.length > 0) {
      return cleaned;
    }
  }

  throw new Error(
    `Missing description for blog post "${slug}": provide either 'seoDescription' or 'excerpt' in frontmatter.`,
  );
}

/**
 * Pure normalization pipeline for blog post metadata.
 * Resolves title, description, local vs canonical URLs, cover URL, and author sharing details.
 */
export function normalizeBlogMetadata(
  slug: string,
  frontmatter: RawBlogFrontmatter,
  origin: string = PRODUCTION_ORIGIN,
): BlogMetadata {
  if (!slug || typeof slug !== 'string' || !slug.trim()) {
    throw new Error('A valid slug is required to normalize blog metadata.');
  }

  const title = (frontmatter.title || '').trim();
  if (!title) {
    throw new Error(
      `Missing title for blog post "${slug}": provide 'title' in frontmatter.`,
    );
  }

  const description = resolveArticleDescription(frontmatter, slug);

  const cleanSlug = slug.trim();
  const pageUrl = `${origin}/blog/posts/${cleanSlug}`;

  let canonicalUrl = pageUrl;
  if (
    frontmatter.canonicalLink &&
    typeof frontmatter.canonicalLink === 'string' &&
    frontmatter.canonicalLink.trim()
  ) {
    canonicalUrl = normalizeCanonicalUrl(frontmatter.canonicalLink, cleanSlug);
  }

  const coverUrl = normalizeAssetUrl(frontmatter.cover, origin);

  // Extract author names and any optional author twitter handle
  const authors: string[] = [];
  let twitterCreator: string | null = null;

  const rawAuthors = Array.isArray(frontmatter.authors)
    ? frontmatter.authors
    : frontmatter.author
      ? [frontmatter.author]
      : [];

  for (const item of rawAuthors) {
    if (typeof item === 'string') {
      const trimmed = item.trim();
      if (trimmed) {
        authors.push(trimmed);
      }
    } else if (item && typeof item === 'object') {
      if (typeof item.name === 'string' && item.name.trim()) {
        authors.push(item.name.trim());
      }
      if (
        !twitterCreator &&
        typeof item.twitter === 'string' &&
        item.twitter.trim()
      ) {
        const handle = item.twitter.trim().replace(/^@/, '');
        if (handle) {
          twitterCreator = `@${handle}`;
        }
      }
    }
  }

  let dateStr: string | null = null;
  if (frontmatter.date) {
    if (frontmatter.date instanceof Date) {
      dateStr = frontmatter.date.toISOString();
    } else {
      const d = new Date(frontmatter.date);
      dateStr = isNaN(d.getTime()) ? String(frontmatter.date) : d.toISOString();
    }
  }

  const language =
    typeof frontmatter.language === 'string' && frontmatter.language.trim()
      ? frontmatter.language.trim()
      : null;

  return {
    title,
    description,
    pageUrl,
    canonicalUrl,
    coverUrl,
    authors,
    twitterCreator,
    date: dateStr,
    language,
  };
}
