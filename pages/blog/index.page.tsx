import { getLayout } from '~/components/SiteLayout'
import { Headline1 } from '~/components/Headlines'
import fs from 'fs'
import Head from 'next/head'
import Link from 'next/link'
import React, { useState } from 'react'
import matter from 'gray-matter'
import readingTime from 'reading-time'
const PATH = 'pages/blog/posts'
import TextTruncate from 'react-text-truncate'
import generateRssFeed from './generateRssFeed'
import { useRouter } from 'next/router'
import useSetUrlParam from '~/lib/useSetUrlParam'
import { SectionContext } from '~/context'

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

export default function StaticMarkdownPage({ blogPosts }: { blogPosts: any[] }) {
  const router = useRouter()
  const typeFilter: null | string = Array.isArray(router.query?.type)
    ? router.query?.type?.[0] : router.query?.type || null

  const setParam = useSetUrlParam()


  const recentBlog = blogPosts.sort((a, b) => {
    const dateA = new Date(a.frontmatter.date).getTime()
    const dateB = new Date(b.frontmatter.date).getTime()
    return dateA < dateB ? 1 : -1
  })

  const timeToRead = Math.ceil(readingTime(recentBlog[0].content).minutes)
  const setOfTags: any[] = blogPosts.map((tag) => tag.frontmatter.type)
  const spreadTags: any[] = [...setOfTags]
  const allTags = [...new Set(spreadTags)]

  const [filterTag, setFilterTag] = useState('')
  const handleClick = (event: { currentTarget: { value: any } }) => {
    const clickedTag = event.currentTarget.value
    setFilterTag(clickedTag)
  }


  return (
    // @ts-ignore
    <SectionContext.Provider value='blog'>
      <Head>
        <title>JSON Schema Blog</title>
      </Head>
      <div className='max-w-[1400px] mx-auto flex flex-col items-center mt-16'>
        {recentBlog[0] && (
          <div className='relative w-full lg:h-[50vh] lg:mt-6 clip-bottom'>
            <div className='-z-1'>
              <img
                src={recentBlog[0].frontmatter.cover}
                className='object-cove center'
                alt='hero image example'
              />
            </div>

            <div className='absolute text-white left-8 bottom-8'>
              <div className='bg-blue-100 hover:bg-blue-200 cursor-pointer font-semibold text-blue-800 inline-block px-3 py-1 rounded-full mb-4 text-sm'>
                {recentBlog[0].frontmatter.type}
              </div>
              <div className='text-h1mobile md:text-h1 font-semibold'>
                {recentBlog[0].frontmatter.title}
              </div>
              <div className='flex ml-2 mb-2 '>
                <div className='bg-slate-50 h-[44px] w-[44px] rounded-full -ml-3 bg-cover bg-center border-2 border-white'
                  style={{ backgroundImage: `url(${recentBlog[0].frontmatter.authors[0].photo})` }}
                />
                <div className='max-w-[1400px] mx-autoflex flex-col ml-2'>
                  <p className='text-sm font-semibold'>{recentBlog[0].frontmatter.authors[0].name}</p>
                  <div className=' text-sm'>
                    <span>
                      {recentBlog[0].frontmatter.date} &middot; {timeToRead} min read
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div className='w-full flex justify-between items-center mx-auto px-2 sm:px-4 '>
          <div className='flex items-center'><Headline1>Blog</Headline1> <p className='mt-8'>Filter blog post by category...</p></div>
          <div className='col-span-1'>
            <a
              href='/rss/feed.xml'
              className='flex flex-row items-center text-blue-500 hover:text-blue-600 cursor-pointer mt-3'
            >
              <img src='/icons/rss.svg' className='rounded h-5 w-5 mr-2' />
              RSS Feed
            </a>
          </div>
        </div>
        {/* Filter Buttons */}
        <div className='w-full lg:ml-8 flex flex-wrap justify-start'>{allTags.map((tag) => (
          <button key={tag} value={tag} onClick={handleClick} className='bg-blue-100 hover:bg-blue-200 cursor-pointer font-semibold text-blue-800 inline-block px-3 py-1 rounded-full mb-4 mr-4 text-sm'>{tag}</button>
        ))}</div>

        {/* filterTag === frontmatter.type &&  */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6 grid-flow-row mb-20 bg-white  mx-auto px-2 sm:px-4 '>

          {blogPosts
            .filter(post => {
              if (!typeFilter) return true
              const blogType = post.frontmatter.type as string | undefined
              if (!blogType) return false
              return blogType.toLowerCase() === typeFilter.toLowerCase()
            }).filter(
              post => {
                if (post.frontmatter.type === filterTag) return true
                else if (filterTag === '') return true
              }
            )
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
                <section key={blogPost.slug}>
                  <div
                    className='h-[498px] flex border rounded-lg shadow-sm hover:shadow-lg transition-all overflow-hidden'
                  >
                    <Link href={`/blog/posts/${blogPost.slug}`}>
                      <a className='inline-flex flex-col flex-1 w-full'>
                        <div
                          className='bg-slate-50 h-[160px] w-full self-stretch mr-3 bg-cover bg-center'
                          style={{ backgroundImage: `url(${frontmatter.cover})` }}
                        />
                        <div className=' p-4 flex flex-col flex-1 justify-between'>
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
                                    style={{ backgroundImage: `url(${author.photo})`, zIndex: 10 - index }}
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
                </section>
              )
            })
          }
        </div>
      </div>
    </SectionContext.Provider>
  )
}

StaticMarkdownPage.getLayout = getLayout
