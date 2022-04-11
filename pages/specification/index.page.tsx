import Layout from '~/components/Layout'
import fs from 'fs'
import matter from 'gray-matter'
import StyledMarkdown from '~/components/StyledMarkdown'

export async function getStaticProps() {
  const block1 = fs.readFileSync('pages/specification/specification.md', 'utf-8')
  const { content: block1Content } = matter(block1)
  return {
    props: {
      blocks: [ block1Content ]
    }
  }
}

export default function ContentExample ({ blocks }: { blocks: any[] }) {
  return (
    <Layout>
      <h1 className='text-3xl font-bold mb-3 mt-10'>Specification</h1>
      <StyledMarkdown markdown={blocks[0]} />
    </Layout>
  )
}
