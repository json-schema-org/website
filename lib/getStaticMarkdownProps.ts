import fs from 'fs'
import matter from 'gray-matter'

type Props = { params?: { slug: string }}



export default async function getStaticMarkdownProps(props: Props, path: string) {
  const slug = props.params?.slug || '_index'
  
  let fileName2 = `${path}/${slug}.md`
  let fileName = null

  fileName = fs.readFileSync(fileName2, 'utf-8')


  const { data: frontmatter, content } = matter(fileName)

  return {
    props: {
      frontmatter,
      content,
    }
  }
}