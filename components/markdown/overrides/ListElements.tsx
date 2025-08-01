import React from 'react';

export const OrderedList = ({ children }: { children: React.ReactNode }) => (
  <ol className='list-decimal mt-2 mb-4 ml-5'>{children}</ol>
);

export const UnorderedList = ({ children }: { children: React.ReactNode }) => (
  <ul className='mt-2 mb-4 list-disc list-outside ml-5'>{children}</ul>
);

export const ListItem = ({ children }: { children: React.ReactNode }) => (
  <li className='mt-1 leading-7 text-slate-600 dark:text-slate-300'>
    {children}
  </li>
);

export const listOverrides = {
  ol: { component: OrderedList },
  ul: { component: UnorderedList },
  li: { component: ListItem },
};
