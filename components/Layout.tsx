import React, { useContext, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import classnames from 'classnames';
import { useRouter } from 'next/router';
import { DocSearch } from '@docsearch/react';
import useStore from '~/store';
import { SectionContext } from '~/context';
import extractPathWithoutFragment from '~/lib/extractPathWithoutFragment';

type Props = {
  children: React.ReactNode;
  mainClassName?: string;
  metaTitle?: string;
  whiteBg?: boolean;
};

// const responsiveClasses = 'w-screen'

export default function Layout({
  children,
  mainClassName,
  metaTitle,
  whiteBg,
}: Props) {
  const showMobileNav = useStore((s: any) => s.overlayNavigation === 'docs');

  const router = useRouter();

  React.useEffect(
    () => useStore.setState({ overlayNavigation: null }),
    [router.asPath],
  );

  useEffect(() => {
    // Check if the URL contains "#community"
    if (window.location.hash === '#community') {
      // Find the anchor element by its ID
      const target = document.getElementById('community');

      // Scroll to the anchor element if it exists
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, []);

  const newTitle = `JSON Schema${metaTitle ? ` - ${metaTitle}` : ''}`;
  return (
    <div className='min-h-screen relative flex flex-col justify-between'>
      <FaviconHead />
      <Head>
        <title>{newTitle}</title>
        <meta name='description' content='JSON Schema' />
        <meta
          name='viewport'
          content='width=device-width, initial-scale=1, maximum-scale=1'
        ></meta>
      </Head>
      <div className={classnames({ 'bg-white': whiteBg })}>
        <main
          className={classnames(
            mainClassName,
            'z-10 xl:rounded-xl pt-4 mx-auto',
          )}
        >
          <header
            className={classnames(
              'w-full bg-white fixed top-0 z-[170] shadow-xl drop-shadow-lg',
            )}
          >
            <div className='w-full flex md:justify-between items-center ml-8 2xl:px-12 py-4'>
              <Logo />
              <MainNavigation />
            </div>
          </header>
          {showMobileNav ? (
            <div>
              <MobileNav />
              {children}
            </div>
          ) : (
            <div>{children}</div>
          )}
          <Footer />
        </main>
      </div>
    </div>
  );
}

export const Search = () => {
  return (
    <DocSearch
      appId='6ZT4KX2OUI'
      apiKey='69f76fba13585144f6686622e9c8f2a8'
      indexName='json-schema'
    />
  );
};

/* eslint-disable @typescript-eslint/no-unused-vars */
const MainNavLink = ({
  uri,
  label,
  className,
  isActive,
}: {
  uri: string;
  label: string;
  isActive: boolean;
  className?: string;
}) => {
  const router = useRouter();
  return (
    <Link
      href={uri}
      className={classnames(
        className,
        'font-semibold p-2 md:p-4',
        `${extractPathWithoutFragment(router.asPath) === uri ? 'text-primary hover:text-primary' : 'text-slate-600 hover:text-primary'}`,
      )}
    >
      {label}
    </Link>
  );
};

const MainNavigation = () => {
  const section = useContext(SectionContext);
  const showMobileNav = useStore((s: any) => s.overlayNavigation === 'docs');

  return (
    <div className='flex justify-end mr-8 w-full'>
      <MainNavLink
        className='hidden lg:block hover:underline'
        uri='/specification'
        label='Specification'
        isActive={section === 'specification'}
      />
      <MainNavLink
        className='hidden lg:block hover:underline'
        uri='/learn/getting-started-step-by-step'
        label='Docs'
        isActive={section === 'docs'}
      />

      <MainNavLink
        className='hidden lg:block hover:underline'
        uri='/implementations'
        label='Tools'
        isActive={section === 'tools'}
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
      <div className='flex max-sm:ml-4 items-center gap-6 md:gap-4'>
        <div className='flex justify-center rounded border-2 border-gray-100 ml-0 w-[120px] md:w-full'>
          <Search />
        </div>
        {showMobileNav === false ? (
          <div onClick={() => useStore.setState({ overlayNavigation: 'docs' })}>
            <div className='block lg:hidden space-y-2  items-center'>
              <div className='w-6 h-1 bg-black rounded'></div>
              <div className='w-6 h-1 bg-black rounded'></div>
              <div className='w-6 h-1 bg-black rounded'></div>
            </div>
          </div>
        ) : (
          <div
            style={{ backgroundImage: 'url("/icons/cancel.svg")' }}
            className='h-6 w-6 bg-center bg-[length:22px_22px] bg-no-repeat  transition-all cursor-pointer'
            onClick={() => useStore.setState({ overlayNavigation: null })}
          />
        )}
      </div>
      <div className='flex items-center justify-end mr-8'>
        <a
          data-testid='Button-link'
          target='_blank'
          rel='noopener noreferrer'
          className='cursor-pointer hidden lg:flex bg-primary hover:bg-blue-700 text-white transition-all duration-500 ease-in-out rounded-md px-3 text-sm font-medium tracking-heading py-2.5 ml-2'
          href='https://github.com/json-schema-org/json-schema-spec'
        >
          <span className='inline-block mr-2'>
            <svg
              className='inline-block -mt-1 w-6 h-6'
              fill='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                fillRule='evenodd'
                d='M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z'
                clipRule='evenodd'
              ></path>
            </svg>
          </span>
          <span className='inline-block'>Star on GitHub</span>
        </a>
      </div>
    </div>
  );
};

const MobileNav = () => {
  const section = useContext(SectionContext);

  return (
    <div className='flex flex-col justify-end fixed shadow-xl bg-white w-full  z-[190] mt-16 left-0 pl-8'>
      <MainNavLink
        uri='/specification'
        label='Specification'
        isActive={section === 'specification'}
      />
      <MainNavLink
        uri='/learn/getting-started-step-by-step'
        label='Docs'
        isActive={section === 'docs'}
      />

      <MainNavLink
        uri='/implementations'
        label='Tools'
        isActive={section === 'tools'}
      />
      <MainNavLink uri='/blog' label='Blog' isActive={section === 'blog'} />
      <MainNavLink
        uri='/#community'
        label='Community'
        isActive={section === 'community'}
      />
    </div>
  );
};

export const SegmentHeadline = ({ label }: { label: string }) => {
  return <div className='text-slate-900 font-bold'>{label}</div>;
};

const Footer = () => (
  <footer
    className={classnames(
      'z-10 h-[350px] md:h-[300px] bg-gradient-to-r from-startBlue from-1.95% to-endBlue clip-top grid items-center',
    )}
  >
    <div className='max-w-[1400px] mx-auto  mt-8 md:mt-4 grid grid-cols-1 md:grid-cols-2 md:w-1/2 lg:w-1/3 justify-center '>
      <div className=' my-6 m-auto md:mt-16'>
        <img src='/img/logos/logo-white.svg' className='w-[150px] mb-6' />
        <div className='flex flex-col text-center sm:text-left'>
          <a
            href='https://opencollective.com/json-schema'
            className='text-white mb-2'
          >
            Open Collective
          </a>
        </div>
        <div className='flex flex-col text-center sm:text-left'>
          <a href='/overview/code-of-conduct' className='text-white mb-2'>
            Code of Conduct
          </a>
        </div>
      </div>
      <div className='grid grid-cols-3 md:grid-cols-1 mx-auto md:mt-8 mb-4 md:mb-0  gap-x-4 gap-y-4 md:gap-x-0 md:gap-y-0'>
        <div className=''>
          <a
            href='https://json-schema.org/slack'
            className='flex items-center text-white'
          >
            <img
              src='/img/logos/slack_logo_small-white.svg'
              className='w-4 h-4 mr-2'
            />
            Slack
          </a>
        </div>
        <div className=''>
          <a
            href='https://twitter.com/jsonschema'
            className='flex items-center text-white'
          >
            <img src='/img/logos/x-twitter.svg' className='w-4 h-4 mr-2' />
            Twitter
          </a>
        </div>
        <div className=''>
          <a
            href='https://linkedin.com/company/jsonschema/'
            className='flex items-center text-white'
          >
            <img
              src='/img/logos/icons8-linkedin-2.svg'
              className='w-4 h-4 mr-2'
            />
            LinkedIn
          </a>
        </div>
        <div className=''>
          <a
            href='https://www.youtube.com/@JSONSchemaOrgOfficial'
            className='flex items-center text-white'
          >
            <img src='/img/logos/icons8-youtube.svg' className='w-4 h-4 mr-2' />
            Youtube
          </a>
        </div>
        <div className=''>
          <a
            href='https://github.com/json-schema-org'
            className='flex items-center text-white'
          >
            <img
              src='/img/logos/github_logo-white.svg'
              className='w-4 h-4 mr-2'
            />
            GitHub
          </a>
        </div>
      </div>
    </div>
  </footer>
);

const OpenJS = () => (
  <div className={classnames('')}>
    <div className='max-w-[1400px] mx-auto my-6 lg:mt-20 grid grid-cols-1 lg:grid-cols-2 w-4/5'>
      <div className='md:w-1/2 mb-12 lg:ml-28'>
        <img
          className='h-24 mx-auto mb-6 lg:mb-0'
          src='/img/logos/openjs_foundation-logo-horizontal-color.svg'
          alt='color openjs foundation logo'
        ></img>
        {/* <div className='absolute bottom-0 ml-6  mb-12'>© {new Date().getFullYear()} Copyright JSON Schema Organisation </div> */}
      </div>
      <div className='md:w-5/6 lg:w-full mx-auto  mb-16'>
        <p className='mb-6'>
          Copyright{' '}
          <a
            className='text-linkBlue hover:text-blue-600'
            href='https://openjsf.org'
          >
            OpenJS Foundation
          </a>{' '}
          and JSON Schema contributors. All rights reserved. The{' '}
          <a
            className='text-linkBlue hover:text-blue-600'
            href='https://openjsf.org'
          >
            OpenJS Foundation
          </a>{' '}
          has registered trademarks and uses trademarks. For a list of
          trademarks of the{' '}
          <a
            className='text-linkBlue hover:text-blue-600'
            href='https://openjsf.org'
          >
            OpenJS Foundation
          </a>
          , please see our{' '}
          <a
            className='text-linkBlue hover:text-blue-600'
            href='https://trademark-policy.openjsf.org'
          >
            Trademark Policy
          </a>{' '}
          and{' '}
          <a
            className='text-linkBlue hover:text-blue-600'
            href='https://trademark-list.openjsf.org'
          >
            Trademark List
          </a>
          . Trademarks and logos not indicated on the{' '}
          <a
            className='text-linkBlue hover:text-blue-600'
            href='https://trademark-list.openjsf.org'
          >
            list of OpenJS Foundation trademarks
          </a>{' '}
          are trademarks&trade; or registered&reg; trademarks of their
          respective holders. Use of them does not imply any affiliation with or
          endorsement by them.
        </p>
        <p className='mb-4 sm:mb-8'>
          <a
            className='text-linkBlue hover:text-blue-600'
            href='https://openjsf.org'
          >
            The OpenJS Foundation
          </a>{' '}
          |{' '}
          <a
            className='text-linkBlue hover:text-blue-600'
            href='https://terms-of-use.openjsf.org'
          >
            Terms of Use
          </a>{' '}
          |{' '}
          <a
            className='text-linkBlue hover:text-blue-600'
            href='https://privacy-policy.openjsf.org'
          >
            Privacy Policy
          </a>{' '}
          |{' '}
          <a
            className='text-linkBlue hover:text-blue-600'
            href='https://bylaws.openjsf.org'
          >
            Bylaws
          </a>{' '}
          |{' '}
          <a
            className='text-linkBlue hover:text-blue-600'
            href='https://code-of-conduct.openjsf.org'
          >
            Code of Conduct
          </a>{' '}
          |{' '}
          <a
            className='text-linkBlue hover:text-blue-600'
            href='https://trademark-policy.openjsf.org'
          >
            Trademark Policy
          </a>{' '}
          |{' '}
          <a
            className='text-linkBlue hover:text-blue-600'
            href='https://trademark-list.openjsf.org'
          >
            Trademark List
          </a>{' '}
          |{' '}
          <a
            className='text-linkBlue hover:text-blue-600'
            href='https://www.linuxfoundation.org/cookies'
          >
            Cookie Policy
          </a>
        </p>
      </div>
    </div>
  </div>
);

const Logo = () => (
  <Link href='/' className=''>
    <img src='/img/logos/logo-blue.svg' className='h-12 mr-2 ' />
  </Link>
);

const FaviconHead = () => {
  const [isDarkMode, setIsDarkMode] = React.useState(false);
  const onUpdate = React.useCallback((matcher: MediaQueryList) => {
    setIsDarkMode(matcher.matches);
  }, []);

  React.useEffect(() => {
    const matcher: MediaQueryList = window.matchMedia(
      '(prefers-color-scheme: dark)',
    );
    matcher.addEventListener('change', () => onUpdate(matcher));
    onUpdate(matcher);
  }, []);

  if (isDarkMode) {
    return (
      <Head>
        <link
          rel='icon'
          type='image/svg'
          href='/favicon-white.ico'
          id='dark-scheme-icon'
        />
      </Head>
    );
  }
  return (
    <Head>
      <link
        rel='icon'
        type='image/svg+xml'
        href='/favicon.ico'
        id='light-scheme-icon'
      />
    </Head>
  );
};
