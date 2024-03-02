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
      <div className='max-w-[1400px] mx-auto flex flex-col items-center mt-16'>
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
        <div className='relative flex flex-col lg:flex-row'>
          <div className='flex ml-10 mr-10 lg:w-1/4'>
            <div className='block -mt-2 w-full'>
              <div className='sticky top-0 overflow-y-auto h-auto pt-4 w-full items-center lg:items-start flex justify-between flex-row lg:flex-col'>
                <Link
                  href='/blog'
                  className='font-semibold text-sm pb-0 lg:pb-5 text-slate-700 hover:text-slate-800 inline-flex flex-row items-center'
                >
                  <img src='/icons/left-arrow.svg' className='h-4 w-4 mr-2' />{' '}
                  Go back to blog
                </Link>
                <div className='pt-6 lg:border-t border-none lg:border-r border-slate-100'>
                  {(frontmatter.authors || []).map(
                    (author: any, index: number) => {
                      return (
                        <div
                          key={index}
                          className='flex flex-row items-center mb-3 w-full'
                        >
                          <div
                            className='bg-slate-50 h-[44px] w-[44px] rounded-full bg-cover bg-center'
                            style={{ backgroundImage: `url(${author.photo})` }}
                          />
                          <div>
                            <div className='text-sm font-semibold pl-2'>
                              {author.name}
                            </div>
                            {author.twitter && (
                              <a
                                className='block text-sm text-blue-500 font-medium'
                                href={`https://twitter.com/${author.twitter}`}
                              >
                                @{author.twitter}
                              </a>
                            )}
                          </div>
                        </div>
                      );
                    },
                  )}
                </div>
                <div className='pt-12 pr-4 border-r border-slate-100 hidden lg:block w-full'>
                  <div className='uppercase text-xs text-slate-400 mb-4'>
                    on this page
                  </div>
                  <TableOfContentMarkdown markdown={content} depth={0} />
                </div>
                <CarbonAds variant='sidebar' />
              </div>
            </div>
          </div>
          <div className='flex-1 ml-7 mr-7 lg:w-3/4'>
            <div
              className='bg-slate-50 h-[500px] w-full rounded-lg bg-cover mb-10 bg-center'
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
