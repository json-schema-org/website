import { getLayout as getSiteLayout } from './SiteLayout'
import React, { useState } from 'react'
import { useRouter } from 'next/router'
import { DocsNav } from './Layout'

export const SidebarLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [rotateChevron, setRotateChevron] = useState(false)
  const handleRotate = () => setRotateChevron(!rotateChevron)
  const rotate = rotateChevron ? 'rotate(180deg)' : 'rotate(0)'
  
  return (
    <section>
      <div className='bg-primary w-full h-12 mt-[4.5rem] z-150 flex relative flex-col justify-between items-center lg:hidden' >
        <div className='z-[150] flex w-full bg-primary justify-between items-center mt-2' onMouseDown={e => e.stopPropagation()} onClick={(e) => { e.stopPropagation(); handleRotate(); setOpen(!open) }}>
  
          {router.pathname === '/overview/[slug]' && <h3 className='text-white ml-12'>Overview</h3>}
          {router.pathname === '/learn/[slug]' && router.asPath !== '/learn/glossary' && <h3 className='text-white ml-12'>Getting Started</h3>}
          {router.asPath === '/learn/glossary' && <h3 className='text-white ml-12'>Reference</h3>}
  
          {router.pathname === '/understanding-json-schema' && <h3 className='text-white ml-12'>Reference</h3>}
          {router.pathname === '/understanding-json-schema/reference/[slug]' && <h3 className='text-white ml-12'>Reference</h3>}
          {router.pathname === '/understanding-json-schema/[slug]' && <h3 className='text-white ml-12'>Reference</h3>}
  
          {router.pathname === '/draft/2020-12/[slug]' && <h3 className='text-white ml-12'>Specification</h3>}
          {router.pathname === '/draft-06/[slug]' && <h3 className='text-white ml-12'>Specification</h3>}
          {router.pathname === '/draft-07/[slug]' && <h3 className='text-white ml-12'>Specification</h3>}
          {router.pathname === '/draft-05/[slug]' && <h3 className='text-white ml-12'>Specification</h3>}
          {router.pathname === '/draft/2019-09/[slug]' && <h3 className='text-white ml-12'>Specification</h3>}
          {router.pathname === '/[slug]' && <h3 className='text-white ml-12'>Specification</h3>}
  
          {router.pathname === null && <h3 className='text-white ml-12'>Docs</h3>}
          <svg style={{ marginRight: '50px', color: 'white', transform: rotate, transition: 'all 0.2s linear' }} xmlns='http://www.w3.org/2000/svg' height='24' viewBox='0 0 256 512'><path d='M64 448c-8.188 0-16.38-3.125-22.62-9.375c-12.5-12.5-12.5-32.75 0-45.25L178.8 256L41.38 118.6c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0l160 160c12.5 12.5 12.5 32.75 0 45.25l-160 160C80.38 444.9 72.19 448 64 448z' id='mainIconPathAttribute' fill='#ffffff'></path></svg>
        </div>
      </div>
  
      <div className={`z-[150] absolute top-10 mt-24 left-0 h-full w-screen bg-white transform ${open ? '-translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out filter drop-shadow-md `}>
        <div className='flex flex-col mt-4' onClick={() => setTimeout(() => { setOpen(!open) }, 100)}>
          <DocsNav />
        </div>
      </div>
  
      <div className='max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-4 mx-4 md:mx-12'>
        <div className='hidden lg:block mt-24 '>
          <DocsNav />
        </div>
        <div className='col-span-4 md:col-span-3 lg:mt-20 lg:w-5/6 mx-4 md:mx-0'>
          {children}
        </div>
      </div>
    </section>
  )
  
}
  
export const getLayout = (page: React.ReactNode) =>
  getSiteLayout(<SidebarLayout>{page}</SidebarLayout>)