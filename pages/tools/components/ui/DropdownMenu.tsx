import classnames from 'classnames';
import { useRouter } from 'next/router';
import React, {
  type ReactElement,
  type ReactNode,
  useEffect,
  useState,
  Children,
  cloneElement,
  isValidElement,
} from 'react';

interface DropdownMenuProps {
  children: ReactNode;
  label: string;
  icon: ReactElement;
  selectedCount?: number;
  keepOpenOnSelection?: boolean;
}

export default function DropdownMenu({
  children,
  label,
  icon,
  selectedCount = 0,
  keepOpenOnSelection = true,
}: DropdownMenuProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const router = useRouter();

  const enhancedChildren = Children.map(children, (child) => {
    if (isValidElement(child) && child.type === 'Checkbox') {
      return cloneElement(child, {
        ...child.props,
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
          if (child.props.onChange) {
            child.props.onChange(e);
          }

          if (!keepOpenOnSelection) {
            setIsDropdownOpen(false);
          }
        },
      });
    }
    return child;
  });

  useEffect(() => {
    setIsDropdownOpen(false);
  }, [router]);

  return (
    <div className='my-2 bg-slate-200 dark:bg-slate-900 p-2 rounded'>
      <div
        className='w-full flex justify-between items-center cursor-pointer'
        onClick={() => setIsDropdownOpen((prev) => !prev)}
      >
        {React.cloneElement(icon, {
          className: 'mr-2',
        })}
        <div className='text-slate-900 dark:text-slate-300 font-bold mr-auto'>
          {label}
        </div>
        {selectedCount > 0 && (
          <div className='h-7 w-7 flex items-center justify-center text-slate-900 dark:border-white dark:text-slate-300 font-bold border-black border-black-100 border-2 rounded-full bg-white dark:bg-slate-700 shadow-md mr-2 text-md'>
            {selectedCount}
          </div>
        )}
        <svg
          style={{
            transform: `${isDropdownOpen ? 'rotate(180deg)' : 'rotate(0)'}`,
            transition: 'all 0.2s linear',
          }}
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          height='24'
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
          'ml-0 mt-0 overflow-hidden transition-all duration-500 ease-in-out',
          {
            'max-h-0 opacity-0 invisible': !isDropdownOpen,
            'max-h-80 overflow-y-auto opacity-100 visible': isDropdownOpen,
          },
        )}
      >
        {enhancedChildren}
      </div>
    </div>
  );
}
