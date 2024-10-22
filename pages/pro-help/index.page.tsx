import React from 'react';
import fs from 'fs';
import { getLayout } from '~/components/SiteLayout';
import Head from 'next/head';
import { Headline1 } from '~/components/Headlines';
import { SectionContext } from '~/context';
import Card from '~/components/Card';
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
    fs.readFileSync('_includes/community/programs/contractors/contractors.json', 'utf-8'),
  ) as Contractor[];

  return {
    props: {
      contractorData
    },
  };
}

interface ProHelpPageProps {
  contractorData: Contractor[];
}

export default function ProHelp({
  contractorData,
}: ProHelpPageProps) {
  const newTitle = 'Need pro help with JSON Schema?';
  console.log(contractorData);

  return (
    <SectionContext.Provider value='pro-help'>
      <Head>
        <title>{newTitle}</title>
      </Head>
      <div
        className='max-w-screen-xl block px-4 sm:px-6 lg:px-8 mt-12 mx-auto w-full'
        data-testid='pro-help'
      >
        <br/>
        <div className='mt-6'>
          <Headline1>{newTitle}</Headline1>
          <p>
            Whether you need training, personalized advice, or custom JSON Schema solutions, some members of the JSON Schema Technical Steering Committee (TSC) and Ambassadors programs offer pro services beyond community support. Don't hesitate in reaching out to discuss further.
            <br />
            <br />
            <span className='font-bold text-[1.3rem]'>Available Members</span>
          </p>
          <div className='w-full lg:w-full my-[10px] mx-auto mt-8 mb-8'>
            {contractorData.map((contractor) => (
              <div className='border border-solid border-gray-300 px-5 py-3'>
                <h1 className='text-xl mb-3'>
                  {contractor.name}
                  <span className='ms-4 border border-gray-300 text-lg uppercase bg-zinc-200 px-3 py-1'>{contractor.type}</span>
                </h1>
                <div>
                  {contractor.website && <a className="text-sm underline me-4" href={contractor.website}>{contractor.website}</a>}
                  {contractor.linkedin && <a className="text-sm underline me-4" href={`https://www.linkedin.com/in/${contractor.linkedin}`}>{`https://www.linkedin.com/in/${contractor.linkedin}`}</a>}
                  {contractor.github && <a className="text-sm underline me-4" href={`https://github.com/${contractor.github}`}>{`https://github.com/${contractor.github}`}</a>}
                </div>
                <div className='flex mt-3'>
                  <div className='me-4'>
                    <img src={`https://github.com/${contractor.github}.png`} className='border border-gray-400' />
                    <a href={`mailto:${contractor.email}`} className="text-center mt-3 mb-2 block px-4 py-1 text-sm text-blue-700 font-semibold border border-blue-700 hover:text-white hover:bg-blue-700 hover:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-700 focus:ring-offset-2">Reach out</a>
                  </div>
                  <div className='text-sm'>
                    <p>{contractor.bio}</p>
                    <p className='my-3 font-bold'>Previous work and relevant links</p>
                    <ul className='list-disc ms-4'>
                      {contractor.links.map((link) => (
                        <li className='my-2'>
                          <a className='underline' href={link.url}>{link.title}</a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
            <br/>
            <br/>
            <br/>
          </div>
        </div>
      </div>
    </SectionContext.Provider>
  );
}

ProHelp.getLayout = getLayout;
