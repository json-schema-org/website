import React from 'react'
import Head from 'next/head'

export default function Layout ({ children }: { children: React.ReactNode }) {
  return (
    <div className='bg-slate-100 min-h-screen flex flex-col justify-between'>
      <Head>
        <title>JSON Schema</title>
        <meta name='description' content='JSON Schema' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <div>
        <header className='bg-slate-500 p-4'>
          <div className='w-[1200px] mx-auto text-3xl'>
            header
          </div>
        </header>
        <main className='bg-white rounded-xl p-4 w-[1200px] mx-auto mt-4'>
          {children}
        </main>
      </div>

      <footer className='w-[1200px] mx-auto text-3xl p-4'>
        footer
      </footer>
    </div>
  )
}