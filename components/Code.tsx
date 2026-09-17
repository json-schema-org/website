import React, { useContext } from 'react';
import classnames from 'classnames';
import { BlockContext, BlockContextValue } from '~/context';

export default function Code({ children }: { children: any }) {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const blockContext = useContext(BlockContext);
  return (
    <code
      className={classnames(
        'font-mono text-[0.9em] tracking-tight rounded px-1.5 py-0.5',
        {
          'bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200':
            blockContext === null,
          'bg-amber-200 text-slate-900':
            blockContext === BlockContextValue.Information,
          'text-white': blockContext === BlockContextValue.CodeBlock,
        },
      )}
      data-test='code'
    >
      {children}
    </code>
  );
}
