import React from 'react';
import slugify from 'slugify';

export default function slugifyMarkdownHeadline(
  markdownChildren: React.ReactNode,
): string {
  const FRAGMENT_REGEX = /\[#(?<slug>(\w|-|_)*)\]/g;
  if (!markdownChildren) return '';

  // Handle string case
  if (typeof markdownChildren === 'string') {
    return slugify(markdownChildren, { lower: true, trim: true });
  }

  // Handle number case
  if (typeof markdownChildren === 'number') {
    return slugify(markdownChildren.toString(), { lower: true, trim: true });
  }

  // Handle array case
  if (Array.isArray(markdownChildren)) {
    const metaSlug = markdownChildren.reduce((acc, child) => {
      if (acc) return acc;
      if (typeof child !== 'string') return null;
      const fragment = FRAGMENT_REGEX.exec(child);
      if (!fragment) return null;
      const slug = fragment?.groups?.slug;
      return slug || null;
    }, null);
    if (metaSlug) return metaSlug;

    const joinedChildren = markdownChildren
      .filter((child) => typeof child === 'string')
      .map((string) => string.replace(FRAGMENT_REGEX, ''))
      .join(' ');
    const slug = slugify(joinedChildren, { lower: true, trim: true });
    return slug;
  }

  // Handle React element case - extract text content
  if (React.isValidElement(markdownChildren)) {
    const children = markdownChildren.props.children;
    return slugifyMarkdownHeadline(children);
  }

  // Fallback for other cases
  return slugify(String(markdownChildren), { lower: true, trim: true });
}
