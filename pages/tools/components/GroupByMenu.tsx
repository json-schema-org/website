import React, { Dispatch, SetStateAction, useState, useEffect, useRef } from 'react';
import { Button } from '~/components/ui/button';
import { Transform } from '../hooks/useToolsTransform';

interface GroupByMenuProps {
  transform: Transform;
  setTransform: Dispatch<SetStateAction<Transform>>;
  activeSections?: string[];
}

const GroupByMenu = ({ transform, setTransform, activeSections = [] }: GroupByMenuProps) => {
  const groupedBy = transform.groupBy;

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const groupBy = [
    {
      label: 'None',
      accessorKey: 'none',
    },
    {
      label: 'Tooling Type',
      accessorKey: 'toolingTypes',
    },
    {
      label: 'Language',
      accessorKey: 'languages',
    },
  ];

  const setGroupBy = (event: React.MouseEvent) => {
    setTransform((prev) => ({
      ...prev,
      groupBy: (event.target as HTMLButtonElement)
        .value as Transform['groupBy'],
      sortBy: 'name',
      sortOrder: 'ascending',
    }));
  };

  const scrollToSection = (section: string) => {
    setIsOpen(false);
    const id = section.toLowerCase().replace(/\s+/g, '-');
    const element = document.getElementById(id);
    if (element) {
      const y = element.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div className='my-8 ml-2 flex flex-col gap-4'>
      <div className='flex items-center gap-2'>
        <div className='flex max-w-full items-center space-x-2 overflow-x-auto p-1'>
          <span className='mr-2 text-sm font-bold text-slate-600 dark:text-slate-300 whitespace-nowrap'>
            GROUP BY:
          </span>

          {groupBy.map((group) => (
            <Button
              key={group.accessorKey}
              value={group.accessorKey}
              onClick={setGroupBy}
              variant={groupedBy === group.accessorKey ? 'default' : 'outline'}
              size='sm'
              className={`${groupedBy === group.accessorKey ? 'text-white dark:text-slate-900 dark:bg-[#bfdbfe]' : 'dark:bg-[#0f172a] text-black dark:text-slate-300 dark:border-transparent'}`}
            >
              {group.label}
            </Button>
          ))}
        </div>

        {groupedBy !== 'none' && activeSections.length > 0 && (
          <div className='relative' ref={dropdownRef}>
            <div className='mx-2 h-6 w-px bg-slate-300 dark:bg-slate-700 inline-block align-middle' />

            <Button
              variant='outline'
              size='sm'
              onClick={() => setIsOpen(!isOpen)}
              className='gap-2 border-blue-200 text-blue-600 hover:bg-blue-50 dark:border-blue-800 dark:text-blue-400 dark:hover:bg-blue-900/30'
            >
              Jump to Section
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='16'
                height='16'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
                className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
              >
                <path d='m6 9 6 6 6-6' />
              </svg>
            </Button>

            {isOpen && (
              <div
                className='absolute left-4 top-full z-50 mt-2 w-56 origin-top-left overflow-y-auto rounded-md border border-slate-100 bg-white shadow-xl ring-1 ring-black ring-opacity-5 focus:outline-none dark:border-slate-700 dark:bg-slate-800'
                style={{ maxHeight: '300px' }}
              >
                <div className='py-1'>
                  {activeSections.map((section) => (
                    <button
                      key={section}
                      onClick={() => scrollToSection(section)}
                      className='block w-full px-4 py-2 text-left text-sm text-slate-700 transition-colors hover:bg-slate-100 hover:text-blue-600 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-blue-400'
                    >
                      {section}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default GroupByMenu;
