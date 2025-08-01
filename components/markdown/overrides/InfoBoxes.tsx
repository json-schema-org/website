import React from 'react';
import Image from 'next/image';

export const WarningBox = ({
  children,
  label,
}: {
  children: React.ReactNode;
  label?: string;
}) => (
  <div className='my-2'>
    {label && (
      <div className='bg-amber-100 inline-block text-sm rounded-t-lg px-6 py-1 text-amber-600'>
        {label}
      </div>
    )}
    <div className='flex flex-row items-center mb-6 bg-amber-100 px-6 py-4 border border-amber-100 rounded text-slate-500 leading-7'>
      <Image
        src='/icons/info-yellow.svg'
        className='h-7 w-7 mr-3'
        width={28}
        height={28}
        alt='info yellow'
      />
      <div className='font'>{children}</div>
    </div>
  </div>
);

export const InfoBox = ({
  children,
  label,
}: {
  children: React.ReactNode;
  label?: string;
}) => (
  <div className='my-2'>
    {label && (
      <div className='bg-blue-100 dark:bg-slate-950 dark:text-white inline-block text-sm rounded-t-lg px-6 py-1 text-blue-600'>
        {label}
      </div>
    )}
    <div className='flex flex-row items-center mb-6 bg-blue-50 px-6 py-4 border border-blue-100 rounded dark:bg-slate-900 dark:text-slate-300 text-slate-600 leading-7'>
      <Image
        src='/icons/info-blue.svg'
        className='mr-3'
        width={28}
        height={28}
        alt='info blue'
      />
      <div className='font'>{children}</div>
    </div>
  </div>
);

export const TipBox = ({
  children,
  label,
}: {
  children: React.ReactNode;
  label?: string;
}) => (
  <div className='my-2'>
    {label && (
      <div className='bg-green-100 inline-block text-sm rounded-t-lg px-6 py-1 text-green-600'>
        {label}
      </div>
    )}
    <div className='flex flex-row items-center mb-6 bg-green-50 px-6 py-4 border border-green-100 rounded text-slate-600 leading-7'>
      <Image
        src='/icons/bulb.svg'
        className='mr-3'
        width={28}
        height={28}
        alt='bulb'
      />
      <div className='font'>{children}</div>
    </div>
  </div>
);

export const DangerBox = ({
  children,
  label,
}: {
  children: React.ReactNode;
  label?: string;
}) => (
  <div className='my-2'>
    {label && (
      <div className='bg-red-100 inline-block text-sm rounded-t-lg px-6 py-1 text-red-600'>
        {label}
      </div>
    )}
    <div className='flex flex-row items-center mb-6 bg-red-50 px-6 py-4 border border-red-100 rounded text-slate-600 leading-7'>
      <Image
        src='/icons/warning.svg'
        className='mr-3'
        width={28}
        height={28}
        alt='warning'
      />
      <div className='font'>{children}</div>
    </div>
  </div>
);

export const infoBoxOverrides = {
  Warning: { component: WarningBox },
  Infobox: { component: InfoBox },
  Tip: { component: TipBox },
  Danger: { component: DangerBox },
};
