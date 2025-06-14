import React, { ReactNode } from 'react';
import { Badge as ShadcnBadge } from '../../../../components/ui/badge';

interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'secondary' | 'outline' | 'destructive';
}

const Badge = ({ children, variant = 'secondary' }: BadgeProps) => {
  return (
    <ShadcnBadge
      variant={variant}
      className='mx-[4px] my-[4px] bg-[#e2e8f0] dark:bg-[#0f172a] text-[#0f172a] dark:text-white'
    >
      {children}
    </ShadcnBadge>
  );
};

export default Badge;
