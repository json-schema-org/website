import Layout from '~/components/Layout'
import { Headline1 } from '~/components/Headlines'
import fs from 'fs'
import Head from 'next/head'
import Link from 'next/link'
import React from 'react'
import matter from 'gray-matter'
import readingTime from 'reading-time'
const PATH = 'pages/blog/posts'
import TextTruncate from 'react-text-truncate'
import generateRssFeed from './generateRssFeed'
import { useRouter } from 'next/router'
import useSetUrlParam from '~/lib/useSetUrlParam'

export async function getStaticProps() {
  const files = fs.readdirSync(PATH)
  const blogPosts = files
    .filter(file => file.substr(-3) === '.md')
    .map((fileName) => {
      const slug = fileName.replace('.md', '')
      const fullFileName = fs.readFileSync(`pages/blog/posts/${slug}.md`, 'utf-8')
      const { data: frontmatter, content } = matter(fullFileName)
      return ({
        slug: slug,
        frontmatter,
        content
      })
    })

  await generateRssFeed(blogPosts)

  return {
    props: {
      blogPosts
    }
  }
}

export default function StaticMarkdownPage ({ blogPosts }: { blogPosts: any[] }) {
  const router = useRouter()
  const typeFilter: null | string = Array.isArray(router.query?.type)
    ? router.query?.type?.[0] : router.query?.type || null

  const setParam = useSetUrlParam()

  return (
    <Layout>
      <Head>
        <title>JSON Schema Blog</title>
      </Head>
      <div className='flex flex-row justify-between items-center'>
        <Headline1>Blog</Headline1>
        <a
          href='/rss/feed.xml'
          className='flex flex-row items-center text-blue-500 hover:text-blue-600 cursor-pointer mt-3'
        >
          <img src='/icons/rss.svg' className='rounded h-5 w-5 mr-2' />
          RSS Feed
        </a>
      </div>

      {typeFilter && (
        <div className='flex flex-row'>
          <svg className='h-4 w-4 fill-slate-300 mt-1.5 mr-2' height='394pt' viewBox='-5 0 394 394.00003' width='394pt' xmlns='http://www.w3.org/2000/svg'><path d='m367.820312 0h-351.261718c-6.199219-.0117188-11.878906 3.449219-14.710938 8.960938-2.871094 5.585937-2.367187 12.3125 1.300782 17.414062l128.6875 181.285156c.042968.0625.089843.121094.132812.183594 4.675781 6.3125 7.207031 13.960938 7.21875 21.816406v147.800782c-.027344 4.375 1.691406 8.582031 4.773438 11.6875 3.085937 3.101562 7.28125 4.851562 11.65625 4.851562 2.222656-.003906 4.425781-.445312 6.480468-1.300781l72.3125-27.570313c6.476563-1.980468 10.777344-8.09375 10.777344-15.453125v-120.015625c.011719-7.855468 2.542969-15.503906 7.214844-21.816406.042968-.0625.089844-.121094.132812-.183594l128.691406-181.289062c3.667969-5.097656 4.171876-11.820313 1.300782-17.40625-2.828125-5.515625-8.511719-8.9765628-14.707032-8.964844zm0 0' /></svg>
          <div
            className='inline-flex flex-row items-center bg-blue-100 hover:bg-blue-200 cursor-pointer font-semibold text-blue-800 inline-block px-3 py-1 rounded-full mb-4 text-sm'
            onClick={() => setParam('type', null)}
          >
            {typeFilter}
            <svg
              className='fill-blue-800 h-2 w-2 ml-2'
              height='365.696pt' viewBox='0 0 365.696 365.696' width='365.696pt' xmlns='http://www.w3.org/2000/svg'>
              <path d='m243.1875 182.859375 113.132812-113.132813c12.5-12.5 12.5-32.765624 0-45.246093l-15.082031-15.082031c-12.503906-12.503907-32.769531-12.503907-45.25 0l-113.128906 113.128906-113.132813-113.152344c-12.5-12.5-32.765624-12.5-45.246093 0l-15.105469 15.082031c-12.5 12.503907-12.5 32.769531 0 45.25l113.152344 113.152344-113.128906 113.128906c-12.503907 12.503907-12.503907 32.769531 0 45.25l15.082031 15.082031c12.5 12.5 32.765625 12.5 45.246093 0l113.132813-113.132812 113.128906 113.132812c12.503907 12.5 32.769531 12.5 45.25 0l15.082031-15.082031c12.5-12.503906 12.5-32.769531 0-45.25zm0 0' />
            </svg>
          </div>
        </div>
      )}

      <div className='grid grid-cols-3 gap-4 grid-flow-row mb-20'>
        {blogPosts
          .filter(post => {
            if (!typeFilter) return true
            const blogType = post.frontmatter.type as string | undefined
            if (!blogType) return false
            return blogType.toLowerCase() === typeFilter.toLowerCase()
          })
          .sort((a, b) => {
            const dateA = new Date(a.frontmatter.date).getTime()
            const dateB = new Date(b.frontmatter.date).getTime()
            return dateA < dateB ? 1 : -1
          })
          .map((blogPost: any) => {
            const { frontmatter, content } = blogPost
            const date = new Date(frontmatter.date)
            const timeToRead = Math.ceil(readingTime(content).minutes)

            return (
              <div
                key={blogPost.slug}
                className='flex border rounded-lg shadow-sm hover:shadow-lg transition-all overflow-hidden'
              >
                <Link href={`/blog/posts/${blogPost.slug}`}>
                  <a className='inline-flex flex-col flex-1 w-full'>
                    <div
                      className='bg-slate-50 h-[160px] w-full self-stretch mr-3 bg-cover bg-center'
                      style={{ backgroundImage: `url(${frontmatter.cover})` }}
                    />
                    <div className='p-4 flex flex-col flex-1 justify-between'>
                      <div>
                        <div>
                          <div
                            className='bg-blue-100 hover:bg-blue-200 cursor-pointer font-semibold text-blue-800 inline-block px-3 py-1 rounded-full mb-4 text-sm'
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              setParam('type', frontmatter.type)
                            }}
                          >
                            {frontmatter.type}
                          </div>
                        </div>
                        <div className='text-lg font-semibold'>
                          {frontmatter.title}
                        </div>
                        <div className='mt-3 mb-6 text-slate-500'>
                          <TextTruncate element='span' line={4} text={frontmatter.excerpt} />
                        </div>
                      </div>
                      <div className='flex flex-row items-center'>
                        <div className='flex flex-row pl-2 mr-2'>
                          {(frontmatter.authors || []).map((author: any, index: number) => {
                            return (
                              <div
                                key={index}
                                className='bg-slate-50 h-[44px] w-[44px] rounded-full -ml-3 bg-cover bg-center border-2 border-white'
                                style={{ backgroundImage: `url(${author.photo})`, zIndex: 100 - index }}
                              />
                            )
                          })}
                        </div>

                        <div className='flex flex-col items-start'>
                          <div className='text-sm font-semibold'>
                            {(frontmatter.authors.map((author: any) => author.name).join(' & '))}
                          </div>

                          <div className='text-slate-500 text-sm'>
                            {frontmatter.date && (
                              <span>
                                {date.toLocaleDateString('en-us', { year: 'numeric', month: 'long', day: 'numeric' })}
                              </span>
                            )} &middot; {timeToRead} min read
                          </div>
                        </div>

                      </div>
                    </div>
                  </a>
                </Link>
              </div>
            )
          })
        }
      </div>
    </Layout>
  )
}
