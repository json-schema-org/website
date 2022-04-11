import React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import classnames from 'classnames'

type Props = {
  children: React.ReactNode
  mainClassName?: string
  metaTitle?: string
}

export default function Layout ({ children, mainClassName, metaTitle }: Props) {
  return (
    <div className='bg-slate-100 min-h-screen h-auto overflow-scroll flex flex-col justify-between'>
      <Head>
        <title>JSON Schema {metaTitle ? ` - ${metaTitle}` : ''}</title>
        <meta name='description' content='JSON Schema' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <div>
        <header className='flex flex-row justify-between p-4 w-[1200px] mx-auto'>
          <Link href="/">
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
            <Link href="/docs">
              <a className='font-semibold text-slate-600 hover:text-slate-800 p-4'>Docs</a>
            </Link>
            <Link href="/blog">
              <a className='font-semibold text-slate-600 hover:text-slate-800 p-4'>Blog</a>
            </Link>
            <Link href="/community">
              <a className='font-semibold text-slate-600 hover:text-slate-800 p-4'>Community</a>
            </Link>
          </div>
        </header>
        <main className={classnames(mainClassName, 'bg-white rounded-xl p-4 w-[1200px] mx-auto mt-4')}>
          {children}
        </main>
      </div>

      <footer className='w-[1200px] mx-auto p-4 py-16 flex flex-row'>
        <div className='w-1/4 flex flex-col items-stert'>
          <div className='font-semibold text-sm text-slate-800'>Specification</div>
          <Link href="/specification">
            <a className='text-sm text-slate-400 hover:text-slate-500 py-4'>Overview</a>
          </Link>
        </div>
        <div className='w-1/4 flex flex-col items-stert'>
          <div className='font-semibold text-sm text-slate-800'>Community</div>
          <Link href="/blog">
            <a className='text-sm text-slate-400 hover:text-slate-500 py-4'>Slack</a>
          </Link>
        </div>
      </footer>
    </div>
  )
}