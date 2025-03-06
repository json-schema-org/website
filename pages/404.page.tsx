import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useTheme } from 'next-themes';

const Logo = () => {
  const { resolvedTheme } = useTheme();
  const [imageSrc, setImageSrc] = useState('/img/logos/logo-blue.svg');

  useEffect(() => {
    const src =
      resolvedTheme === 'dark'
        ? '/img/logos/logo-white.svg'
        : '/img/logos/logo-blue.svg';
    setImageSrc(src);
  }, [resolvedTheme]);

  return (
    <Link href='/' className=''>
      <img
        src={imageSrc}
        className='h-8 lg:h-12 top-12 absolute left-1/2 -translate-x-1/2'
      />
    </Link>
  );
};

export default function PageNotFound() {
  return (
    <div className='h-screen w-full flex flex-col gap-8 items-center justify-center font-semibold text-center'>
      <Logo />
      <h1 className='leading-header text-h1 hidden lg:block'>
        404 - Page Not Found!
      </h1>

      <h1 className='lg:hidden text-h1 drop-shadow-[0px_0px_30px_rgba(148,163,184,0.9)]'>
        404
      </h1>
      <h1 className='lg:hidden text-h5mobile'>Page Not Found!</h1>

      <div className='font-light text-sm lg:text-xl'>
        The page you were looking for doesn't exist.
      </div>
      <Link
        href='/'
        className='flex items-center justify-center rounded border-2 border-white dark:border-none hover:bg-blue-700 transition-all duration-300 ease-in-out text-white w-[194px] h-10 font-semibold bg-primary dark:shadow-2xl'
      >
        BACK TO HOME
      </Link>
    </div>
  );
}
