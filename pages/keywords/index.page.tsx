import React from 'react';
import Head from 'next/head';

import fs from 'fs';
import { getLayout } from '~/components/Sidebar';
import yaml from 'js-yaml';
import { SectionContext } from '~/context';
import { Headline1, Headline3 } from '~/components/Headlines';
import { DocsHelp } from '~/components/DocsHelp';
import Link from 'next/link';

export async function getStaticProps() {
  const datas = yaml.load(fs.readFileSync('data/keywords.yml', 'utf-8'));

  return {
    props: {
      datas,
    },
  };
}

interface DataObject {
  title: string;
  description: string;
  categorys: CategoryObject[];
}

interface CategoryObject {
  name: string;
  keywords: KeywordObject[];
}

interface KeywordObject {
  name: string;
  links: string[];
}

export default function StaticMarkdownPage({ datas }: { datas: DataObject[] }) {
  const markdownFile = '_index';
  return (
    <SectionContext.Provider value={null}>
      <Head>
        <title>JSON Schema - Keywords</title>
      </Head>
      {datas.map((data: DataObject, index: number) => (
        <div key={index}>
          <Headline1> {data.title}</Headline1>
          <p className='text-slate-600 block leading-7 dark:text-slate-300'>
            {data.description}
          </p>

          <div>
            {data.categorys.map((category, index: number) => (
              <div key={index}>
                <Headline3> {category.name}</Headline3>
                <table className='table-auto border-collapse w-full bg-slate-200 dark:bg-slate-900 text-slate-700 dark:text-slate-300'>
                  <tbody>
                    {category.keywords.map((keyword, index: number) => (
                      <tr
                        key={index}
                        className='dark:hover:bg-slate-950 hover:bg-slate-300'
                      >
                        <td className='border text-center border-slate-400 dark:border-slate-500 p-2'>
                          {keyword.name}
                        </td>
                        <td className='border border-slate-400 dark:border-slate-500 p-2 '>
                          {keyword.links.map((link, index: number) => (
                            <Link
                              href={link}
                              key={index}
                              className='text-linkBlue hover:text-blue-700'
                              target='_blank'
                            >
                              <p className='m-1  text-[14px] tracking-wider'>
                                {link}
                              </p>
                            </Link>
                          ))}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>{' '}
              </div>
            ))}
          </div>
        </div>
      ))}

      <DocsHelp markdownFile={markdownFile} />
    </SectionContext.Provider>
  );
}
StaticMarkdownPage.getLayout = getLayout;
