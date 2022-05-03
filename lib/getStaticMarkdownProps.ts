import fs from 'fs'
import matter from 'gray-matter'

type Props = { params?: { slug: string }}

export default async function getStaticMarkdownProps(props: Props, path: string) {
  const slug = props.params?.slug || '_index'
  const fileName = fs.readFileSync(`${path}/${slug}.md`, 'utf-8')
  const { data: frontmatter, content } = matter(fileName)
  return {
    props: {
      frontmatter,
      content,
    }
  }
}