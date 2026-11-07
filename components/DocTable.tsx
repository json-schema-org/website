/* eslint-disable linebreak-style */
import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Author } from '~/types/common';

interface DocTableProps {
  frontmatter: {
    Specification?: string;
    Published?: string;
    authors?: (string | Author)[];
    Metaschema?: string;
  };
}

const DocTable = ({ frontmatter }: DocTableProps) => {
  const authors = frontmatter.authors ?? [];
  const getAuthorName = (author: string | Author): string =>
    typeof author === 'string' ? author : author.name;

  return (
    <Card className='w-full overflow-hidden py-0 border-2 border-primary shadow-lg gap-0'>
      <CardHeader className='bg-primary text-primary-foreground p-2 rounded-none'>
        <CardTitle className='pl-5 text-xl font-semibold text-white'>
          Specification Details
        </CardTitle>
      </CardHeader>
      <CardContent className='p-0'>
        <div className='bg-[#e2e8f0] dark:bg-[#0f172a]'>
          {frontmatter.Specification && (
            <div className='border-b border-border'>
              <div className='flex'>
                <div className='w-1/3 p-4 font-semibold text-base text-[#334155] dark:text-slate-300'>
                  Specification
                </div>
                <div className='w-2/3 p-4'>
                  <Link
                    href={frontmatter.Specification}
                    className='text-primary hover:underline dark:text-blue-400'
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    {frontmatter.Specification}
                  </Link>
                </div>
              </div>
            </div>
          )}
          {frontmatter.Published && (
            <div className='border-b border-border'>
              <div className='flex'>
                <div className='w-1/3 p-4 font-semibold text-base text-[#334155] dark:text-slate-300'>
                  Published
                </div>
                <div className='w-2/3 p-4'>{frontmatter.Published}</div>
              </div>
            </div>
          )}
          {authors.length > 0 && (
            <div className='border-b border-border'>
              <div className='flex'>
                <div className='w-1/3 p-4 font-semibold text-base text-[#334155] dark:text-slate-300'>
                  Authors
                </div>
                <div className='w-2/3 p-4'>
                  {authors.map((author, index: number) => (
                    <span key={index}>
                      {getAuthorName(author)}
                      {index < authors.length - 1 ? ', ' : ''}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
          {frontmatter.Metaschema && (
            <div>
              <div className='flex'>
                <div className='w-1/3 p-4 font-semibold text-base text-[#334155] dark:text-slate-300'>
                  Metaschema
                </div>
                <div className='w-2/3 p-4'>
                  <Link
                    href={frontmatter.Metaschema}
                    className='text-primary hover:underline dark:text-blue-400'
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    {frontmatter.Metaschema}
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DocTable;
