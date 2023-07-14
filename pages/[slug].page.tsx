import Layout from '~/components/Layout'
import StyledMarkdown from '~/components/StyledMarkdown'
import Head from 'next/head'
import React, { useState } from 'react'
import getStaticMarkdownPaths from '~/lib/getStaticMarkdownPaths'
import getStaticMarkdownProps from '~/lib/getStaticMarkdownProps'
import { Headline1 } from '~/components/Headlines'
import { SectionContext } from '~/context'
import { DocsNav } from '~/components/Layout'
import { useRouter } from 'next/router'
export async function getStaticPaths() { return getStaticMarkdownPaths('pages') }
export async function getStaticProps(args: any) { return getStaticMarkdownProps(args, 'pages') }

export default function StaticMarkdownPage({ frontmatter, content }: { frontmatter: any, content: any }) {
  const router = useRouter()
  console.log(router.pathname)
  const [open, setOpen] = useState(false)
  const [rotateChevron, setRotateChevron] = useState(false)
  const handleRotate = () => setRotateChevron(!rotateChevron)
  const rotate = rotateChevron ? 'rotate(180deg)' : 'rotate(0)'
  return (
    <SectionContext.Provider value={frontmatter.section || null}>
      <Layout>
        <Head>
          <title>JSON Schema - {frontmatter.title}</title>
        </Head>

        <div className='bg-primary w-full h-12 mt-[4.4rem] z-150 flex relative flex-col justify-between items-center lg:hidden' onClick={() => {
          setOpen(!open)
        }}>
          <div className='z-[150] flex w-full bg-primary justify-between items-center mt-2' onClick={handleRotate}>

            {router.pathname === '/overview/[slug]' && <h3 className='text-white ml-12'>Overview</h3>}
            {router.pathname === '/learn/[slug]' && <h3 className='text-white ml-12'>Getting Started</h3>}

            {router.pathname === '/understanding-json-schema' || router.pathname === '/understanding-json-schema/reference/[slug]' && <h3 className='text-white ml-12'>Reference</h3>}
            {router.pathname === '/understanding-json-schema/[slug]' && <h3 className='text-white ml-12'>Reference</h3>}

            {router.pathname === '/draft/2020-12/[slug]' || router.pathname === '/draft-06/[slug]' && <h3 className='text-white ml-12'>Specification</h3>}
            {router.pathname === '/draft-07/[slug]' && <h3 className='text-white ml-12'>Specification</h3>}
            {router.pathname === '/draft-05/[slug]' && <h3 className='text-white ml-12'>Specification</h3>}
            {router.pathname === '/draft/2019-09/[slug]' || router.pathname === '/[slug]' && <h3 className='text-white ml-12'>Specification</h3>}

            {router.pathname === null && <h3 className='text-white ml-12'>Docs</h3>}
            <svg style={{ marginRight: '50px', color: 'white', transform: rotate, transition: 'all 0.2s linear' }} xmlns='http://www.w3.org/2000/svg' height='24' viewBox='0 0 256 512'><path d='M64 448c-8.188 0-16.38-3.125-22.62-9.375c-12.5-12.5-12.5-32.75 0-45.25L178.8 256L41.38 118.6c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0l160 160c12.5 12.5 12.5 32.75 0 45.25l-160 160C80.38 444.9 72.19 448 64 448z' id='mainIconPathAttribute' fill='#ffffff'></path></svg>
          </div>
        </div>

        <div className={`z-[150] absolute top-10 mt-24 left-0 h-screen w-screen bg-white transform ${open ? '-translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out filter drop-shadow-md `}>
          <div className='flex flex-col' onClick={() => setTimeout(() => { setOpen(!open) }, 100)}>
            <DocsNav />
          </div>
        </div>
        <div className='hidden lg:block mt-24 '><DocsNav /></div>

        <div className='mx-auto grid grid-cols-4 px-2 sm:px-4 lg:px-8'>
          <div className='col-span-4 px-4 md:col-span-3 lg:mt-20 lg:w-5/6'>
            <Headline1>{frontmatter.title}</Headline1>
            <StyledMarkdown markdown={content} />
          </div>
        </div>

      </Layout>
    </SectionContext.Provider>
  )
}
