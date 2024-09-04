import classnames from 'classnames';
import { useRouter } from 'next/router';
import React, {
  type ReactElement,
  type ReactNode,
  useEffect,
  useState,
} from 'react';

interface DropdownMenuProps {
  children: ReactNode;
  label: string;
  icon: ReactElement;
}

export default function DropdownMenu({
  children,
  label,
  icon,
}: DropdownMenuProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsDropdownOpen(false);
  }, [router]);

  return (
    <div className='my-2 bg-slate-200 dark:bg-slate-900 p-2 rounded'>
      <div
        className='w-full flex justify-between items-center align-middle'
        onClick={() => {
          setIsDropdownOpen((prev) => !prev);
        }}
      >
        {React.cloneElement(icon, {
          className: 'mr-2',
        })}
        <div className='text-slate-900 dark:text-slate-300 font-bold mr-auto'>
          {label}
        </div>
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

      <div
        className={classnames(
          'tools-dropdown-menu',
          'ml-0 mt-4 overflow-x-hidden overscroll-y-auto max-h-80',
          { hidden: !isDropdownOpen },
        )}
      >
        {children}
      </div>
    </div>
  );
}
