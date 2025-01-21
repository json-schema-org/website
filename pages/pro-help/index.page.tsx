import React from 'react';
import fs from 'fs';
import { getLayout } from '~/components/SiteLayout';
import Head from 'next/head';
import { Headline1 } from '~/components/Headlines';
import { SectionContext } from '~/context';
import { DocsHelp } from '~/components/DocsHelp';

interface ContractorLink {
  title: string;
  url: string;
}

interface Contractor {
  name: string;
  bio: string;
  email?: string;
  website?: string;
  github: string;
  x?: string;
  mastodon?: string;
  linkedin?: string;
  incorporatedIn: string[];
  type: string;
  links: ContractorLink[];
}

export async function getStaticProps() {
  const contractorData = JSON.parse(
    fs.readFileSync(
      '_includes/community/programs/contractors/contractors.json',
      'utf-8',
    ),
  ) as Contractor[];

  return {
    props: {
      contractorData,
    },
  };
}

interface ProHelpPageProps {
  contractorData: Contractor[];
}

export default function ProHelp({ contractorData }: ProHelpPageProps) {
  const newTitle = 'Need pro help with JSON Schema?';

  return (
    <SectionContext.Provider value='pro-help'>
      <Head>
        <title>{newTitle}</title>
      </Head>
      <div
        className='max-w-screen-xl block px-4 sm:px-6 lg:px-8 mt-12 mx-auto w-full'
        data-testid='pro-help'
      >
        <br />
        <div className='mt-6'>
          <Headline1>{newTitle}</Headline1>
          <p>
            Whether you need training, personalized advice, or custom JSON
            Schema solutions, some members of the JSON Schema Technical Steering
            Committee (TSC) and Ambassadors programs offer pro services beyond
            community support. Don't hesitate in reaching out to discuss
            further.
          </p>
          <br />
          <p className='italic'>
            Hiring our top contributors also helps funding the JSON Schema
            open-source organization, and as a consequence, the specifications
            that build on top of it, such as{' '}
            <a href='https://www.openapis.org' className='underline'>
              OpenAPI
            </a>
            ,
            <a href='https://www.asyncapi.com' className='underline'>
              AsyncAPI
            </a>
            ,
            <a href='https://raml.org' className='underline'>
              RAML
            </a>
            ,
            <a href='https://www.w3.org/WoT/' className='underline'>
              W3C WoT
            </a>
            , and many more.
          </p>
          <br />
          <span className='font-bold text-[1.3rem]'>Available Members</span>
          <div className='w-full lg:w-full my-[10px] mx-auto mt-8 mb-8'>
            {contractorData.map((contractor) => (
              <div
                className='border border-solid border-gray-300 px-5 py-3'
                key={contractor.github}
              >
                <h1 className='text-xl mb-3 font-semibold'>
                  {contractor.name}
                  <span className='ms-4 border border-gray-200 text-base uppercase bg-zinc-200 text-gray-800 px-2 py-1 rounded dark:border-gray-600 dark:bg-zinc-700 dark:text-gray-200'>
                    {contractor.type}
                  </span>
                </h1>
                <div>
                  {contractor.website && (
                    <a
                      className='text-sm underline me-8'
                      href={contractor.website}
                      target='blank'
                    >
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        fill='none'
                        viewBox='0 0 24 24'
                        strokeWidth={1.5}
                        stroke='currentColor'
                        className='w-5 inline-block me-1'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          d='M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418'
                        />
                      </svg>
                      <span className='max-sm:hidden'>
                        {contractor.website}
                      </span>
                      <span className='sm:hidden'>Homepage</span>
                    </a>
                  )}
                  {contractor.linkedin && (
                    <a
                      className='text-sm underline me-8'
                      href={`https://www.linkedin.com/in/${contractor.linkedin}`}
                      target='blank'
                    >
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        viewBox='0 0 448 512'
                        strokeWidth={1.5}
                        stroke='currentColor'
                        fill='currentColor'
                        className='w-5 inline-block me-1 text-gray-800 dark:text-white'
                      >
                        <path d='M416 32H31.9C14.3 32 0 46.5 0 64.3v383.4C0 465.5 14.3 480 31.9 480H416c17.6 0 32-14.5 32-32.3V64.3c0-17.8-14.4-32.3-32-32.3zM135.4 416H69V202.2h66.5V416zm-33.2-243c-21.3 0-38.5-17.3-38.5-38.5S80.9 96 102.2 96c21.2 0 38.5 17.3 38.5 38.5 0 21.3-17.2 38.5-38.5 38.5zm282.1 243h-66.4V312c0-24.8-.5-56.7-34.5-56.7-34.6 0-39.9 27-39.9 54.9V416h-66.4V202.2h63.7v29.2h.9c8.9-16.8 30.6-34.5 62.9-34.5 67.2 0 79.7 44.3 79.7 101.9V416z' />
                      </svg>
                      <span className='max-sm:hidden'>
                        {`https://www.linkedin.com/in/${contractor.linkedin}`}
                      </span>
                      <span className='sm:hidden'>/{contractor.linkedin}</span>
                    </a>
                  )}
                  {contractor.github && (
                    <a
                      className='text-sm underline me-8'
                      href={`https://github.com/${contractor.github}`}
                      target='blank'
                    >
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        viewBox='0 0 496 512'
                        strokeWidth={1.5}
                        stroke='currentColor'
                        className='w-5 inline-block me-1 fill-current text-gray-800 dark:text-gray-200'
                      >                       
                        <path d='M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3 .3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5 .3-6.2 2.3zm44.2-1.7c-2.9 .7-4.9 2.6-4.6 4.9 .3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3 .7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3 .3 2.9 2.3 3.9 1.6 1 3.6 .7 4.3-.7 .7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3 .7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3 .7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z' />
                      </svg>

                      <span className='max-sm:hidden'>
                        {`https://github.com/${contractor.github}`}
                      </span>
                      <span className='sm:hidden'>/{contractor.github}</span>
                    </a>
                  )}
                </div>
                <div className='flex mt-3 max-sm:flex max-sm:flex-col max-sm:gap-2 '>
                  <div className='me-4 max-sm:flex max-sm:flex-col max-sm:items-center max-sm:gap-2'>
                    <img
                      src={`https://github.com/${contractor.github}.png`}
                      className='border border-gray-400 max-sm:w-44'
                    />
                    <a
                      href={`mailto:${contractor.email}`}
                      className='text-center mt-3 mb-2 block px-4 py-1 text-sm font-semibold border 
                      border-blue-700 text-blue-700 bg-transparent hover:text-white hover:bg-blue-700 
                      hover:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-700 
                      focus:ring-offset-2 dark:text-white dark:border-white dark:hover:bg-white 
                      dark:hover:text-blue-700 max-sm:px-16' 
                    >
                      Reach out
                    </a>
                  </div>
                  <div className='text-sm'>
                    <p>{contractor.bio}</p>
                    <p className='my-3 font-bold'>
                      Previous work and relevant links
                    </p>
                    <ul className='list-disc ms-4'>
                      {contractor.links.map((link) => (
                        <li className='my-2' key={link.url}>
                          <a className='underline' href={link.url}>
                            {link.title}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
            <br />
            <br />
            <br />
          </div>
        </div>
        <DocsHelp />
      </div>
    </SectionContext.Provider>
  );
}

ProHelp.getLayout = getLayout;
