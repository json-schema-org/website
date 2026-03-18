import slugify from 'slugify';

function extractTextFromNode(node: any): string {
  if (typeof node === 'string') return node;
  if (Array.isArray(node)) return node.map(extractTextFromNode).join('');
  if (node && typeof node === 'object' && node.props) {
    return extractTextFromNode(node.props.children);
  }
  return '';
}

export default function slugifyMarkdownHeadline(
  markdownChildren: string | any[],
): string {
  const FRAGMENT_REGEX = /\[#(?<slug>(\w|-|_)*)\]/g;
  if (!markdownChildren) return '';
  if (typeof markdownChildren === 'string')
    return slugify(markdownChildren, { lower: true, trim: true });
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
    .map(extractTextFromNode)
    .map((s) => s.replace(FRAGMENT_REGEX, ''))
    .join(' ')
    .trim();

  const slug = slugify(joinedChildren, { lower: true, trim: true });
  return slug;
}
