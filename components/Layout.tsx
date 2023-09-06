import React, { useContext } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import classnames from 'classnames'
import { useRouter } from 'next/router'
import { DocSearch } from '@docsearch/react'

import useStore from '~/store'
import { SectionContext } from '~/context'


type Props = {
  children: React.ReactNode
  mainClassName?: string
  metaTitle?: string
  whiteBg?: boolean
  hideAds?: boolean
}

// const responsiveClasses = 'w-screen'

export default function Layout({ children, mainClassName, metaTitle, whiteBg, hideAds }: Props) {

  const showMobileNav = useStore((s: any) => s.overlayNavigation === 'docs')

  const router = useRouter()
  React.useEffect(() => useStore.setState({ overlayNavigation: null }), [router.asPath])

  return (
    <div className='min-h-screen relative flex flex-col justify-between'>
      <FaviconHead />
      <Head>
        <title>JSON Schema {metaTitle ? ` - ${metaTitle}` : ''}</title>
        <meta name='description' content='JSON Schema' />
        <meta name='viewport' content='width=device-width, initial-scale=1, maximum-scale=1'></meta>
      </Head>
      <div className={classnames({ 'bg-white': whiteBg })}>
        <main className={
          classnames(mainClassName, 'z-10 xl:rounded-xl py-4 mx-auto')
        }>
          <header className={classnames('w-full bg-white fixed top-0 z-[170] shadow-xl drop-shadow-lg')}>
            <div className='flex justify-between items-center md:ml-8 2xl:px-12 py-4'>
              <Logo />
              <MainNavigation />
            </div>
          </header>
          {showMobileNav ? (
            <>
              <MobileNav />
              {children}
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
              {children}
            </div>
          )}
          <Footer />
          <OpenJS />
        </main>
      </div>
    </div>
  )
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

/* eslint-disable @typescript-eslint/no-unused-vars */
const MainNavLink = ({ uri, label, isActive, className }: { uri: string, label: string, isActive: boolean, className?: string }) => {
  const router = useRouter()
  return (
    <Link href={uri}>
      <a className={classnames(className, 'font-semibold p-2 md:p-4', `${
        router.asPath === uri ? 'text-primary hover:text-primary' : 'text-slate-600 hover:text-primary'
      }`
        
      )}
      >{label}</a>
    </Link>
  )
}

//clarify below code  - active link is not working properly   -  need to check  -  1st link is always active  -  need to check    -  2nd link is not active  -  need to check  
const MainNavigation = () => {
  const section = useContext(SectionContext)
  const showMobileNav = useStore((s: any) => s.overlayNavigation === 'docs')

  return (
    <div className='flex items-center ml-12   md:mr-12'>
      <MainNavLink
        className='hidden lg:block hover:underline'
        uri='/specification'
        label='Specification'
        isActive={section === 'specification'}
      />
      <MainNavLink
        className='hidden lg:block hover:underline'
        uri='/overview/what-is-jsonschema'
        label='Docs'
        isActive={section === 'docs'}
      />

      <MainNavLink
        className='hidden lg:block hover:underline'
        uri='/implementations'
        label='Implementations'
        isActive={section === 'implementations'}
      />
      <MainNavLink
        className='hidden lg:block hover:underline'
        uri='/blog'
        label='Blog'
        isActive={section === 'blog'}
      />
      <MainNavLink
        className='hidden lg:block hover:underline'
        uri='/#community'
        label='Community'
        isActive={section === 'community'}
      />
      <div className='flex items-center gap-12 md:gap-4'>
        <div className='rounded border-2 border-gray-100 ml-0 w-2/5 md:w-full'>
          <Search />
        </div>
        {showMobileNav === false ? (
          <div
            onClick={() => useStore.setState({ overlayNavigation: 'docs' })}
          >
            <div className='block lg:hidden space-y-2  items-center'>
              <div className='w-6 h-1 bg-black rounded'></div>
              <div className='w-6 h-1 bg-black rounded'></div>
              <div className='w-6 h-1 bg-black rounded'></div>
            </div>

          </div>
        ) : <div
          style={{ backgroundImage: 'url("/icons/cancel.svg")' }}
          className='h-6 w-6 bg-center bg-[length:22px_22px] bg-no-repeat  transition-all cursor-pointer'
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



export const SegmentHeadline = ({ label }: { label: string }) => {
  return (
    <div className='text-slate-900 font-bold'>
      {label}
    </div>
  )
}

const Footer = () => (
  <footer className={classnames('z-10 md:h-[300px]  bg-gradient-to-r from-startBlue from-1.95% to-endBlue clip-bottom mb-12')}>
    <div className='max-w-[1400px] mx-auto mt-4 grid grid-cols-1 md:grid-cols-2 md:w-1/2 lg:w-1/3 justify-center '>
      <div className=' my-6 m-auto md:mt-16'>
        <img src='/img/logos/logo-white.svg' className='w-[150px] mb-6' />
        <div className='flex flex-col'>
          <a href='https://opencollective.com/json-schema' className='text-white mb-2'>Open Collective</a>
          <a href='/understanding-json-schema/credits' className='text-white'>Acknowledgements</a>
        </div>
      </div>
      <div className='grid grid-cols-3 md:grid-cols-1 mx-auto md:mt-8 mb-4 md:mb-0 lg:ml-12'>
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
  <div className={classnames('')}>
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
    <a href='/' className=''>
      <img src='/img/logos/logo-blue.svg' className='h-12 mr-2 ' />
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