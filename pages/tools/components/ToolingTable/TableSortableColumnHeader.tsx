import React, {
  Dispatch,
  ReactNode,
  SetStateAction,
  useEffect,
  useState,
} from 'react';
import TableColumnHeader from './TableColumnHeader';
import type { Filters } from '../../hooks/useFilterTools';

const TableSortableColumnHeader = ({
  className,
  sortBy,
  preferences,
  setPreferences,
  children,
}: {
  className: string;
  sortBy: Filters['sortBy'];
  preferences: Filters;
  setPreferences: Dispatch<SetStateAction<Filters>>;
  children: ReactNode;
}) => {
  const [isSortedBy, setIsSortedBy] = useState(preferences.sortBy === sortBy);

  useEffect(() => {
    setIsSortedBy(preferences.sortBy === sortBy);
  }, [preferences.sortBy]);

  const sortByColumn = (e: React.MouseEvent) => {
    e.preventDefault();
    setPreferences((prevPreferences) => {
      const newSortOrder =
        prevPreferences.sortBy === sortBy
          ? prevPreferences.sortOrder === 'descending'
            ? 'ascending'
            : 'descending'
          : 'ascending';
      return {
        ...prevPreferences,
        sortBy,
        sortOrder: newSortOrder,
      };
    });

    setIsSortedBy(true);
  };

  const rotateClass = preferences.sortOrder === 'ascending' ? 'rotate-180' : '';

  return (
    <TableColumnHeader className={className}>
      <button
        className='flex items-center focus:outline-none'
        onClick={sortByColumn}
      >
        {children}
        {isSortedBy && (
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
            className={`w-4 h-4 ml-1 transform ${rotateClass}`}
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              d='M5 15l7-7 7 7'
            />
          </svg>
        )}
      </button>
    </TableColumnHeader>
  );
};

export default TableSortableColumnHeader;
