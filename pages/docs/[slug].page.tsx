import Layout, { LayoutDocs } from '~/components/Layout'
import fs from 'fs'
import matter from 'gray-matter'
import StyledMarkdown from '~/components/StyledMarkdown'
import Head from 'next/head'
import React from 'react'

const path = 'pages/docs'

export async function getStaticPaths() {
  const files = fs.readdirSync(path)
  const paths = files
    .filter(file => {
      const isMarkdownFile = file.substr(-3) === '.md'
      const isProtected = ['_'].includes(file.substr(0, 1))
      return isMarkdownFile && !isProtected
    })
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
    <LayoutDocs>
      <Head>
        <title>JSON Schema - {frontmatter.title}</title>
      </Head>
      <h1>{frontmatter.title}</h1>
      <StyledMarkdown markdown={content} />
    </LayoutDocs>
  )
}
