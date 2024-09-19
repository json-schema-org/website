import React from 'react';
import Link from 'next/link';

const DocTable = ({ frontmatter }: any) => {
  return (
    <>
      <div className='max-w-full mx-auto overflow-auto'>
        <table className='table-auto border-collapse w-full bg-slate-200 dark:bg-slate-900 text-slate-700 dark:text-slate-300'>
          <tbody>
            <tr className='dark:hover:bg-slate-950 hover:bg-slate-300'>
              <td className='border border-slate-400 dark:border-slate-500 p-2 text-center font-semibold'>
                Specification
              </td>
              <td className='border border-slate-400 dark:border-slate-500 p-2'>
                <Link
                  href={frontmatter.Specification}
                  className='text-linkBlue'
                  target='_blank'
                >
                  {' '}
                  {frontmatter.Specification}
                </Link>
              </td>
            </tr>
            <tr className='dark:hover:bg-slate-950 hover:bg-slate-300'>
              <td className='border border-slate-400 dark:border-slate-500 p-2 text-center font-semibold'>
                Published
              </td>
              <td className='border border-slate-400 dark:border-slate-500 p-2'>
                {frontmatter.Published}
              </td>
            </tr>
            <tr className='dark:hover:bg-slate-950 hover:bg-slate-300 '>
              <td className='border border-slate-400 dark:border-slate-500 p-2 text-center font-semibold'>
                Authors
              </td>
              <td className='border border-slate-400 dark:border-slate-500 p-2'>
                {frontmatter.authors.map((author: string, index: number) => {
                  return <div key={index}>{author}</div>;
                })}
              </td>
            </tr>
            <tr className='dark:hover:bg-slate-950 hover:bg-slate-300'>
              <td className='border border-slate-400 dark:border-slate-500 p-2 text-center font-semibold'>
                Metaschema
              </td>
              <td className='border border-slate-400 dark:border-slate-500 p-2 '>
                <Link
                  href={frontmatter.Metaschema}
                  className='text-linkBlue'
                  target='_blank'
                >
                  {frontmatter.Metaschema}
                </Link>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
};

export default DocTable;
