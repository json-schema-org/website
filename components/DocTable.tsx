import React from 'react';

const DocTable = ({ frontmatter }: any) => {
  return (
    <>
      <div className='max-w-full mx-auto overflow-auto'>
        <table className='table-auto border-collapse w-full bg-slate-900'>
          <tbody>
            <tr className='hover:bg-slate-950'>
              <td className='border border-slate-500 p-2 text-center'>
                Specification
              </td>
              <td className='border border-slate-500 p-2'>
                {frontmatter.Specification}
              </td>
            </tr>
            <tr className='hover:bg-slate-950'>
              <td className='border border-slate-500 p-2 text-center'>
                Published
              </td>
              <td className='border border-slate-500 p-2'>
                {frontmatter.Published}
              </td>
            </tr>
            <tr className='hover:bg-slate-950 '>
              <td className='border border-slate-500 p-2 text-center'>
                Authors
              </td>
              <td className='border border-slate-500 p-2'>
                {frontmatter.authors.map((author: string, index: number) => {
                  return <div key={index}>{author}</div>;
                })}
              </td>
            </tr>
            <tr className='hover:bg-slate-950'>
              <td className='border border-slate-500 p-2 text-center'>
                Metaschema
              </td>
              <td className='border border-slate-500 p-2 '>
                {frontmatter.Metaschema}
              </td>
            </tr>
            <tr className='hover:bg-slate-950 '>
              <td className='border border-slate-500 p-2 text-center'>
                Implementations
              </td>
              <td className='border border-slate-500 p-2'>
                {frontmatter.Implementations}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
};

export default DocTable;
