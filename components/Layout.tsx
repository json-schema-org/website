import React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import classnames from 'classnames'
import { useRouter } from 'next/router'

type Props = {
  children: React.ReactNode
  mainClassName?: string
  mainClassNameWidth?: string
  metaTitle?: string
}

export default function Layout ({ children, mainClassName, mainClassNameWidth, metaTitle }: Props) {
  return (
    <div className='bg-slate-100 min-h-screen relative flex flex-col justify-between'>
      <Head>
        <title>JSON Schema {metaTitle ? ` - ${metaTitle}` : ''}</title>
        <meta name='description' content='JSON Schema' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <div>
        <header className='flex flex-row justify-between py-4 p-4 w-[1200px] mx-auto'>
          <Link href='/'>
            <a>
              <div className='inline-block text-xl text-slate-900 leading-6 font-semibold flex flex-row items-center'>
                <img src='/logo-blue.svg' className='h-12 mr-2' />
                <div className='inline-block'>
                  JSON<br />
                  Schema
                </div>
              </div>
            </a>
          </Link>
          <div className='py-2'>
            <MainNavLink
              uri='/learn'
              label='Learn'
              activeRoutes={[
                '/learn',
                '/learn/[slug]',
              ]}
            />
            <MainNavLink
              uri='/understanding-json-schema'
              label='Docs'
              activeRoutes={[
                '/understanding-json-schema',
                '/understanding-json-schema/[slug]',
              ]}
            />
            <MainNavLink
              uri='/blog'
              label='Blog'
              activeRoutes={['/blog', '/blog/posts/[slug]']}
            />
            <MainNavLink
              uri='/community'
              label='Community'
            />
          </div>
        </header>
        <main className={
          classnames(mainClassName, mainClassNameWidth, 'bg-white rounded-xl py-4 px-8 mx-auto', {
            'w-[1200px]': !mainClassNameWidth
          })
        }>
          {children}
        </main>
      </div>

      <footer className='w-[1200px] mx-auto p-4 py-16 flex flex-row'>
        <div className='w-1/4 flex flex-col items-stert'>
          <div className='font-semibold text-sm text-slate-800 mb-1'>Specification</div>
          <Link href='/specification'>
            <a className='text-sm text-slate-400 hover:text-slate-500 pt-3'>Overview</a>
          </Link>
        </div>
        <div className='w-1/4 flex flex-col items-stert'>
          <div className='font-semibold text-sm text-slate-800 mb-1'>Community</div>
          <a href='https://json-schema.slack.com/join/shared_invite/zt-15ylccbuu-3T2bRia8uzhE157TSW6nXg#/shared-invite/email' className='text-sm text-slate-400 hover:text-slate-500 pt-3'>Slack</a>
          <a href='https://twitter.com/jsonschema' className='text-sm text-slate-400 hover:text-slate-500 pt-3'>Twitter</a>
          <a href='https://github.com/json-schema-org' className='text-sm text-slate-400 hover:text-slate-500 pt-3'>GitHub</a>
          <a href='https://github.com/json-schema-org/community/discussions' className='text-sm text-slate-400 hover:text-slate-500 pt-3'>GitHub Community Discussions</a>
        </div>
      </footer>
    </div>
  )
}

const MainNavLink = ({ uri, label, activeRoutes }: { uri: string, label: string, activeRoutes?: string[] }) => {
  const router = useRouter()
  const isActive = (activeRoutes || []).includes(router.route)
  return (
    <Link href={uri}>
      <a
        className={classnames('font-semibold  p-4', {
          'text-blue-500 hover:text-blue-600': isActive,
          'text-slate-600 hover:text-slate-800': !isActive
        })}
      >{label}</a>
    </Link>
  )
}

type LayoutDocsProps = {
  children: React.ReactNode
  metaTitle?: string
}

export const LayoutDocs = ({ children, metaTitle }: LayoutDocsProps) => {
  return (
    <Layout mainClassNameWidth='w-full' metaTitle={metaTitle}>
      <div className='w-[1200px] mx-auto flex flex-row'>
        <DocsNav />
        <div className='flex-1'>
          {children}
        </div>

      </div>
    </Layout>
  )
}

const DocsNav = () => {
  return (
    <div className='w-[200px]'>
      <div className='text-slate-900 mb-2 font-semibold'>
        Getting started
      </div>
      <DocLink uri='/understanding-json-schema' label='Overview' />
      <Link href='/understanding-json-schema'>
        <a className='block text-slate-600 pl-4 border-l py-1'>Overview</a>
      </Link>
      <Link href='/understanding-json-schema/about'>
        <a className='block'>What is a schema?</a>
      </Link>
      <Link href='/understanding-json-schema/basics'>
        <a className='block'>The basics</a>
      </Link>
      <div></div>
      <div>Getting started</div>
      <div>Getting started</div>
      <div>Getting started</div>

    </div>
  )
}

const DocLink = ({ uri, label }: { uri: string, label: string }) => {
  return (
    <Link href={uri}>
      <a className='block text-slate-600 pl-4 border-l py-1'>{label}</a>
    </Link>
  )
}