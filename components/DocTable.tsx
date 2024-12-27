import React from 'react';
import Link from 'next/link';

const DocTable = ({ frontmatter }: any) => {
  return (
    <>
      <div className='max-w-full mx-auto overflow-auto rounded-lg shadow-lg border-2 border-primary'>
        <div className='h-14 bg-primary text-white flex items-center p-6 font-semibold text-xl'>
          <h5>Specification Details</h5>
        </div>
        <table className='table-auto w-full bg-slate-200 dark:bg-slate-900 text-slate-700 dark:text-slate-300'>
          <tbody>
            <tr className='dark:hover:bg-slate-950 hover:bg-slate-300 border-b border-slate-300'>
              <td className='p-4 text-start font-medium'>
                <span className='font-semibold'>Specification</span>
              </td>
              <td className='p-4'>
                <Link
                  href={frontmatter.Specification}
                  className='text-linkBlue hover:underline'
                  target='_blank'
                >
                  {frontmatter.Specification}
                </Link>
              </td>
            </tr>
            <tr className='dark:hover:bg-slate-950 hover:bg-slate-300 border-b border-slate-300'>
              <td className='p-4 text-start font-medium'>
                <span className='font-semibold'>Published</span>
              </td>
              <td className='p-4'>{frontmatter.Published}</td>
            </tr>
            <tr className='dark:hover:bg-slate-950 hover:bg-slate-300 border-b border-slate-300'>
              <td className='p-4 text-start font-medium'>
                <span className='font-semibold'>Authors</span>
              </td>
              <td className='p-4'>
                {frontmatter.authors.map((author: string, index: number) => (
                  <span key={index}>
                    {author}
                    {index < frontmatter.authors.length - 1 ? ', ' : ''}
                  </span>
                ))}
              </td>
            </tr>
            <tr className='dark:hover:bg-slate-950 hover:bg-slate-300'>
              <td className='p-4 text-start font-medium'>
                <span className='font-semibold'>Metaschema</span>
              </td>
              <td className='p-4'>
                <Link
                  href={frontmatter.Metaschema}
                  className='text-linkBlue hover:underline'
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
