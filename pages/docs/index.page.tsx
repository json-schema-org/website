import Layout, { LayoutDocs } from '~/components/Layout'
import fs from 'fs'
import matter from 'gray-matter'
import StyledMarkdown from '~/components/StyledMarkdown'

export async function getStaticProps() {
  const block1 = fs.readFileSync('pages/docs/_index.md', 'utf-8')
  const { content: block1Content } = matter(block1)
  return {
    props: {
      blocks: [ block1Content ]
    }
  }
}

export default function ContentExample ({ blocks }: { blocks: any[] }) {
  return (
    <LayoutDocs>
      <StyledMarkdown markdown={blocks[0]} />
    </LayoutDocs>
  )
}
