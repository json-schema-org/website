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
            Whether you need training, personalized advice, or custom JSON Schema solutions, some members of the JSON Schema Technical Steering Committee and Ambassadors programs offer pro services beyond community support. Don't hesitate in reaching out to discuss further.
            <br />
            <br />
            <span className='font-bold text-[1.3rem]'>Available Members</span>
          </p>
          <div className='w-full lg:w-full my-[10px] mx-auto mt-8 mb-8'>
            {contractorData.map((contractor) => (
              <div>
                <h1>{contractor.name}</h1>
                <p>{contractor.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SectionContext.Provider>
  );
}

ProHelp.getLayout = getLayout;
