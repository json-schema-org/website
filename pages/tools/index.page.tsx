/* eslint-disable linebreak-style */
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
import Image from 'next/image';
import { Button } from '~/components/ui/button';
import { Filter, X } from 'lucide-react';

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
  const [visibleToolCount, setVisibleToolCount] = useState<number>(0);

  const {
    numberOfTools,
    toolsByGroup,
    transform,
    setTransform,
    resetTransform,
  } = useToolsTransform(toolingData);

  return (
    <SectionContext.Provider value={'tools'}>
      <Head>
        <title>JSON Schema - Tools</title>
      </Head>

      <div className='mx-auto w-full max-w-[1400px] min-h-screen flex flex-col items-center px-4 md:px-12'>
        {/* Filter Drawer */}
        <div
          className={`fixed inset-0 z-50 flex transform transition-all duration-300 ${isSidebarOpen ? 'visible' : 'invisible pointer-events-none'}`}
        >
          {/* Backdrop */}
          <div
            className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0'}`}
            onClick={() => setIsSidebarOpen(false)}
          />

          {/* Drawer Content */}
          <div
            className={`absolute right-0 w-full max-w-sm bg-white dark:bg-slate-900 h-full shadow-lg transform transition-transform duration-300 flex flex-col ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}
          >
            <div className='p-4 flex justify-between items-center border-b border-gray-200 dark:border-gray-700'>
              <h2 className='text-xl font-bold'>Filters</h2>
              <Button
                variant='ghost'
                size='icon'
                onClick={() => setIsSidebarOpen(false)}
              >
                <X className='h-6 w-6' />
              </Button>
            </div>
            <div className='flex-1 overflow-y-auto p-4 custom-scrollbar'>
              <Sidebar
                filterCriteria={filterCriteria}
                transform={transform}
                setTransform={setTransform}
                resetTransform={resetTransform}
                setIsSidebarOpen={setIsSidebarOpen}
              />
            </div>
            <div className='p-4 border-t border-gray-200 dark:border-gray-700 text-center text-sm text-gray-500'>
              {visibleToolCount} Tools Found
            </div>
          </div>
        </div>

        <main className='w-full mt-8'>
          <Headline1>JSON Schema Tooling</Headline1>
          <p className='text-slate-600 block leading-7 pb-1 dark:text-slate-300'>
            Toolings below are written in different languages, and support part,
            or all, of at least one recent version of the specification.
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
                <Image
                  src='/img/tools/adding_your_tool.png'
                  className='rounded-sm'
                  height={68}
                  width={190}
                  alt='adding your tool'
                />
              </Link>
              <p className='hidden lg:block text-slate-600 dark:text-slate-300 px-4'>
                Raise an issue to get your tool added or updated in the tooling
                table.
              </p>
            </div>

            <div className='flex items-center justify-center gap-2 w-1/2'>
              <Link
                className='flex-none max-w-full'
                href='https://bowtie.report'
                target='_blank'
                rel='noreferrer'
              >
                <Image
                  src='/img/tools/try_bowtie.png'
                  className='rounded-sm'
                  height={68}
                  width={190}
                  alt='try bowtie'
                />
              </Link>
              <p className='hidden lg:block text-slate-600 dark:text-slate-300 px-4'>
                Bowtie is a meta-validator for JSON Schema implementations and
                it provides compliance reports.
              </p>
            </div>
          </div>

          <div className='flex flex-wrap items-center justify-between gap-4 mb-6'>
            <div className='flex items-center gap-4'>
              <GroupByMenu
                transform={transform}
                setTransform={setTransform}
                activeSections={Object.keys(toolsByGroup).filter(
                  (g) => g !== 'none' && toolsByGroup[g].length > 0,
                )}
              />
            </div>
            <div className='flex items-center gap-4'>
              <div className='text-sm text-gray-500 hidden sm:block'>
                {visibleToolCount} Tools
              </div>
              <Button
                variant='default'
                onClick={() => setIsSidebarOpen(true)}
                className='flex items-center gap-2 text-white'
              >
                <Filter className='h-4 w-4' />
                Filters
              </Button>
            </div>
          </div>

          <ToolingTable
            toolsByGroup={toolsByGroup}
            transform={transform}
            setTransform={setTransform}
            numberOfTools={numberOfTools}
            onVisibleToolCountChange={setVisibleToolCount}
          />

          <DocsHelp />
        </main>
      </div>
    </SectionContext.Provider>
  );
}

ToolingPage.getLayout = getLayout;
