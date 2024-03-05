import React from 'react';
import { getLayout } from '~/components/SiteLayout';
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
    fs.readFileSync('data/validator-libraries-modern.yml', 'utf-8'),
  );
  const hyperLibaries = yaml.load(
    fs.readFileSync('data/hyper-libraries-modern.yml', 'utf-8'),
  );

  const intro = fs.readFileSync('pages/implementations/intro.md', 'utf-8');
  const main = fs.readFileSync('pages/implementations/main.md', 'utf-8');
  const { content: introContent } = matter(intro);
  const { content: mainContent } = matter(main);
  return {
    props: {
      blocks: {
        intro: introContent,
        main: mainContent,
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
      <div className='w-5/6 mx-auto mt-12'>
        <Headline1>Tools</Headline1>
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
      </div>
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
              <td className='pt-6 pl-5 text-sm text-slate-500 hidden sm:table-cell'>
                About
              </td>
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
                        let mixedNotes = '';
                        if (implementation.notes) {
                          mixedNotes = implementation.notes;
                        }
                        if (implementation.compliance) {
                          if (implementation.notes) {
                            mixedNotes += '<br/><em>Compliance:</em>';
                          } else {
                            mixedNotes = '<em>Compliance:</em>';
                          }
                          if (implementation.compliance.config.docs) {
                            mixedNotes +=
                              ' This implementation <a href="' +
                              implementation.compliance.config.docs +
                              '">documents</a> that you must ';
                          }
                          if (implementation.compliance.config.instructions) {
                            mixedNotes +=
                              '<strong>' +
                              implementation.compliance.config.instructions +
                              '</strong> to produce specification-compliant behavior.';
                          }
                        }
                        const allDrafts = [
                          ...(implementation['date-draft'] || []),
                          ...(implementation['draft'] || []),
                        ];
                        return (
                          <tr
                            key={index}
                            className='pl-4 list-disc list-inside pl-2 separation-line'
                          >
                            <td className=''>
                              <a
                                className='text-blue-500'
                                href={implementation.url}
                              >
                                {implementation.name}
                              </a>
                            </td>
                            <td className='pl-6 hidden sm:table-cell'>
                              <StyledMarkdown markdown={mixedNotes} />
                            </td>
                            <td className='pl-6 pb-2 pt-2'>
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
