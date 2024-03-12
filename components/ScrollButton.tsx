import React, { useEffect, useState } from 'react';
import Image from 'next/image';

function ScrollButton() {
  const [backToTopButton, setBackToTopButton] = useState(false);
  useEffect(() => {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 150) {
        setBackToTopButton(true);
      } else {
        setBackToTopButton(false);
      }
    });
  }, []);

  const scrollUp = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };
  return (
    <div className='fixed bottom-14 right-4 h-16 w-12 z-40'>
      {backToTopButton && (
        <button
          className='rounded-full transition-transform hover:-translate-y-2 duration-150 ease-in-out shadow-lg bg-white '
          onClick={scrollUp}
        >
          <Image alt='image' width={40} height={40} src='/img/scroll.svg' />
        </button>
      )}
    </div>
  );
}

export default ScrollButton;
