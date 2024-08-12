import React from 'react';
import Head from 'next/head';

import fs from 'fs';
import { getLayout } from '~/components/Sidebar';
import yaml from 'js-yaml';
import { SectionContext } from '~/context';
import { Headline1, Headline3 } from '~/components/Headlines';
import { DocsHelp } from '~/components/DocsHelp';
import Link from 'next/link';
import Image from 'next/image';

export async function getStaticProps() {
  const datas = yaml.load(fs.readFileSync('data/keywords.yml', 'utf-8'));

  return {
    props: {
      datas,
    },
  };
}

interface DataObject {
  name: string;
  vocabulary: string[];
  learnjsonschemalink: string;
  links?: LinkObject[];
}

interface LinkObject {
  url: string;
  title: string;
}

export default function StaticMarkdownPage({ datas }: { datas: DataObject[] }) {
  const markdownFile = '_index';
  return (
    <SectionContext.Provider value={null}>
      <Head>
        <title>JSON Schema - Keywords</title>
      </Head>
      <Headline1>JSON Schema Keywords</Headline1>
      <p className='text-slate-600 block leading-7 text-[19px] dark:text-slate-300'>
        JSON Schema keywords are the building blocks of JSON Schema. They are
        used to define the structure of a JSON document
      </p>

      <div className='mt-8'>
        {datas
          .sort((a: DataObject, b: DataObject) => a.name.localeCompare(b.name))
          .map((data: DataObject, index: number) => (
            <div key={index} className='mt-8'>
              <Headline3>{data.name}</Headline3>
              <p className='capitalize text-[20px] text-slate-600 block leading-7 dark:text-slate-300'>
                {data.vocabulary.join(', ')}
              </p>
              <ul className='mt-3 list-disc text-blue-500'>
                {data.links?.map((link: LinkObject, index: number) => (
                  <li key={index}>
                    <Link
                      href={link.url}
                      className='text-[18px] hover:underline'
                    >
                      {link.title}
                    </Link>
                  </li>
                ))}
              </ul>
              <Link
                href={data.learnjsonschemalink}
                className=' text-blue-500 hover:underline'
              >
                <li>
                  <span className='mt-2 flex text-[18px] flex-row gap-2 items-center'>
                    Learn JSON Schema
                    <Image
                      src={'/icons/external-link.svg'}
                      height={18}
                      width={18}
                      alt='external link'
                    />
                  </span>
                </li>
              </Link>
            </div>
          ))}
      </div>

      <DocsHelp markdownFile={markdownFile} />
    </SectionContext.Provider>
  );
}
StaticMarkdownPage.getLayout = getLayout;
