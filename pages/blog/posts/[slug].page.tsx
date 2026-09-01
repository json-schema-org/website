import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { getLayout } from '~/components/SiteLayout';
import StyledMarkdown, {
  TableOfContentMarkdown,
} from '~/components/StyledMarkdown';

import getStaticMarkdownPaths from '~/lib/getStaticMarkdownPaths';
import getStaticMarkdownProps from '~/lib/getStaticMarkdownProps';
import readingTime from 'reading-time';
import { Headline1 } from '~/components/Headlines';
import { SectionContext } from '~/context';
import CarbonAds from '~/components/CarbonsAds';
import Image from 'next/image';

export async function getStaticPaths() {
  return getStaticMarkdownPaths('pages/blog/posts');
}
export async function getStaticProps(args: any) {
  return getStaticMarkdownProps(args, 'pages/blog/posts');
}

export default function StaticMarkdownPage({
  frontmatter,
  content,
}: {
  frontmatter: any;
  content: any;
}) {
  const date = new Date(frontmatter.date);
  const timeToRead = Math.ceil(readingTime(content).minutes);

  return (
    <SectionContext.Provider value='blog'>
      <Head>
        <title>{frontmatter.title}</title>
      </Head>
      <div className='max-w-[1400px] mx-auto flex flex-col items-center mt-16 dark:bg-slate-800 dark:slate-700 px-4'>
        <div className='flex flex-col pt-6'>
          {frontmatter.date && (
            <div className='text-center text-sm text-slate-500 mt-16'>
              {date.toLocaleDateString('en-us', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}{' '}
              &middot; {timeToRead} min read
            </div>
          )}
          <Headline1 attributes={{ className: 'text-center' }}>
            {frontmatter.title || 'NO TITLE!'}
          </Headline1>
        </div>
        <div className='relative flex flex-col lg:flex-row w-full'>
          <div className='flex lg:w-1/4 w-full'>
            <div className='block -mt-2 w-full'>
              <div className='sticky top-[90px] overflow-y-auto h-auto pt-4 w-full items-center lg:items-start flex justify-between flex-row lg:flex-col'>
                <Link
                  href='/blog'
                  className='font-semibold text-sm pb-0 lg:pb-5 text-slate-700 dark:text-slate-300 dark:hover:text-slate-100 hover:text-slate-800 inline-flex flex-row items-center'
                >
                  <Image
                    src='/icons/left-arrow.svg'
                    width={16}
                    height={16}
                    className='h-4 w-4 mr-2'
                    alt='Left arrow icon'
                  />
                  Go back to blog
                </Link>
                <div className='pt-4 lg:border-t border-none lg:border-r border-slate-100'>
                  {(frontmatter.authors || []).map(
                    (author: any, index: number) => {
                      return (
                        <div
                          key={index}
                          className='flex flex-row items-center mb-3 w-full'
                        >
                          <div className='relative h-[44px] w-[44px] rounded-full overflow-hidden border border-slate-200 bg-slate-50'>
                            <Image
                              src={author.photo || ''}
                              alt={author.name}
                              fill
                              className='object-cover'
                            />
                          </div>
                          <div className='flex flex-col pl-2'>
                            <div className='text-sm font-semibold'>
                              {author.name}
                            </div>
                            <div className='flex gap-2 text-xs items-center'>
                              {author.twitter && (
                                <a
                                  className='text-slate-500 hover:text-blue-400 transition-colors'
                                  href={`https://x.com/${author.twitter}`}
                                  target='_blank'
                                  rel='noopener noreferrer'
                                  title='Twitter/X'
                                >
                                  <svg className='h-3 w-3 fill-current' viewBox='0 0 24 24'>
                                    <path d='M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z' />
                                  </svg>
                                </a>
                              )}
                              {author.linkedin && (
                                <a
                                  className='text-slate-500 hover:text-blue-700 transition-colors'
                                  href={author.linkedin}
                                  target='_blank'
                                  rel='noopener noreferrer'
                                  title='LinkedIn'
                                >
                                  <svg className='h-3 w-3 fill-current' viewBox='0 0 24 24'>
                                    <path d='M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z' />
                                  </svg>
                                </a>
                              )}
                              {author.link && !author.linkedin && !author.twitter && (
                                <a
                                  className='text-slate-500 hover:text-blue-600 transition-colors'
                                  href={author.link}
                                  target='_blank'
                                  rel='noopener noreferrer'
                                  title='Website'
                                >
                                  <svg className='h-3 w-3 fill-none stroke-current stroke-2' viewBox='0 0 24 24'>
                                    <path d='M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71' />
                                    <path d='M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71' />
                                  </svg>
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    },
                  )}
                </div>
                <div className='pt-4 pr-4 hidden lg:block w-full'>
                  <div className='uppercase text-xs text-slate-400 mb-4'>
                    on this page
                  </div>
                  <TableOfContentMarkdown markdown={content} depth={0} />
                </div>
                <CarbonAds variant='sidebar' />
              </div>
            </div>
          </div>
          <div className='flex-1 lg:w-3/4 w-full'>
            <div
              className='bg-slate-50  w-full rounded-lg bg-cover mb-10 bg-center min-h-[200px] sm:min-h-[300px] md:min-h-[400px] lg:min-h-[500px]'
              style={{ backgroundImage: `url(${frontmatter.cover})` }}
            />
            <StyledMarkdown markdown={content} />
          </div>
        </div>
      </div>
    </SectionContext.Provider>
  );
}
StaticMarkdownPage.getLayout = getLayout;
