/* eslint-disable linebreak-style */
import React from 'react';
import Head from 'next/head';
import { getLayout } from '~/components/Sidebar';
import { Headline1 } from '~/components/Headlines';
import { SectionContext } from '~/context';
import { DocsHelp } from '~/components/DocsHelp';
import NextPrevButton from '~/components/NavigationButtons';
import VideoCard from '~/components/VideoCard';
import { VideoResource, validateVideoResources } from '~/lib/videoResources';
import rawVideos from '~/data/videos.json';

interface VideosPageProps {
  videos: VideoResource[];
}

export async function getStaticProps() {
  // Runtime validation during static generation ensures invalid submissions fail build
  const validatedVideos = validateVideoResources(rawVideos);

  return {
    props: {
      videos: validatedVideos,
    },
  };
}

export default function VideosPage({ videos }: VideosPageProps) {
  const fileRenderType = 'tsx';
  const pageTitle = 'JSON Schema videos';

  return (
    <SectionContext.Provider value='learn'>
      <Head>
        <title>{pageTitle}</title>
        <meta
          name='description'
          content='Community-curated educational videos, tutorials, and conference talks about JSON Schema.'
        />
      </Head>

      <Headline1>{pageTitle}</Headline1>

      <p className='text-gray-700 dark:text-gray-300 text-base leading-relaxed mb-6'>
        Explore educational videos, tutorials, and presentations created by the
        JSON Schema community.
      </p>

      {/* Contribution notice banner */}
      <div className='my-6 p-4 rounded-lg border border-blue-200 bg-blue-50 dark:border-blue-900/60 dark:bg-slate-800/80 text-sm'>
        <p className='text-slate-800 dark:text-slate-200'>
          💡 <strong>Have an educational video to share?</strong> Anyone can
          propose a video resource! See the{' '}
          <a
            href='https://github.com/json-schema-org/website/blob/main/CONTRIBUTING.md#%EF%B8%8F-contribute-a-video'
            target='_blank'
            rel='noopener noreferrer'
            className='font-semibold text-primary underline hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300'
          >
            video contribution guidelines
          </a>{' '}
          or follow the conversation on tracking{' '}
          <a
            href='https://github.com/json-schema-org/website/issues/2623'
            target='_blank'
            rel='noopener noreferrer'
            className='font-semibold text-primary underline hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300'
          >
            issue #2623
          </a>
          .
        </p>
      </div>

      {/* Main content: Grid or Empty State */}
      {videos.length === 0 ? (
        <div
          className='my-10 p-8 rounded-xl border border-dashed border-gray-300 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-800/40 text-center'
          data-testid='videos-empty-state'
        >
          <div className='max-w-md mx-auto'>
            <div className='inline-flex items-center justify-center w-14 h-14 rounded-full bg-blue-100 dark:bg-blue-900/40 text-primary dark:text-blue-400 mb-4'>
              <svg
                className='w-7 h-7'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z'
                />
              </svg>
            </div>
            <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-2'>
              No community videos yet
            </h2>
            <p className='text-gray-600 dark:text-gray-400 mb-6 text-sm'>
              We are collecting high-quality educational videos, walkthroughs,
              and conference talks from the community. Contributions are very
              welcome!
            </p>
            <div className='flex flex-wrap items-center justify-center gap-4'>
              <a
                href='https://github.com/json-schema-org/website/blob/main/CONTRIBUTING.md#%EF%B8%8F-contribute-a-video'
                target='_blank'
                rel='noopener noreferrer'
                className='inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-blue-700 rounded-md shadow transition'
              >
                Contribute a video
              </a>
              <a
                href='https://github.com/json-schema-org/website/issues/2623'
                target='_blank'
                rel='noopener noreferrer'
                className='inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-md transition'
              >
                Tracking issue #2623
              </a>
            </div>
          </div>
        </div>
      ) : (
        <div
          className='w-full grid grid-cols-1 md:grid-cols-2 gap-6 my-8'
          data-testid='videos-grid'
        >
          {videos.map((video, index) => (
            <VideoCard key={video.url || index} video={video} />
          ))}
        </div>
      )}

      <NextPrevButton
        prevLabel='JSON Schema glossary'
        prevURL='/learn/glossary'
        nextLabel='Miscellaneous examples'
        nextURL='/learn/miscellaneous-examples'
      />
      <DocsHelp fileRenderType={fileRenderType} />
    </SectionContext.Provider>
  );
}

VideosPage.getLayout = getLayout;
