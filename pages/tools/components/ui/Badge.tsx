import React, { ReactNode } from 'react';

const Badge = ({ children }: { children: ReactNode }) => {
  return (
    <div className='whitespace-nowrap inline-block rounded-md bg-slate-200 dark:bg-slate-900 mx-[4px] my-[4px] px-[16px] py-[4px]'>
      {children}
    </div>
  );
};

export default Badge;
