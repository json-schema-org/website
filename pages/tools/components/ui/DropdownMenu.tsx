/* eslint-disable linebreak-style */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable linebreak-style */
import React, {
  type ReactElement,
  type ReactNode,
  useEffect,
  useState,
} from 'react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

interface DropdownMenuProps {
  children: ReactNode;
  label: string;
  icon: ReactElement;
  count?: number;
  testMode?: boolean;
  isOpen?: boolean;
  onToggle?: () => void;
}

export default function DropdownMenu({
  children,
  label,
  icon,
  count = 0,
  isOpen,
  onToggle,
}: DropdownMenuProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    if (onToggle && isOpen !== undefined) {
      setIsDropdownOpen(isOpen);
    }
  }, [isOpen, onToggle]);

  const handleToggle = () => {
    if (onToggle) {
      onToggle();
    } else {
      setIsDropdownOpen(!isDropdownOpen);
    }
  };

  return (
    <div className='my-2 bg-slate-200 dark:bg-slate-900 p-2 rounded cursor-pointer transition-all duration-200 group'>
      <Collapsible open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
        <CollapsibleTrigger
          className='w-full flex justify-between items-center align-middle cursor-pointer'
          onClick={handleToggle}
        >
          <div className='flex items-center'>
            {React.cloneElement(icon, {
              className:
                'mr-2 ml-2 transition-transform duration-200 group-hover:scale-110',
            })}
            <div className='text-slate-900 dark:text-slate-300 font-bold transition-all duration-200 group-hover:text-blue-600 dark:group-hover:text-[#bfdbfe] group-hover:scale-105'>
              {label}
            </div>
          </div>
          <div className='flex items-center gap-2'>
            {count > 0 && (
              <span className='bg-primary text-white dark:bg-[#bfdbfe] dark:text-slate-900 text-xs px-2 py-0.5 rounded-full transition-transform duration-200 group-hover:scale-105'>
                {count}
              </span>
            )}
            <svg
              style={{
                transform: `${isDropdownOpen ? 'rotate(180deg)' : 'rotate(0)'}`,
                transition: 'all 0.2s linear',
                cursor: 'pointer',
              }}
              id='arrow'
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              height='32'
              viewBox='0 0 24 24'
              width='24'
            >
              <path
                clipRule='evenodd'
                d='m16.5303 8.96967c.2929.29289.2929.76777 0 1.06063l-4 4c-.2929.2929-.7677.2929-1.0606 0l-4.00003-4c-.29289-.29286-.29289-.76774 0-1.06063s.76777-.29289 1.06066 0l3.46967 3.46963 3.4697-3.46963c.2929-.29289.7677-.29289 1.0606 0z'
                fill='#707070'
                fillRule='evenodd'
              />
            </svg>
          </div>
        </CollapsibleTrigger>

        <CollapsibleContent className='ml-0 mt-0 overflow-hidden transition-all duration-500 ease-in-out data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up'>
          <div className='max-h-[20vh] overflow-y-auto transition-all duration-500 ease-in-out'>
            {children}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
