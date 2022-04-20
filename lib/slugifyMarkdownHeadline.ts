import slugify from 'slugify'

export default function slugifyMarkdownHeadline (markdownChildren: any[]) {
  const joinedChildren = markdownChildren.join(' ')
  const slug = slugify(joinedChildren, { lower: true, trim: true })
  return slug
}