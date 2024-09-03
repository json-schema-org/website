import React, { useEffect, useState } from 'react';
import Image from 'next/image';

export default function ScrollButton() {
  const [backToTopButton, setBackToTopButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Check the scroll position
      setBackToTopButton(window.scrollY > 150);
    };

    // Add scroll event listener to window
    window.addEventListener('scroll', handleScroll);

    // Cleanup function to remove the event listener when the component unmounts
    /* istanbul ignore next : can't test cleanup function */
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollUp = () => {
    window.scrollTo({
      top: 1,
      left: 0,
    });
  };

  return (
    <div className='fixed bottom-14 right-4 h-16 w-12 z-40'>
      {backToTopButton && (
        <button
          onClick={scrollUp}
          className='rounded-full transition-transform hover:-translate-y-2 duration-150 ease-in-out shadow-lg bg-white flex items-center justify-center'
          aria-label='Scroll to top'
          data-test='scroll-button'
        >
          {/* Ensure the image is in your public/img directory */}
          <Image
            alt='Scroll to top'
            width={40}
            height={40}
            src='/img/scroll.svg'
          />
        </button>
      )}
    </div>
  );
}
