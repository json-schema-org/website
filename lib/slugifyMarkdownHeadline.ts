import { isValidElement } from 'react';
import slugify from 'slugify';

const FRAGMENT_REGEX = /\[#(?<slug>(\w|-|_)*)\]/;
const FRAGMENT_REGEX_GLOBAL = /\[#(?<slug>(\w|-|_)*)\]/g;

// Pulls the plain text out of headline children. Markdown headings can contain
// inline code, emphasis, links etc, which show up as React elements (or
// markdown-to-jsx nodes) instead of strings, so we walk them recursively.
export function getTextFromChildren(children: unknown): string {
  if (children === null || children === undefined) return '';
  if (typeof children === 'boolean') return '';
  if (typeof children === 'string') return children;
  if (typeof children === 'number') return String(children);
  if (Array.isArray(children))
    return children.map(getTextFromChildren).join('');
  if (isValidElement(children)) {
    return getTextFromChildren(
      (children.props as { children?: unknown })?.children,
    );
  }
  if (typeof children === 'object') {
    const node = children as {
      text?: unknown;
      children?: unknown;
      props?: { children?: unknown };
    };
    if (typeof node.text === 'string') return node.text;
    if (node.children !== undefined) return getTextFromChildren(node.children);
    if (node.props?.children !== undefined)
      return getTextFromChildren(node.props.children);
  }
  return '';
}

export default function slugifyMarkdownHeadline(
  markdownChildren: string | any[] | unknown,
): string {
  if (!markdownChildren) return '';
  const text = getTextFromChildren(markdownChildren);

  const fragment = FRAGMENT_REGEX.exec(text);
  const metaSlug = fragment?.groups?.slug;
  if (metaSlug) return metaSlug;

  return slugify(text.replace(FRAGMENT_REGEX_GLOBAL, ''), {
    lower: true,
    trim: true,
  });
}
