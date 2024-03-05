import React from 'react';
import { getLayout } from '~/components/Sidebar';
import fs from 'fs';
import matter from 'gray-matter';
import StyledMarkdown from '~/components/StyledMarkdown';
import yaml from 'js-yaml';
import { Headline1, Headline2, Headline3 } from 'components/Headlines';
import slugify from 'slugify';
import { useRouter } from 'next/router';
import classnames from 'classnames';
import { SectionContext } from '~/context';
import { DRAFT_ORDER } from '~/lib/config';

// @ts-ignore
import zeroFill from 'zero-fill';

export async function getStaticProps() {
  const validators = yaml.load(
    fs.readFileSync('data/validator-libraries-obsolete.yml', 'utf-8'),
  );
  const hyperLibaries = yaml.load(
    fs.readFileSync('data/hyper-libraries-obsolete.yml', 'utf-8'),
  );

  const intro = fs.readFileSync(
    'pages/obsolete-implementations/intro.md',
    'utf-8',
  );
  const main = fs.readFileSync(
    'pages/obsolete-implementations/main.md',
    'utf-8',
  );
  const main2 = fs.readFileSync(
    'pages/obsolete-implementations/main2.md',
    'utf-8',
  );
  const { content: introContent } = matter(intro);
  const { content: mainContent } = matter(main);
  const { content: main2Content } = matter(main2);
  return {
    props: {
      blocks: {
        intro: introContent,
        main: mainContent,
        main2: main2Content,
      },
      validators,
      hyperLibaries,
    },
  };
}

type ImplementationByLanguage = { name: string };

export default function ImplementationsPages({
  blocks,
  validators,
  hyperLibaries,
}: {
  blocks: any;
  validators: ImplementationByLanguage[];
  hyperLibaries: ImplementationByLanguage[];
}) {
  return (
    <SectionContext.Provider value='tools'>
      <Headline1>Obsolete Tools</Headline1>
      <StyledMarkdown markdown={blocks.intro} />

      <Headline2>Validators</Headline2>
      <ImplementationTable
        implementationsByLanguage={validators}
        prefix='validators-'
      />
      <StyledMarkdown markdown={blocks.main} />
      <ImplementationTable
        implementationsByLanguage={hyperLibaries}
        prefix='hyper-libaries-'
      />
      <StyledMarkdown markdown={blocks.main2} />
    </SectionContext.Provider>
  );
}
ImplementationsPages.getLayout = getLayout;
function ImplementationTable({
  implementationsByLanguage,
  prefix,
}: {
  implementationsByLanguage: any;
  prefix: string;
}) {
  const router = useRouter();
  return (
    <>
      <div className='flex flex-row flex-wrap grid-cols-7 grid'>
        {implementationsByLanguage.map(
          (implementationByLanguage: any, index: number) => {
            const slug =
              prefix +
              slugify(implementationByLanguage.name, {
                lower: true,
                trim: true,
              });
            const isActive = router.query.language === slug;
            return (
              <a
                key={index}
                href={`#${slug}`}
                className={classnames(
                  'block text-center text-white rounded p-2 cursor-pointer flex-1 m-1',
                  {
                    'bg-blue-800': isActive,
                    'bg-blue-500 hover:bg-blue-600': !isActive,
                  },
                )}
              >
                {implementationByLanguage.name}
              </a>
            );
          },
        )}
      </div>
      <div className='bg-blue-50 rounded-xl py-2 p-6 mt-4 pb-6 pt-0.5'>
        <table>
          <thead>
            <tr>
              <td />
              <td className='pt-6 pl-5 text-sm text-slate-500'>About</td>
              <td className='pt-6 pl-5 text-sm text-slate-500'>Drafts</td>
              <td className='pt-6 pl-5 text-sm text-slate-500'>License</td>
            </tr>
          </thead>
          <tbody>
            {implementationsByLanguage.map(
              (implementationByLanguage: any, index: number) => {
                const slug =
                  prefix +
                  slugify(implementationByLanguage.name, {
                    lower: true,
                    trim: true,
                  });
                const isActive = router.query.language === slug;
                if (router.query.language && !isActive) return null;

                return (
                  <React.Fragment key={index}>
                    <tr>
                      <td colSpan={3}>
                        <Headline3 attributes={{ slug }}>
                          {implementationByLanguage.name}
                        </Headline3>
                      </td>
                    </tr>
                    {implementationByLanguage.implementations.map(
                      (implementation: any, index: number) => {
                        const allDrafts = [
                          ...(implementation['date-draft'] || []),
                          ...(implementation['draft'] || []),
                        ];
                        return (
                          <tr
                            key={index}
                            className='pl-4 list-disc list-inside pl-2'
                          >
                            <td className=''>
                              <a
                                className='text-blue-500'
                                href={implementation.url}
                              >
                                {implementation.name}
                              </a>
                            </td>
                            <td className='pl-6'>
                              <StyledMarkdown markdown={implementation.notes} />
                            </td>
                            <td className='pl-6 pb-2'>
                              {allDrafts
                                ?.sort((a, b) =>
                                  DRAFT_ORDER.indexOf(a) <
                                  DRAFT_ORDER.indexOf(b)
                                    ? -1
                                    : 1,
                                )
                                ?.map((draft: string | number) => (
                                  <span
                                    className='bg-blue-400 inline-block mr-1 mb-1 text-white rounded px-1'
                                    key={draft}
                                  >
                                    {typeof draft === 'number'
                                      ? zeroFill(2, draft)
                                      : draft}
                                  </span>
                                ))}
                            </td>
                            <td className='pl-6'>{implementation.license}</td>
                          </tr>
                        );
                      },
                    )}
                  </React.Fragment>
                );
              },
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
