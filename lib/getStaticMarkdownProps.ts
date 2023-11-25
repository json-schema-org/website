import fs from 'fs'
import matter from 'gray-matter'

type Props = { params?: { slug: string }}



export default async function getStaticMarkdownProps(props: Props, path: string) {
  const slug = props.params?.slug || '_index'
  
  const fileName2 = `${path}/${slug}.md`
  const stats = fs.lstatSync(fileName2)
  var fileName = null

  if (stats.isSymbolicLink()){
    fileName = fs.readFileSync(fileName2, 'utf-8')

  } else {
    fileName = fs.readFileSync(fileName2, 'utf-8')
  }

  const { data: frontmatter, content } = matter(fileName)

  console.log("Conten Data: " + content)

  return {
    props: {
      frontmatter,
      content,
    }
  }
}