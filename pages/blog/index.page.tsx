import Layout from '~/components/Layout'
import fs from 'fs'
import Head from 'next/head'
import Link from 'next/link'
import React from 'react'

const path = 'pages/blog/posts'

export async function getStaticProps() {
  const files = fs.readdirSync(path)
  const blogPosts = files
    .filter(file => file.substr(-3) === '.md')
    .map((fileName) => ({
      slug: fileName.replace('.md', ''),
    }))

  console.log('blogPosts', blogPosts)

  return {
    props: {
      blogPosts
    }
  }
}

export default function StaticMarkdownPage ({ blogPosts }: { blogPosts: any[] }) {
  console.log('blogPosts', blogPosts)
  return (
    <Layout>
      <Head>
        <title>Blog</title>
      </Head>
      <h1 className='text-2xl font-bold'>Blog</h1>
      <div>
        {blogPosts.map((blogPost: any) => {
          return (
            <div key={blogPost.slug}>
              <Link href={`/blog/posts/${blogPost.slug}`}>
                <a>
                  {blogPost.slug}
                </a>
              </Link>
            </div>
          )
        })}
      </div>
    </Layout>
  )
}
