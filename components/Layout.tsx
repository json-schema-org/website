import React, { useContext, useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import classnames from 'classnames'
import { useRouter } from 'next/router'
import { DocSearch } from '@docsearch/react'
import { HOST } from '~/lib/config'
import useStore from '~/store'
import { SectionContext } from '~/context'

type Props = {
  children: React.ReactNode
  mainClassName?: string
  metaTitle?: string
  whiteBg?: boolean
  hideAds?: boolean
}

const responsiveClasses = 'w-screen'

export default function Layout({ children, mainClassName, metaTitle, whiteBg, hideAds }: Props) {

  const showMobileNav = useStore(s => s.overlayNavigation === 'docs')
  const router = useRouter()
  React.useEffect(() => useStore.setState({ overlayNavigation: null }), [router.asPath])

  return (
    <div className='bg-slate-100 min-h-screen relative flex flex-col justify-between'>
      <FaviconHead />
      <Head>
        <title>JSON Schema {metaTitle ? ` - ${metaTitle}` : ''}</title>
        <meta name='description' content='JSON Schema' />
        <meta name='viewport' content='width=device-width, initial-scale=1, maximum-scale=1'></meta>
      </Head>
      <div className={classnames({ 'bg-white': whiteBg })}>
        <main className={
          classnames(mainClassName, responsiveClasses, 'z-10  bg-white xl:rounded-xl py-4 mx-auto')
        }>
          <header className={classnames(responsiveClasses, 'fixed top-0 z-[170] bg-white shadow-xl drop-shadow-lg')}>
            <div className='grid grid-cols-2  lg:grid-cols-3 py-4 justify-between items-center'>
              <Logo />
              <MainNavigation />
            </div>
          </header>
          
          {showMobileNav ? (
            <>
              <MobileNav />
              <ContentLayout>
                {children}
              </ContentLayout>
            </>
          ) : (
            <div>
              {!hideAds && (
                <div>
                  <script
                    async
                    type='text/javascript'
                    src='//cdn.carbonads.com/carbon.js?serve=CE7I627Y&placement=json-schemaorg'
                    id='_carbonads_js'
                    className='z-10'
                  />
                </div>
              )}
              <ContentLayout>
                {children}
              </ContentLayout>
            </div>
          )}
          
          <Footer />
          <OpenJS />
        </main>
      </div>
    </div>
  )
}

const ContentLayout = ({ children }: { children: any }) => {
  const section = useContext(SectionContext)
  const router = useRouter()

  const [open, setOpen] = useState(false)
  const [rotateChevron, setRotateChevron] = useState(false)
  const handleRotate = () => setRotateChevron(!rotateChevron)
  const rotate = rotateChevron ? 'rotate(180deg)' : 'rotate(0)'

  if (section === 'docs') return (
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
        <div className='flex flex-col' onClick={() => setTimeout(() => { setOpen(!open) }, 100)}>
          <DocsNav />
        </div>
      </div>

      <div className='max-w-[1400px] bg-white mx-auto grid grid-cols-1 lg:grid-cols-4 mx-12'>
        <div className='hidden lg:block mt-24 '>
          <DocsNav />
        </div>
        <div className='col-span-4 md:col-span-3 lg:mt-20 lg:w-5/6'>
          {children}
        </div>
      </div>
    </section>
  )
  return children
}
export const Search = () => {
  return (
    <DocSearch
      appId='6ZT4KX2OUI'
      apiKey='69f76fba13585144f6686622e9c8f2a8'
      indexName='json-schema'
    />
  )
}

const MainNavLink = ({ uri, label, isActive, className }: { uri: string, label: string, isActive: boolean, className?: string }) => {
  return (
    <Link scroll={false} href={uri}>
      <a className={classnames(className, 'font-semibold p-2 md:p-4', {
        'text-primary hover:text-primary': isActive,
        'text-slate-600 hover:text-primary': !isActive
      })}
      >{label}</a>
    </Link>
  )
}
const MainNavigation = () => {
  const section = useContext(SectionContext)
  // const docsAreActive = section === 'docs'
  const showMobileNav = useStore(s => s.overlayNavigation === 'docs')
  return (
    <div className='lg:col-span-2  md:py-2 flex items-center'>
      <MainNavLink
        className='hidden lg:block  hover:underline'
        uri='/specification'
        label='Specification'
        isActive={section === 'specification'}
      />
      <MainNavLink
        className='hidden lg:block  hover:underline'
        uri='/overview/what-is-jsonschema'
        label='Docs'
        isActive={section === 'docs'}
      />

      <MainNavLink
        className='hidden lg:block  hover:underline'
        uri='/implementations'
        label='Implementations'
        isActive={section === 'implementations'}
      />
      <MainNavLink
        className='hidden lg:block  hover:underline'
        uri='/blog'
        label='Blog'
        isActive={section === 'blog'}
      />
      <MainNavLink
        className='hidden lg:block  hover:underline'
        uri='/#community'
        label='Community'
        isActive={section === 'community'}
      />
      <div className='flex items-center gap-4   lg:ml-0'>
        <Search />

        {showMobileNav === false ? (<div
          className={classnames('mr-8 ')}
          onClick={() => useStore.setState({ overlayNavigation: 'docs' })}
        >
          <div className='block lg:hidden space-y-2 mr-8 items-center'>
            <div className='w-6 h-1 bg-black rounded'></div>
            <div className='w-6 h-1 bg-black rounded'></div>
            <div className='w-6 h-1 bg-black rounded'></div>
          </div>

        </div>
        ) : <div
          style={{ backgroundImage: 'url("/icons/cancel.svg")' }}
          className='h-6 w-6 bg-center bg-[length:22px_22px] bg-no-repeat mr-16 transition-all cursor-pointer'
          onClick={() => useStore.setState({ overlayNavigation: null })}
        />
        }
      </div>
    </div>
  )
}

const MobileNav = () => {
  const section = useContext(SectionContext)

  return (
    <div className='flex flex-col fixed bg-white w-full  z-[190] mt-16 left-0 pl-8'>
      <MainNavLink
        uri='/specification'
        label='Specification'
        isActive={section === 'specification'}
      />
      <MainNavLink
        uri='/overview/what-is-jsonschema'
        label='Docs'
        isActive={section === 'docs'}
      />

      <MainNavLink
        uri='/implementations'
        label='Implementations'
        isActive={section === 'implementations'}
      />
      <MainNavLink
        uri='/blog'
        label='Blog'
        isActive={section === 'blog'}
      />
      <MainNavLink
        uri='/#community'
        label='Community'
        isActive={section === 'community'}
      />
    </div>
  )
}

export const DocsNav = () => {

  const [active, setActive] = useState(false)
  const handleClick = () => {
    setActive(!active)
  }
  const [activeGet, setActiveGet] = useState(false)
  const handleClickGet = () => {
    setActiveGet(!activeGet)
  }
  const [activeReference, setActiveReference] = useState(false)
  const handleClickReference = () => {
    setActiveReference(!activeReference)
  }
  const [activeSpec, setActiveSpec] = useState(false)
  const handleClickSpec = () => {
    setActiveSpec(!activeSpec)
  }

  const [rotateChevron, setRotateChevron] = useState(false)
  const handleRotate = () => setRotateChevron(!rotateChevron)
  const rotate = rotateChevron ? 'rotate(180deg)' : 'rotate(0)'

  const [rotateGChevron, setRotateGChevron] = useState(false)
  const handleGetStarted = () => setRotateGChevron(!rotateGChevron)
  const rotateG = rotateGChevron ? 'rotate(180deg)' : 'rotate(0)'

  const [rotateReferenceChevron, setRotateReferenceChevron] = useState(false)
  const handleRotateReference = () => setRotateReferenceChevron(!rotateReferenceChevron)
  const rotateR = rotateReferenceChevron ? 'rotate(180deg)' : 'rotate(0)'

  const [rotateSpecChevron, setRotateSChevron] = useState(false)
  const handleRotateSpec = () => setRotateSChevron(!rotateSpecChevron)
  const rotateSpec = rotateSpecChevron ? 'rotate(180deg)' : 'rotate(0)'

  return (

    <div id='sidebar '
      className='lg:mt-8 w-4/5 mx-auto lg:ml-4'>
      <div className='mb-2 bg-slate-200 p-2 rounded'>
        <div className='flex justify-between w-full items-center' onMouseDown={e => e.stopPropagation()} onClick={(e) => { e.stopPropagation(); handleClick(); handleRotate() }} >
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
        <div className='flex justify-between w-full items-center' onMouseDown={e => e.stopPropagation()} onClick={(e) => { e.stopPropagation(); handleClickGet(); handleGetStarted() }} >
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
        <div className='flex justify-between w-full items-center' onMouseDown={e => e.stopPropagation()} onClick={(e) => { e.stopPropagation(); handleClickReference(); handleRotateReference() }}>
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
        <div className='flex justify-between w-full items-center' onMouseDown={e => e.stopPropagation()} onClick={(e) => { e.stopPropagation(); handleClickSpec(); handleRotateSpec() }}>
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

const SegmentHeadline = ({ label }: { label: string }) => {
  return (
    <div className='text-slate-900 font-bold'>
      {label}
    </div>
  )
}
const SegmentSubtitle = ({ label }: { label: string }) => {
  return (
    <div className='text-base italic text-slate-900 mt-2 mb-2'>
      {label}
    </div>
  )
}
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

const Footer = () => (
  <footer className={classnames(responsiveClasses, 'z-10 md:h-[300px]  bg-gradient-to-r from-startBlue from-1.95% to-endBlue clip-bottom mb-12')}>
    <div className='max-w-[1400px] mx-auto mt-4 grid grid-cols-1 md:grid-cols-2 md:w-1/2 lg:w-1/3 justify-center '>
      <div className=' my-6 m-auto md:mt-16'>
        <img src='/img/logos/logo-white.svg' className='w-[150px] mb-6' />
        <div className='flex flex-col'>
          <a href='https://opencollective.com/json-schema' className='text-white mb-2'>Open Collective</a>
          <a href='/understanding-json-schema/credits' className='text-white'>Acknowledgements</a>
        </div>
      </div>
      <div className='grid grid-cols-5 md:grid-cols-1 mx-auto md:mt-8 mb-4 md:mb-0 lg:ml-12'>
        <div className='mr-4 mb-4'>
          <a href='https://json-schema.slack.com/join/shared_invite/zt-1tc77c02b-z~UiKXqpM2gHchClKbUoXw#/shared-invite/email' className='flex items-center text-white'><img src='/img/logos/slack_logo_small-white.svg' className='w-4 h-4 mr-2' />
        Slack</a>
        </div>
        <div className='mb-4 mr-4'>
          <a href='https://twitter.com/jsonschema' className='flex items-center text-white'><img src='/img/logos/twitter_logo-white.svg' className='w-4 h-4 mr-2' />
         Twitter</a>
        </div>
        <div className='mr-4 mb-4'>
          <a href='https://linkedin.com/company/jsonschema/' className='flex items-center text-white'><img src='/img/logos/icons8-linkedin-2.svg' className='w-4 h-4 mr-2' />
          LinkedIn</a>
        </div>
        <div className='mr-4 mb-4'>
          <a href='https://www.youtube.com/@JSONSchemaOrgOfficial' className='flex items-center text-white'><img src='/img/logos/icons8-youtube.svg' className='w-4 h-4 mr-2' />
          Youtube</a>
        </div>
        <div className=''>
          <a href='https://github.com/json-schema-org' className='flex items-center text-white'><img src='/img/logos/github_logo-white.svg' className='w-4 h-4 mr-2' />
         GitHub</a>
        </div>
      </div>

    </div>
  </footer>
)

const OpenJS = () => (
  <div className={classnames(responsiveClasses, '')}>
    <div className='max-w-[1400px] mx-auto my-6 lg:mt-20 grid grid-cols-1 lg:grid-cols-2 w-4/5'>
      <div className='md:w-1/2 mb-12 lg:ml-28'>
        <img className='h-24 mx-auto mb-6 lg:mb-0' src='/img/logos/openjs_foundation-logo-horizontal-color.svg' alt='color openjs foundation logo'></img>
        {/* <div className='absolute bottom-0 ml-6  mb-12'>© {new Date().getFullYear()} Copyright JSON Schema Organisation </div> */}
      </div>
      <div className='md:w-5/6 lg:w-full mx-auto  mb-16'>
        <p className='mb-6'>Copyright <a className='text-linkBlue hover:text-blue-600' href='https://openjsf.org'>OpenJS Foundation</a> and JSON Schema contributors. All rights reserved. The <a className='text-linkBlue hover:text-blue-600' href='https://openjsf.org'>OpenJS Foundation</a> has registered trademarks and uses trademarks.  For a list of trademarks of the <a className='text-linkBlue hover:text-blue-600' href='https://openjsf.org'>OpenJS Foundation</a>, please see our <a className='text-linkBlue hover:text-blue-600' href='https://trademark-policy.openjsf.org'>Trademark Policy</a> and <a className='text-linkBlue hover:text-blue-600' href='https://trademark-list.openjsf.org'>Trademark List</a>.  Trademarks and logos not indicated on the <a className='text-linkBlue hover:text-blue-600' href='https://trademark-list.openjsf.org'>list of OpenJS Foundation trademarks</a> are trademarks&trade; or registered&reg; trademarks of their respective holders. Use of them does not imply any affiliation with or endorsement by them.</p>
        <p className='mb-4 sm:mb-8'><a className='text-linkBlue hover:text-blue-600' href='https://openjsf.org'>The OpenJS Foundation</a> | <a className='text-linkBlue hover:text-blue-600' href='https://terms-of-use.openjsf.org'>Terms of Use</a> | <a className='text-linkBlue hover:text-blue-600' href='https://privacy-policy.openjsf.org'>Privacy Policy</a> | <a className='text-linkBlue hover:text-blue-600' href='https://bylaws.openjsf.org'>Bylaws</a> | <a className='text-linkBlue hover:text-blue-600' href='https://code-of-conduct.openjsf.org'>Code of Conduct</a> | <a className='text-linkBlue hover:text-blue-600' href='https://trademark-policy.openjsf.org'>Trademark Policy</a> | <a className='text-linkBlue hover:text-blue-600' href='https://trademark-list.openjsf.org'>Trademark List</a> | <a className='text-linkBlue hover:text-blue-600' href='https://www.linuxfoundation.org/cookies'>Cookie Policy</a></p>
      </div>
    </div>
  </div>
)

const Logo = () => (
  <Link href='/' >
    <a className='ml-12 lg:ml-0'>
      <div className='lg:ml-20 inline-block '>
        <img src='/img/logos/logo-blue.svg' className='h-12 mr-2' />
      </div>
    </a>
  </Link>
)

const FaviconHead = () => {
  const [isDarkMode, setIsDarkMode] = React.useState(false)
  const onUpdate = React.useCallback((matcher: MediaQueryList) => {
    setIsDarkMode(matcher.matches)
  }, [])

  React.useEffect(() => {
    const matcher: MediaQueryList = window.matchMedia('(prefers-color-scheme: dark)')
    matcher.addEventListener('change', () => onUpdate(matcher))
    onUpdate(matcher)
  }, [])

  if (isDarkMode) {
    return (
      <Head>
        <link rel='icon' type='image/svg' href='/favicon-lightblue.ico' id='dark-scheme-icon' />
      </Head>

    )
  }
  return (
    <Head>
      <link rel='icon' type='image/svg+xml' href='/favicon.ico' id='light-scheme-icon' />
    </Head>
  )
}

