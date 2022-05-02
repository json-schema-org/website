import fs from 'fs'
import matter from 'gray-matter'

type Props = { params?: { slug: string }}

export default async function getStaticMarkdownProps(props: Props, dirname?: string) {
  const path = (dirname || __dirname).replace(`${process.cwd()}/.next/server/`, '')
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