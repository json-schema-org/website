import slugify from 'slugify'

const FRAGMENT_REGEX = /\[#(?<slug>(\w|-|_)*)\]/g

export default function slugifyMarkdownHeadline (markdownChildren: any[]) {
  const metaSlug = markdownChildren.reduce((acc, child) => {
    if (acc) return acc
    if (typeof child !== 'string') return null
    const fragment = FRAGMENT_REGEX.exec(child)
    if (!fragment) return null
    const slug = fragment?.groups?.slug
    console.log('slugi', slug)
    return slug || null
  }, null)
  if (metaSlug) return metaSlug
  const joinedChildren = markdownChildren
    .filter(child => typeof child === 'string')
    .map(string => string.replace(FRAGMENT_REGEX, ''))
    .join(' ')
  const slug = slugify(joinedChildren, { lower: true, trim: true })
  return slug
}