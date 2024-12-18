import React from 'react';
import { getLayout } from '~/components/SiteLayout';
import { SectionContext } from '~/context';

import ambassadorList from '~/data/ambassadors-contributions.json';
import ambassadorsBanner from '~/public/img/community/ambassadors.png';

import Image from 'next/image';

import fs from 'fs';

import AmbassadorBanner from '~/components/AmbassadorsBanner';
import AmbassadorCard, { type Ambassador } from '~/components/AmbassadorsCard';
import AmbassadorList from '~/components/AmbassadorsList';

export async function getStaticProps() {
  const ambassadorData = fs.readFileSync('data/ambassadors.json', 'utf-8');

  return {
    props: {
      ambassadorData,
    },
  };
}

export default function ambassadorPages({
  ambassadorData,
}: {
  ambassadorData: any;
}) {
  return (
    <SectionContext.Provider value='ambassador'>
      <div
        className='max-w-screen-xl block px-4 sm:px-6 lg:px-8 mx-auto w-full'
        data-testid='Container-main'
      >
        <div
          className='flex flex-col items-center justify-between lg:flex-row mt-20'
          data-testid='Ambassadors-main'
        >
          <div
            className='w-full text-center lg:w-[45%] lg:text-left'
            data-testid='Ambassadors-content'
          >
            <h1
              className='mt-10 text-h2 font-semibold md:text-4xl lg:text-5xl'
              data-testid='Ambassadors-title'
            >
              Become a JSON Schema Ambassador
            </h1>
            <p className='mt-5 text-slate-700 text-lg  dark:text-slate-100'>
              The JSON Schema Ambassadors Program recognizes the people who
              drive adoption, innovation, and knowledge sharing in the JSON
              Schema community.
            </p>
            <div data-testid='Ambassadors-button'>
              <a
                className='mt-10 inline-block px-6 py-3 bg-blue-600 text-white font-semibold text-center rounded hover:bg-blue-700 transition duration-300'
                href='https://github.com/json-schema-org/community/tree/main/programs/ambassadors#become-a-json-schema-ambassador'
                target='_blank'
                rel='noopener noreferrer'
              >
                Become a JSON Schema Ambassador
              </a>
            </div>
          </div>

          <div className='hidden w-1/2 lg:block'>
            <Image
              src={ambassadorsBanner}
              alt='Ambassadors Banner'
              title='Ambassadors Banner'
              className='w-full pt-10'
              layout='intrinsic'
            />
          </div>
        </div>
        <div className='flex justify-center'>
          <div
            className='mt-10 text-center lg:w-[55%]'
            data-testid='Ambassadors-contributions'
          >
            <h1 className='text-h3 font-bold text-gray-900 dark:text-white'>
              JSON Schema Ambassador Contributions
            </h1>
            <p className='mt-5 text-lg text-gray-700 dark:text-slate-100'>
              Ambassadors are passionate about JSON Schema. They share their
              interest, expertise, and excitement within their communities to
              help others build better software.
            </p>
          </div>
        </div>
        <AmbassadorList ambassadorList={ambassadorList} />

        <section className='flex align-middle justify-center p-auto m-auto mt-16'>
          <h2 className='text-h3 font-bold text-gray-900 dark:text-white text-center'>
            Join These JSON Schema Ambassadors <br />
            <p className='text-h5 font-sans font-light text-gray-700 dark:text-slate-100'>
              Learn and share knowledge with community members.
            </p>
          </h2>
        </section>
        <div className=' flex justify-center container m-auto p-auto'>
          <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {JSON.parse(ambassadorData).map(
              (ambassador: Ambassador, index: number) => (
                <AmbassadorCard key={index} ambassador={ambassador} />
              ),
            )}
          </div>
        </div>
        <div className='flex justify-center p-auto'>
          <AmbassadorBanner />
        </div>
      </div>
    </SectionContext.Provider>
  );
}

ambassadorPages.getLayout = getLayout;
