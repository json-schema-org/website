import React, { useState } from 'react';
import fs from 'fs';
import Link from 'next/link';
import Head from 'next/head';
import yaml from 'js-yaml';

import { SectionContext } from '~/context';
import { DocsHelp } from '~/components/DocsHelp';
import { Headline1 } from '~/components/Headlines';
import { getLayout } from '~/components/SiteLayout';
import { DRAFT_ORDER, JSONSchemaDraft } from '~/lib/config';

import GroupByMenu from './components/GroupByMenu';
import Sidebar from './components/Sidebar';
import ToolingTable from './components/ToolingTable';
import useToolsTransform from './hooks/useToolsTransform';
import getDistinctEntries from './lib/getDistinctEntries';
import type { JSONSchemaTool } from './JSONSchemaTool';

export type FilterCriteriaFields =
  | 'languages'
  | 'drafts'
  | 'toolingTypes'
  | 'licenses'
  | 'environments';

export async function getStaticProps() {
  const toolingData = yaml.load(
    fs.readFileSync('data/tooling-data.yaml', 'utf-8'),
  ) as JSONSchemaTool[];

  toolingData.forEach((tool) => {
    tool.supportedDialects?.draft?.sort((a, b) => {
      const aIndex = DRAFT_ORDER.indexOf(a);
      const bIndex = DRAFT_ORDER.indexOf(b);

      if (aIndex === -1 && bIndex === -1) {
        return 0;
      } else if (aIndex === -1) {
        return 1;
      } else if (bIndex === -1) {
        return -1;
      }

      return bIndex - aIndex;
    });
  });

  const filterCriteria = {
    languages: getDistinctEntries(toolingData, '$..languages[*]'),
    drafts: getDistinctEntries(toolingData, '$..supportedDialects.draft[*]', [
      '0',
      '1',
      '2',
      '3',
    ]) as JSONSchemaDraft[],
    toolingTypes: getDistinctEntries(toolingData, '$..toolingTypes[*]'),
    licenses: getDistinctEntries(toolingData, '$..license'),
    environments: getDistinctEntries(toolingData, '$..environments[*]'),
  };

  filterCriteria.drafts.sort((a, b) => {
    const aIndex = DRAFT_ORDER.indexOf(a);
    const bIndex = DRAFT_ORDER.indexOf(b);

    if (aIndex === -1 && bIndex === -1) {
      return 0;
    } else if (aIndex === -1) {
      return 1;
    } else if (bIndex === -1) {
      return -1;
    }

    return aIndex - bIndex;
  });

  (Object.keys(filterCriteria) as FilterCriteriaFields[]).forEach((key) => {
    if (key !== 'drafts' && Array.isArray(filterCriteria[key])) {
      (filterCriteria[key] as (string | number)[]).sort((a, b) =>
        a.toString().localeCompare(b.toString()),
      );
    }
  });

  return {
    props: {
      toolingData,
      filterCriteria,
    },
  };
}

interface ToolingPageProps {
  toolingData: JSONSchemaTool[];
  filterCriteria: Record<FilterCriteriaFields, string[]>;
}

