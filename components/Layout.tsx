import React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import classnames from 'classnames'
import { useRouter } from 'next/router'
import { DocSearch } from '@docsearch/react'

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
          <div className='flex flex-row items-center'>
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
          </div>

          <div className='py-2 flex flex-row items-center'>
            <MainNavLink
              uri='/understanding-json-schema'
              label='Docs'
              activeRoutes={[
                '/understanding-json-schema',
                '/understanding-json-schema/[slug]',
                '/understanding-json-schema/reference/[slug]',
                '/learn/[slug]',
              ]}
            />
            <MainNavLink
              uri='/blog'
              label='Blog'
              activeRoutes={['/blog', '/blog/posts/[slug]']}
            />
            <Search />
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
          <div className='font-semibold text-sm text-slate-800 mb-1'>Learn</div>
          <a href='/learn/getting-started-step-by-step' className='text-sm text-slate-400 hover:text-slate-500 pt-3'>Getting Started Step-By-Step</a>
          <a href='/understanding-json-schema/conventions' className='text-sm text-slate-400 hover:text-slate-500 pt-3'>Conventions on json-schema.org</a>
        </div>
        <div className='w-1/4 flex flex-col items-stert'>
          <div className='font-semibold text-sm text-slate-800 mb-1'>Community</div>
          <a href='https://json-schema.slack.com/join/shared_invite/zt-15ylccbuu-3T2bRia8uzhE157TSW6nXg#/shared-invite/email' className='text-sm text-slate-400 hover:text-slate-500 pt-3'>Slack</a>
          <a href='https://twitter.com/jsonschema' className='text-sm text-slate-400 hover:text-slate-500 pt-3'>Twitter</a>
          <a href='https://github.com/json-schema-org' className='text-sm text-slate-400 hover:text-slate-500 pt-3'>GitHub</a>
          <a href='https://github.com/json-schema-org/community/discussions' className='text-sm text-slate-400 hover:text-slate-500 pt-3'>GitHub Community Discussions</a>
          <a href='https://groups.google.com/g/json-schema' className='text-sm text-slate-400 hover:text-slate-500 pt-3'>Google Groups</a>
        </div>
      </footer>
    </div>
  )
}

const Search = () => {
  return (
    <DocSearch
      appId='6ZT4KX2OUI'
      apiKey='69f76fba13585144f6686622e9c8f2a8'
      indexName='json-schema'
    />
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
    <div className='w-[200px] pt-2'>
      <SegmentHeadline label='Getting started' />
      <DocLink uri='/understanding-json-schema' label='Overview' />
      <DocLink uri='/understanding-json-schema/about' label='What is a schema?' />
      <DocLink uri='/understanding-json-schema/basics' label='The basics' />
      <DocLink uri='/understanding-json-schema/reference/generic' label='Generic keywords' />

      <SegmentHeadline label='Examples & studies' />
      <DocLink uri='/learn/getting-started-step-by-step' label='Creating a schema' />
      <DocLink uri='/learn/miscellaneous-examples' label='Miscellaneous Examples' />
      <DocLink uri='/learn/file-system' label={'Example \'File system\''} />
      <DocLink uri='/learn/json-schema-examples' label='More examples' />

      <SegmentHeadline label='Basic types' />
      <DocLink uri='/understanding-json-schema/reference/type' label={<><span className='font-semibold'>type</span> keyword</>} />
      <DocLink uri='/understanding-json-schema/reference/string' label='string' />
      <DocLink uri='/understanding-json-schema/reference/numeric' label='numeric' />
      <DocLink uri='/understanding-json-schema/reference/regular_expressions' label='regular expressions' />
      <DocLink uri='/understanding-json-schema/reference/object' label='object' />
      <DocLink uri='/understanding-json-schema/reference/array' label='array' />
      <DocLink uri='/understanding-json-schema/reference/boolean' label='boolean' />
      <DocLink uri='/understanding-json-schema/reference/null' label='null' />

      <SegmentHeadline label='Advanced Concepts' />
      <DocLink uri='/understanding-json-schema/structuring' label='Structuring a complex schema' />
      <DocLink uri='/understanding-json-schema/reference/combining' label='Schema Composition' />
      <DocLink uri='/understanding-json-schema/reference/conditionals' label='Condition Subschemas' />
      <DocLink uri='/understanding-json-schema/reference/non_json_data' label='Non-JSON data' />
      <DocLink uri='/understanding-json-schema/reference/schema' label='Declaring a Dialect' />
    </div>
  )
}

const SegmentHeadline = ({ label }: { label: string }) => {
  return (
    <div className='text-slate-900 mb-2 mt-8 font-semibold'>
      {label}
    </div>
  )
}

const DocLink = ({ uri, label }: { uri: string, label: string | React.ReactNode }) => {
  const router = useRouter()
  console.log('router', router)
  const isActive = uri === router.asPath
  return (
    <Link href={uri}>
      <a className={classnames('block pl-4 border-l py-1', {
        'text-slate-600': !isActive,
        'text-blue-500 font-semibold': isActive,
      })}>{label}</a>
    </Link>
  )
}
