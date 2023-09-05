import { getLayout as getSiteLayout } from './SiteLayout'
import React, { useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { HOST } from '~/lib/config'
import classnames from 'classnames'
// import { DocsNav } from './Layout'
import { SegmentHeadline } from './Layout'


const DocLink = ({ uri, label }: { uri: string, label: string | React.ReactNode }) => {
  const router = useRouter()
  const url = new URL(`${router.asPath}`, HOST)
  url.search = ''
  url.hash = ''
  const stringUrl = url.toString().substr(HOST.length, Infinity)
  const isActive = uri === stringUrl
  return (
    <Link href={uri}>
      <a
        className={classnames('text-base block border-l-2 py-1 pl-2', {
          '  font-medium': !isActive,
          'text-primary text-bold border-l-primary font-semibold': isActive,
        })}
      >{label}</a>
    </Link>
  )
}


const SegmentSubtitle = ({ label }: { label: string }) => {
  return (
    <div className='text-base italic text-slate-900 mt-2 mb-2'>
      {label}
    </div>
  )
}
const getDocsPath = [
  '/overview/what-is-jsonschema'
]
const getStartedPath = [
  '/learn/json-schema-examples',
  '/learn/file-system',
  '/learn/miscellaneous-examples',
  '/learn/getting-started-step-by-step'
]
const referencePath = [
  '/understanding-json-schema',
  '/understanding-json-schema/reference/[slug]',
  '/understanding-json-schema/[slug]',
  '/learn/glossary'
]
const specificationPath = [
  '/draft/2020-12/[slug]',
  '/draft-06/[slug]',
  '/draft-07/[slug]',
  '/draft-05/[slug]',
  '/draft/2019-09/[slug]',
  '/[slug]',
]
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

          {router.asPath === '/overview/what-is-jsonschema' && <h3 className='text-white ml-12'>Overview</h3>}
          {getStartedPath.includes(router.asPath) && <h3 className='text-white ml-12'>Getting Started</h3>}

          {referencePath.includes(router.asPath) && <h3 className='text-white ml-12'>Reference</h3>}

          {specificationPath.includes(router.asPath) || router.asPath === '/specification' && <h3 className='text-white ml-12'>Specification</h3>}

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
        <div className='hidden lg:block mt-24'>
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

export const DocsNav = () => {
  const router = useRouter()
  /* eslint-disable no-constant-condition */
  const [active, setActive] = useState(true ? getDocsPath.includes(router.asPath) : false)
  const handleClick = () => {
    setActive(!active)
  }
// console.log(router.asPath)
  const [activeGet, setActiveGet] = useState(true ? getStartedPath.includes(router.asPath) : false)
  const handleClickGet = () => {
    setActiveGet(!activeGet)
  }

  const [activeReference, setActiveReference] = useState(true ? referencePath.includes(router.asPath) : false)
  const handleClickReference = () => {
    setActiveReference(!activeReference)
  }

  const [activeSpec, setActiveSpec] = useState(true ? specificationPath.includes(router.pathname) : false)

  const handleClickSpec = () => {
    setActiveSpec(!activeSpec)
  }

  const rotate = active ? 'rotate(180deg)' : 'rotate(0)'

  const rotateG = activeGet ? 'rotate(180deg)' : 'rotate(0)'

  const rotateR = activeReference ? 'rotate(180deg)' : 'rotate(0)'

  const rotateSpec = activeSpec ? 'rotate(180deg)' : 'rotate(0)'

  return (

    <div id='sidebar '
      className='lg:mt-8 w-4/5 mx-auto lg:ml-4'>
      <div className='mb-2 bg-slate-200 p-2 rounded'>
        <div className='flex justify-between w-full items-center' onMouseDown={e => e.stopPropagation()} onClick={(e) => {e.preventDefault(); e.stopPropagation(); handleClick() }} >
          <div className='flex  items-center align-middle'>
            <img src='/icons/eye.svg' alt='eye icon' className='mr-2' />
            <SegmentHeadline label='Overview' />
          </div>
          <svg style={{ transform: rotate, transition: 'all 0.2s linear' }} id='arrow' xmlns='http://www.w3.org/2000/svg' fill='none' height='32' viewBox='0 0 24 24' width='24'><path clipRule='evenodd' d='m16.5303 8.96967c.2929.29289.2929.76777 0 1.06063l-4 4c-.2929.2929-.7677.2929-1.0606 0l-4.00003-4c-.29289-.29286-.29289-.76774 0-1.06063s.76777-.29289 1.06066 0l3.46967 3.46963 3.4697-3.46963c.2929-.29289.7677-.29289 1.0606 0z' fill='#707070' fillRule='evenodd' /></svg>
        </div>
        <div
          className={`${active ? '' : 'hidden'
          } text-left text-sm mt-2 w-4/5 mx-auto `}
          id='overview'
        >
          <DocLink uri='/overview/what-is-jsonschema' label='What is JSON Schema?' />
        </div>
      </div>
      {/* Get Started */}
      <div className='mb-2 bg-slate-200 p-2 rounded'>
        <div className='flex justify-between w-full items-center' onMouseDown={e => e.stopPropagation()} onClick={(e) => {e.preventDefault(); e.stopPropagation(); handleClickGet() }} >
          <div className='flex  items-center align-middle' >
            <img src='/icons/compass.svg' alt='eye icon' className='mr-2' />
            <SegmentHeadline label='Getting Started' />
          </div>
          <svg style={{ transform: rotateG, transition: 'all 0.2s linear' }} id='arrow' xmlns='http://www.w3.org/2000/svg' fill='none' height='32' viewBox='0 0 24 24' width='24'><path clipRule='evenodd' d='m16.5303 8.96967c.2929.29289.2929.76777 0 1.06063l-4 4c-.2929.2929-.7677.2929-1.0606 0l-4.00003-4c-.29289-.29286-.29289-.76774 0-1.06063s.76777-.29289 1.06066 0l3.46967 3.46963 3.4697-3.46963c.2929-.29289.7677-.29289 1.0606 0z' fill='#707070' fillRule='evenodd' /></svg>
        </div>
        <div
          className={`${activeGet ? '' : 'hidden'
          } text-left text-sm mt-2 w-4/5 mx-auto `}
          id='getStarted'
        >
          <DocLink uri='/learn/getting-started-step-by-step' label='Creating your first schema' />
          <SegmentSubtitle label='Examples' />
          <DocLink uri='/learn/miscellaneous-examples' label='Miscellaneous examples' />
          <DocLink uri='/learn/file-system' label='Modelling a file system' />
          <DocLink uri='/learn/json-schema-examples' label='Other examples' />
        </div>
      </div>
      {/* Reference */}
      <div className='mb-2 bg-slate-200 p-2 rounded'>
        <div className='flex justify-between w-full items-center' onMouseDown={e => e.stopPropagation()} onClick={(e) => {e.preventDefault(); e.stopPropagation(); handleClickReference() }}>
          <div className='flex  items-center align-middle' >
            <img src='/icons/book.svg' alt='eye icon' className='mr-2' />
            <SegmentHeadline label='Reference' />
          </div>
          <svg style={{ transform: rotateR, transition: 'all 0.2s linear' }} id='arrow' xmlns='http://www.w3.org/2000/svg' fill='none' height='32' viewBox='0 0 24 24' width='24'><path clipRule='evenodd' d='m16.5303 8.96967c.2929.29289.2929.76777 0 1.06063l-4 4c-.2929.2929-.7677.2929-1.0606 0l-4.00003-4c-.29289-.29286-.29289-.76774 0-1.06063s.76777-.29289 1.06066 0l3.46967 3.46963 3.4697-3.46963c.2929-.29289.7677-.29289 1.0606 0z' fill='#707070' fillRule='evenodd' /></svg>
        </div>
        <div className={`${activeReference ? '' : 'hidden'
        }   text-left text-sm mt-2 w-4/5 mx-auto font-bold`}
        id='reference'
        >
          <DocLink uri='/learn/glossary' label='JSON Schema Glossary' />
          <DocLink uri='https://www.learnjsonschema.com/' label='Learn JSON Schema' />
          <DocLink uri='/understanding-json-schema' label='Understanding JSON Schema' />
          <div className='pl-4 pb-1 pt-1'>
            <DocLink uri='/understanding-json-schema/conventions' label='Conventions used in this book' />
            <DocLink uri='/understanding-json-schema/about' label='What is a schema?' />
            <div className='pl-4 pb-1 pt-1'>
              <DocLink uri='/understanding-json-schema/basics' label='The basics' />
              <div className='pl-4 pb-1 pt-1'>
                <DocLink uri='/understanding-json-schema/basics#hello-world!' label='Hello, World!' />
                <DocLink uri='/understanding-json-schema/basics#the-type-keyword' label='The type keyword' />
                <DocLink uri='/understanding-json-schema/basics#declaring-a-json-schema' label='Declaring a JSON Schema' />
                <DocLink uri='/understanding-json-schema/basics#declaring-a-unique-identifier' label='Declaring a unique identifier' />
              </div>
              <SegmentSubtitle label='JSON Schema Reference' />
              <DocLink uri='/understanding-json-schema/reference/type' label='Type-specific keywords' />
              <DocLink uri='/understanding-json-schema/reference/string' label='string' />
              <DocLink uri='/understanding-json-schema/reference/regular_expressions' label='regular expressions' />
              <DocLink uri='/understanding-json-schema/reference/numeric' label='numeric types' />
              <DocLink uri='/understanding-json-schema/reference/object' label='object' />
              <DocLink uri='/understanding-json-schema/reference/array' label='array' />
              <DocLink uri='/understanding-json-schema/reference/boolean' label='boolean' />
              <DocLink uri='/understanding-json-schema/reference/null' label='null' />
              <DocLink uri='/understanding-json-schema/reference/annotations' label='Generic keywords' />
              <DocLink uri='/understanding-json-schema/reference/non_json_data' label='Media: string-encoding non-JSON data' />
              <DocLink uri='/understanding-json-schema/reference/combining' label='Schema Composition' />
              <DocLink uri='/understanding-json-schema/reference/conditionals' label='Applying Subschemas Conditionally' />
              <DocLink uri='/understanding-json-schema/reference/schema' label='Declaring a Dialect' />
              <DocLink uri='/understanding-json-schema/structuring' label='Structuring a complex schema' />
              <div className='pl-4 pb-1 pt-1'>
                <DocLink uri='/understanding-json-schema/structuring#schema-identification' label='Schema Identification' />
                <DocLink uri='/understanding-json-schema/structuring#base-uri' label='Base URI' />
                <DocLink uri='/understanding-json-schema/structuring#ref' label='$ref' />
                <DocLink uri='/understanding-json-schema/structuring#defs' label='$defs' />
                <DocLink uri='/understanding-json-schema/structuring#recursion' label='Recursion' />
                <DocLink uri='/understanding-json-schema/structuring#extending-recursive-schemas' label='Extending Recursive Schemas' />
                <DocLink uri='/understanding-json-schema/structuring#bundling' label='Bundling' />
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Specification */}
      <div className='mb-2 bg-slate-200 p-2 rounded'>
        <div className='flex justify-between w-full items-center' onMouseDown={e => e.stopPropagation()} onClick={(e) => {e.preventDefault(); e.stopPropagation(); handleClickSpec() }}>
          <div className='flex  items-center align-middle'>
            <img src='/icons/clipboard.svg' alt='eye icon' className='mr-2' />
            <SegmentHeadline label='Specification' />
          </div>
          <svg id='arrow' className='arrow' style={{ transform: rotateSpec, transition: 'all 0.2s linear' }} xmlns='http://www.w3.org/2000/svg' fill='none' height='32' viewBox='0 0 24 24' width='24'><path clipRule='evenodd' d='m16.5303 8.96967c.2929.29289.2929.76777 0 1.06063l-4 4c-.2929.2929-.7677.2929-1.0606 0l-4.00003-4c-.29289-.29286-.29289-.76774 0-1.06063s.76777-.29289 1.06066 0l3.46967 3.46963 3.4697-3.46963c.2929-.29289.7677-.29289 1.0606 0z' fill='#707070' fillRule='evenodd' /></svg>

        </div>
        <div
          className={`${activeSpec ? '' : 'hidden'
          }   text-left text-sm mt-2 w-4/5 mx-auto `}
          id='specification'
        >
          <DocLink uri='/specification' label='Overview' />
          <DocLink uri='/draft/2020-12/release-notes' label='2020-12 notes' />
          <DocLink uri='/draft/2019-09/release-notes' label='2019-09 notes' />
          <DocLink uri='/draft-07/readme' label='draft-07 notes' />
          <DocLink uri='/draft-06/readme' label='draft-06 notes' />
          <DocLink uri='/draft-05/readme' label='draft-05 notes' />
          <DocLink uri='/specification-links' label='Specification Links' />
        </div>
      </div>
    </div>

  )
}