/* eslint-disable react/react-in-jsx-scope */
import { useEffect, useState } from 'react';
import { Button } from '~/components/ui/button';
import { ArrowDown, ArrowUp } from 'lucide-react';

type ScrollMode = 'up' | 'down';

export default function ScrollButton() {
  const [mode, setMode] = useState<ScrollMode | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const { innerHeight, scrollY } = window;
      const scrollHeight = document.documentElement.scrollHeight;
      const isLongPage = scrollHeight > innerHeight * 2.5;
      const canScrollUp = scrollY > 150;

      if (!isLongPage) {
        setMode(null);
        return;
      }

      if (canScrollUp) {
        setMode('up');
      } else if (scrollY < 50) {
        setMode('down');
      } else {
        setMode(null);
      }
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll);
    handleScroll();
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  const scroll = () => {
    if (mode === 'down') {
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: 'smooth',
      });
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className='fixed bottom-14 right-4 h-12 w-12 z-40'>
      {mode && (
        <Button
          onClick={scroll}
          variant='outline'
          size='icon'
          className='rounded-full transition-all duration-200 ease-in-out shadow-lg 
            bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600
            hover:bg-gray-50 dark:hover:bg-gray-700 hover:-translate-y-1
            flex items-center justify-center h-full w-full'
          aria-label={mode === 'down' ? 'Scroll to bottom' : 'Scroll to top'}
          data-test='scroll-button'
        >
          {mode === 'down' ? (
            <ArrowDown className='h-6 w-6 text-gray-700 dark:text-gray-300' />
          ) : (
            <ArrowUp className='h-6 w-6 text-gray-700 dark:text-gray-300' />
          )}
        </Button>
      )}
    </div>
  );
}