export default function ToolingPage({
  toolingData,
  filterCriteria,
}: ToolingPageProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const {
    numberOfTools,
    toolsByGroup,
    transform,
    setTransform,
    resetTransform,
  } = useToolsTransform(toolingData);

  return (
    <SectionContext.Provider value='tools'>
      <Head>
        <title>JSON Schema - Tools</title>
      </Head>
      <div className='mx-auto w-full max-w-[1400px] min-h-screen flex flex-col items-center'>
        <div
          className='bg-primary w-full h-12 mt-[4.5rem] relative lg:hidden px-8 flex justify-between items-center'
          onClick={() => {
            setIsSidebarOpen((prev) => !prev);
          }}
        >
          <h3 className='text-white'>{numberOfTools} Tools</h3>

          <svg
            style={{
              transform: `${isSidebarOpen ? 'rotate(180deg)' : 'rotate(0)'}`,
              transition: 'transform 0.2s linear',
            }}
            xmlns='http://www.w3.org/2000/svg'
            height='24'
            viewBox='0 0 256 512'
          >
            <path
              d='M64 448c-8.188 0-16.38-3.125-22.62-9.375c-12.5-12.5-12.5-32.75 0-45.25L178.8 256L41.38 118.6c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0l160 160c12.5 12.5 12.5 32.75 0 45.25l-160 160C80.38 444.9 72.19 448 64 448z'
              fill='#ffffff'
            />
          </svg>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-4 mx-4 md:mx-12 min-h-screen'>
          <div
            className={`absolute lg:static top-10 lg:top-auto left-0 lg:left-auto mt-24 w-screen lg:w-auto h-full lg:h-auto bg-white dark:bg-slate-800 lg:bg-transparent transition-transform lg:transform-none duration-300 lg:duration-0 ease-in-out overflow-y-auto ${isSidebarOpen ? '-translate-x-0' : '-translate-x-full'} z-5`}
            style={{ height: 'calc(100% - 8rem)' }}
          >
            <div className='hidden lg:block'>
              <h1 className='text-h1mobile md:text-h1 font-bold lg:ml-4 lg:mt-6'>
                {numberOfTools}
              </h1>
              <div className='text-xl text-slate-900 dark:text-slate-300 font-bold lg:ml-6'>
                Tools
              </div>
            </div>
            <Sidebar
              filterCriteria={filterCriteria}
              transform={transform}
              setTransform={setTransform}
              resetTransform={resetTransform}
              setIsSidebarOpen={setIsSidebarOpen}
            />
          </div>

          <main
            className={`md:col-span-3 lg:mt-20 lg:w-full mx-4 md:mx-0 ${isSidebarOpen ? 'hidden lg:block' : ''}`}
          >
            <Headline1>JSON Schema Tooling</Headline1>
            <p className='text-slate-600 block leading-7 pb-1 dark:text-slate-300'>
              Toolings below are written in different languages, and support
              part, or all, of at least one recent version of the specification.
            </p>
            <p className='text-slate-600 block leading-7 pb-4 dark:text-slate-300'>
              Listing does not signify a recommendation or endorsement of any
              kind.
            </p>
            <div className='flex flex-row items-center gap-2 w-full'>
              <div className='flex items-center justify-center gap-2 w-1/2'>
                <Link
                  className='flex-none max-w-full'
                  href='https://github.com/json-schema-org/website/issues/new?assignees=&labels=Status%3A+Triage&template=adding-your-tooling.yml'
                  target='_blank'
                  rel='noreferrer'
                >
                  <img
                    src='/img/tools/adding_your_tool.png'
                    className='rounded-sm h-[68px]'
                  />
                </Link>
                <p className='hidden lg:block text-slate-600 dark:text-slate-300 px-4'>
                  Raise an issue to get your tool added or updated in the
                  tooling table.
                </p>
              </div>

              <div className='flex items-center justify-center gap-2 w-1/2'>
                <Link
                  className='flex-none max-w-full'
                  href='https://bowtie.report'
                  target='_blank'
                  rel='noreferrer'
                >
                  <img
                    src='/img/tools/try_bowtie.png'
                    className='rounded-sm h-[68px]'
                  />
                </Link>
                <p className='hidden lg:block text-slate-600 dark:text-slate-300 px-4'>
                  Bowtie is a meta-validator for JSON Schema implementations and
                  it provides compliance reports.
                </p>
              </div>
            </div>
            <GroupByMenu transform={transform} setTransform={setTransform} />
            <ToolingTable
              toolsByGroup={toolsByGroup}
              transform={transform}
              setTransform={setTransform}
            />

            <DocsHelp />
          </main>
        </div>
      </div>
    </SectionContext.Provider>
  );
}

ToolingPage.getLayout = getLayout;
