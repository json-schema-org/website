import React from 'react';
import { compiler } from 'markdown-to-jsx';
import slugifyMarkdownHeadline from '~/lib/slugifyMarkdownHeadline';

// Only h1-h4 get ids from our Headline components, h5/h6 are rendered as is.
const HEADING_REGEX = /^( {0,3})(#{1,4})[ \t]+(.*?)(?:[ \t]+#+)?[ \t]*(\r?)$/;
const FENCE_REGEX = /^ {0,3}(`{3,}|~{3,})/;
const FRAGMENT_REGEX = /\[#[\w-]*\]/;
// has to match what slugifyMarkdownHeadline / Headlines accept as a fragment
const SAFE_SLUG_REGEX = /^[\w-]+$/;

type Heading = {
  line: number;
  indent: string;
  hashes: string;
  text: string;
  lineEnd: string;
  slug: string;
  hasFragment: boolean;
};

const findHeadingChildren = (node: unknown): unknown => {
  if (Array.isArray(node)) {
    for (const child of node) {
      const found = findHeadingChildren(child);
      if (found !== undefined) return found;
    }
    return undefined;
  }
  if (!React.isValidElement(node)) return undefined;
  const props = node.props as { children?: unknown };
  if (typeof node.type === 'string' && /^h[1-6]$/.test(node.type)) {
    return props.children ?? '';
  }
  return findHeadingChildren(props.children);
};

// Slug the heading the same way the page does: parse it with markdown-to-jsx
// and run the children through slugifyMarkdownHeadline.
const getHeadingSlug = (hashes: string, text: string): string => {
  const element = compiler(`${hashes} ${text}`, { forceBlock: true });
  const children = findHeadingChildren(element);
  if (children === undefined) return '';
  return slugifyMarkdownHeadline(
    typeof children === 'string' || Array.isArray(children)
      ? children
      : [children],
  );
};

const getHeadings = (lines: string[]): Heading[] => {
  const headings: Heading[] = [];
  let fence: string | null = null;

  lines.forEach((line, index) => {
    const fenceMatch = FENCE_REGEX.exec(line);
    if (fence) {
      if (
        fenceMatch &&
        fenceMatch[1][0] === fence[0] &&
        fenceMatch[1].length >= fence.length &&
        line.trim() === fenceMatch[1]
      ) {
        fence = null;
      }
      return;
    }
    if (fenceMatch) {
      fence = fenceMatch[1];
      return;
    }

    const match = HEADING_REGEX.exec(line);
    if (!match) return;
    const [, indent, hashes, text, lineEnd] = match;
    headings.push({
      line: index,
      indent,
      hashes,
      text,
      lineEnd,
      slug: getHeadingSlug(hashes, text),
      hasFragment: FRAGMENT_REGEX.test(text),
    });
  });

  return headings;
};

/**
 * Gives repeated headings on a page unique ids, the same way GitHub does:
 * the first one keeps its id and the next ones get `-1`, `-2`, ... appended.
 * The new id is added as a `[#id]` fragment so the heading and the table of
 * contents both pick it up. Headings with an explicit fragment are left alone.
 */
export default function dedupeHeadingIds(markdown: string): string {
  if (!markdown) return markdown;
  const lines = markdown.split('\n');
  const headings = getHeadings(lines);
  if (headings.length < 2) return markdown;

  const reserved = new Set(headings.map((heading) => heading.slug));
  const used = new Set<string>();

  headings.forEach((heading) => {
    const { slug } = heading;
    if (!slug) return;
    if (!used.has(slug)) {
      used.add(slug);
      return;
    }
    if (heading.hasFragment) return;

    let count = 1;
    let newSlug = `${slug}-${count}`;
    while (reserved.has(newSlug) || used.has(newSlug)) {
      count += 1;
      newSlug = `${slug}-${count}`;
    }
    if (!SAFE_SLUG_REGEX.test(newSlug)) return;

    used.add(newSlug);
    // escape it so `[text][#id]` isn't read as a reference link
    const separator = heading.text.endsWith(']') ? ' \\' : '';
    lines[heading.line] =
      `${heading.indent}${heading.hashes} ${heading.text}${separator}[#${newSlug}]${heading.lineEnd}`;
  });

  return lines.join('\n');
}
