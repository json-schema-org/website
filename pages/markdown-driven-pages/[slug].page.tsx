import Layout from '~/components/Layout'
import fs from 'fs'
import matter from 'gray-matter'
import StyledMarkdown from '~/components/StyledMarkdown'
import Head from 'next/head'
import React from 'react'

const path = 'pages/markdown-driven-pages'

export async function getStaticPaths() {
  const files = fs.readdirSync(path)
  const paths = files
    .filter(file => file.substr(-3) === '.md')
    .map((fileName) => ({
      params: {
        slug: fileName.replace('.md', ''),
      }
    }))
  return {
    paths,
    fallback: false
  }
}

export async function getStaticProps({ params: { slug } }: { params: { slug: string }}) {
  const fileName = fs.readFileSync(`${path}/${slug}.md`, 'utf-8');
  const { data: frontmatter, content } = matter(fileName)
  return {
    props: {
      frontmatter,
      content,
    }
  }
}

export default function StaticMarkdownPage ({ frontmatter, content }: { frontmatter: any, content: any }) {
  return (
    <Layout>
      <Head>
        <title>JSON Schema - {frontmatter.title}</title>
      </Head>
      <h1>{frontmatter.title}</h1>
      <StyledMarkdown markdown={content} />
    </Layout>
  )
}
