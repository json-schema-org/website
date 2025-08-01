import React from 'react';
import Image from 'next/image';
import classnames from 'classnames';

export const Star = ({ label }: { label: string }) => (
  <div className='flex flex-row items-center text-blue-500 text-lg font-semibold mb-6 mt-10'>
    <Image
      src='/icons/star.svg'
      width={20}
      height={20}
      className='mr-2 mb-1'
      alt='star'
    />
    {label}
  </div>
);

export const StarInline = ({ label }: { label: string }) => (
  <div className='inline-flex flex-row items-center text-blue-500 font-semibold'>
    <Image
      src='/icons/info-yellow.svg'
      className='mr-1'
      width={12}
      height={12}
      alt='info yellow'
    />
    {label}
  </div>
);

export const Bigquote = ({ children }: { children: React.ReactNode }) => (
  <div className='text-h2mobile md:text-h2 text-center p-10 py-16 font-semibold text-slate-500 bg-slate-50 mb-4 rounded-xl'>
    "{children}"
  </div>
);

export const Regularquote = ({ children }: { children: React.ReactNode }) => (
  <div className='text-2xl my-5 mx-8 border-gray-300 bg-gray-300 dark:bg-gray-300 p-4 p-t-6 text-center dark:text-slate-800 rounded-xl'>
    {children}
  </div>
);

export const Blockquote = ({ children }: { children: React.ReactNode }) => (
  <div className='bg-slate-50/50 dark:bg-slate-700 px-4 pt-4 mt-2 mb-4 border-l-2 border-slate-300'>
    {children}
  </div>
);

export const Summary = ({ children }: { children: React.ReactNode }) => (
  <summary className='bg-slate-100 -mx-4 p-4 rounded-xl my-3 cursor-pointer hover:bg-slate-200'>
    {children}
  </summary>
);

export const Details = ({ children }: { children: React.ReactNode }) => (
  <details className='bg-slate-50 p-0 rounded-xl my-3 px-4'>{children}</details>
);

export const UserEvent = ({
  children,
  type,
}: {
  children: React.ReactNode;
  type: string;
}) => {
  // Use React.Children.map to iterate over each child element
  const modifiedChildren = React.Children.map(children, (child) => {
    // Clone each child element
    const clonedChild = React.cloneElement(child as React.ReactElement, {
      // Append the type class to the existing className
      className: classnames(
        (child as React.ReactElement).props.className,
        type,
      ),
    });

    return clonedChild;
  });

  return <>{modifiedChildren}</>;
};

export const Keywords = () => null;

export const customOverrides = {
  Star: { component: Star },
  StarInline: { component: StarInline },
  Bigquote: { component: Bigquote },
  Regularquote: { component: Regularquote },
  blockquote: { component: Blockquote },
  summary: { component: Summary },
  details: { component: Details },
  userevent: { component: UserEvent },
  Keywords: { component: Keywords },
};
