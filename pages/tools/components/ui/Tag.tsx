import React, { ReactNode } from 'react';
import { Badge as ShadcnBadge } from '../../../../components/ui/badge';

interface TagProps {
  children: ReactNode;
  intent?: 'success' | 'warning' | 'error' | 'neutral';
}

const Tag = ({ children, intent = 'neutral' }: TagProps) => {
  const styles = {
    success:
      'bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400',
    warning:
      'bg-amber-500/10 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400',
    error: 'bg-red-500/10 dark:bg-red-500/20 text-red-700 dark:text-red-400',
    neutral:
      'bg-slate-500/10 dark:bg-slate-500/20 text-slate-700 dark:text-slate-400',
  } as const;

  return (
    <ShadcnBadge
      variant={
        intent === 'success'
          ? 'default'
          : intent === 'warning'
            ? 'outline'
            : intent === 'error'
              ? 'destructive'
              : 'secondary'
      }
      className={`mr-2 text-[12px] font-semibold ${styles[intent]}`}
    >
      {children}
    </ShadcnBadge>
  );
};

export default Tag;
