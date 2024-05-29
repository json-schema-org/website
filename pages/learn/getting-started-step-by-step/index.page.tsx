import React from 'react';
import JsonEditor from '~/components/JsonEditor';
import data from '~/data/getting-started-examples.json';
import fs from 'fs';

import { getLayout } from '~/components/Sidebar';
import Head from 'next/head';
import { Headline1 } from '~/components/Headlines';
import matter from 'gray-matter';
import StyledMarkdown from '~/components/StyledMarkdown';
import { SectionContext } from '~/context';
import { DocsHelp } from '~/components/DocsHelp';

export async function getStaticProps() {
  const schemaFilepath = data.map((data) => data.file).join('');
  const instanceFilepath = data.map((data) => data.instances[0].file).join('');

  const schemaData = fs.readFileSync(schemaFilepath, 'utf-8');
  const instanceData = fs.readFileSync(instanceFilepath, 'utf-8');

  const block1 = fs.readFileSync(
    'pages/learn/getting-started-step-by-step/getting-started-step-by-step.md',
    'utf-8',
  );
  const { content: block1Content } = matter(block1);
  return {
    props: {
      schemaData,
      instanceData,
      blocks: [block1Content],
    },
  };
}

export default function StyledValidator({
  schemaData,
  instanceData,
  blocks,
}: {
  schemaData: string;
  instanceData: string;
  blocks: any[];
}) {
  const newTitle = 'Creating your first schema'; // replace this

  return (
    <SectionContext.Provider value='docs'>
      <Head>
        <title>{newTitle}</title>
      </Head>
      <Headline1>{newTitle}</Headline1>
      <StyledMarkdown markdown={blocks[0]} />

      <div className='flex flex-col'>
        <div className='flex flex-row justify-between mt-5'>
          <h1 className='text-h4 font-medium max-sm:text-[12px]'>
            Select a JSON Schema Validator
          </h1>
          <select
            name='Getting Started Examples'
            className='p-2 dark:bg-slate-900 rounded-md max-sm:text-[12px]'
            id='Examples'
          >
            {data.map((data, id) => {
              return (
                <option
                  key={id}
                  value={data.name}
                  className='dark:bg-slate-900'
                >
                  {data.name}
                </option>
              );
            })}
          </select>
        </div>

        <p className='my-5 leading-7'>
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Laboriosam
          tinctio sint voluptate.
        </p>

        <h2 className='text-h5'>JSON Schema</h2>

        <JsonEditor initialCode={schemaData} />
      </div>

      <div className='flex flex-col'>
        <div className='flex flex-row justify-between my-5'>
          <h1 className='text-h4 max-sm:text-[12px] font-medium'>
            Select a JSON Schema Instance
          </h1>
          <select
            name='Getting Started Examples'
            className='p-2  dark:bg-slate-900 rounded-md max-sm:text-[12px] '
            id='Examples'
          >
            {data.map((data, id) => {
              return (
                <option
                  key={id}
                  value={data.instances[0].name}
                  className='dark:bg-slate-900 max-sm:text-[12px]'
                >
                  {data.instances[0].name}
                </option>
              );
            })}
          </select>
        </div>

        <h2 className='text-h5'>Instance</h2>
        <JsonEditor initialCode={instanceData} />
      </div>

      <h2 className='text-h5'>Result</h2>
      <div className='flex bg-slate-800 justify-between items-center text-white font-medium flex-row border p-5 rounded-xl'>
        <p>This is a valid JSON instance for the provided JSON Schema</p>

        <img src='/icons/green-tick.svg' alt='' />
      </div>
      <div className='flex justify-end'>
        <button className='px-3 py-2 text-white rounded-md mt-5 bg-startBlue hover:bg-startBlue/90'>
          Download Example
        </button>
      </div>
      <DocsHelp />
    </SectionContext.Provider>
  );
}
StyledValidator.getLayout = getLayout;
