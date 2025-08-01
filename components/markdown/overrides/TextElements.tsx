/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import Link from 'next/link';
import classnames from 'classnames';

export const Paragraph = ({ children }: { children: React.ReactNode }) => (
  <p className='text-slate-600 block leading-7 pb-4 dark:text-slate-300'>
    {children}
  </p>
);

export const Strong = ({ children }: { children: React.ReactNode }) => (
  <strong className='font-semibold text-slate-800 dark:text-slate-200'>
    {children}
  </strong>
);

export const Italic = ({ children }: { children: React.ReactNode }) => (
  <i>{children}</i>
);

export const Bold = ({ children }: { children: React.ReactNode }) => (
  <b>{children}</b>
);

export const Anchor = ({
  children,
  href,
  title,
  className,
}: {
  children: React.ReactNode;
  href?: string;
  title?: string;
  className?: string;
}) => {
  if (!href) return <>{children}</>;

  // Check if the existing className starts with 'plausible-event-name'
  const additionalClass =
    className && className.startsWith('plausible-event-name') ? className : '';

  // Define the base className
  const baseClassName = 'text-blue-500 hover:text-blue-600';

  // Combine the base className with the additionalClass if it exists
  const combinedClassName = `${baseClassName} ${additionalClass}`.trim();

  const link =
    href.charAt(0) === '/' ? (
      <Link as={href} href='/' title={title} className={combinedClassName}>
        {children}
      </Link>
    ) : (
      <a href={href} title={title} className={combinedClassName}>
        {children}
      </a>
    );

  return <>{link}</>;
};

export const SpecialBox = ({ children }: { children: React.ReactNode }) => (
  <div className='bg-blue-200 border-l-4 border-blue-500 px-4 py-1 relative text-blue-700 dark:bg-blue-900 dark:border-blue-400 dark:text-blue-200'>
    {children}
  </div>
);

export const textOverrides = {
  p: { component: Paragraph },
  strong: { component: Strong },
  italic: { component: Italic },
  bold: { component: Bold },
  a: { component: Anchor },
  specialBox: { component: SpecialBox },
};
