/* eslint-disable react/react-in-jsx-scope */
import { useEffect, useState } from 'react';
import { Button } from '~/components/ui/button';
import { ArrowUp } from 'lucide-react';

export default function ScrollButton() {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (typeof window !== 'undefined') {
        setShowButton(window.scrollY > 150);
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', handleScroll);
      // Initial check
      handleScroll();
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, []);

  const scrollUp = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className='fixed bottom-14 right-4 h-12 w-12 z-40'>
      {showButton && (
        <Button
          onClick={scrollUp}
          variant='outline'
          size='icon'
          className='rounded-full transition-all duration-200 ease-in-out shadow-lg 
            bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600
            hover:bg-gray-50 dark:hover:bg-gray-700 hover:-translate-y-1
            flex items-center justify-center h-full w-full'
          aria-label='Scroll to top'
          data-test='scroll-button'
        >
          <ArrowUp className='h-6 w-6 text-gray-700 dark:text-gray-300' />
        </Button>
      )}
    </div>
  );
}
