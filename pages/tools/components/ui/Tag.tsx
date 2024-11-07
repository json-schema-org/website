import React, { ReactNode } from 'react';
import classnames from 'classnames';

interface TagProps {
  children: ReactNode;
  intent?: 'success' | 'warning' | 'error' | 'neutral';
}

const Tag = ({ children, intent = 'neutral' }: TagProps) => {
  return (
    <div
      className={classnames(
        'inline-block rounded-full mr-2 px-3 py-1 text-[12px] font-semibold',
        {
          'bg-green-50 text-green-700 border border-green-300':
            intent === 'success',
          'bg-yellow-50 text-yellow-700 border border-yellow-300':
            intent === 'warning',
          'bg-red-50 text-red-700 border border-red-300': intent === 'error',
          'bg-gray-50 text-gray-700 border border-gray-300':
            intent === 'neutral',
        },
      )}
    >
      {children}
    </div>
  );
};

export default Tag;
