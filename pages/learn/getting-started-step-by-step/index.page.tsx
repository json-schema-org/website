import React, { useState, useEffect } from 'react';
import JsonEditor from '~/components/JsonEditor';
import fs from 'fs';

import { getLayout } from '~/components/Sidebar';
import Head from 'next/head';
import { Headline1 } from '~/components/Headlines';
import matter from 'gray-matter';
import StyledMarkdown from '~/components/StyledMarkdown';
import { SectionContext } from '~/context';
import { DocsHelp } from '~/components/DocsHelp';

export async function getStaticProps() {
  const block1 = fs.readFileSync(
    'pages/learn/getting-started-step-by-step/getting-started-step-by-step.md',
    'utf-8',
  );
  const { content: block1Content } = matter(block1);
  return {
    props: {
      blocks: [block1Content],
    },
  };
}

const fetchData = async () => {
  const response = await fetch('/getting-started-examples.json');
  const data = await response.json();
  return data;
};

export default function StyledValidator({ blocks }: { blocks: any[] }) {
  const newTitle = 'Creating your first schema';

  const [options, setOptions] = useState([]);
  const [selectedSchema, setSelectedSchema] = useState(
    '/getting-started-examples/schemas/default.json',
  );

  // const [selectedInstance, setSelectedInstance] = useState(
  //   '/getting-started-examples/instances/default-ok.json',
  // );

  useEffect(() => {
    fetchData().then((data) => setOptions(data));
  }, []);

  const handleChange = (e: any) => {
    setSelectedSchema(e.target.value);
  };

  return (
    <SectionContext.Provider value='docs'>
      <Head>
        <title>{newTitle}</title>
      </Head>
      <Headline1>{newTitle}</Headline1>
      <StyledMarkdown markdown={blocks[0]} />

      <div className='flex flex-col'>
        <div className='flex items-center flex-row justify-between mt-5 mb-3 '>
          <h2 className='text-h5 font-semibold'>JSON Schema</h2>
          <select
            name='Select a JSON Schema Validator'
            className='p-2 border dark:border-slate-300 border-slate-800 dark:bg-slate-900 rounded-md max-sm:text-[12px]'
            id='Examples'
            value={selectedSchema}
            onChange={handleChange}
          >
            {options.map((option: any) => (
              <option key={option.name} value={option.file}>
                {option.name}
              </option>
            ))}
          </select>
        </div>
        <div>{selectedSchema}</div>
        <JsonEditor initialCode={''} />
      </div>

      <div className='flex flex-col'>
        <div className='flex items-center flex-row justify-between mb-3 '>
          <h2 className='text-h5 font-semibold'>Instance</h2>
          <select
            name='Select a JSON Schema Instance'
            className='p-2 border dark:border-slate-300 border-slate-800 dark:bg-slate-900 rounded-md max-sm:text-[12px] '
            id='Examples'
          ></select>
        </div>

        <JsonEditor initialCode={'instanceData'} />
      </div>

      <h2 className='text-h5 font-semibold'>Result</h2>
      <div className='flex bg-slate-800 justify-between items-center text-white font-medium flex-row border p-5 rounded-xl'>
        {/* {data.map((data, id) => {
          return (
            <>
              <p key={id}>{data.instances[0].details}</p>

              {data.instances[0].valid ? (
                <img src='/icons/green-tick.svg' alt='green tick' />
              ) : (
                <img src='/icons/red-cross.svg' alt='red cross' />
              )}
            </>
          );
        })} */}
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
