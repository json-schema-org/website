import React from 'react';

interface AmbassadorsLink {
  title: string;
  icon: string;
  details: string;
}

interface AmbassadorsListProps {
  ambassadorList: {
    contents: AmbassadorsLink[];
  };
}

const AmbassadorList = ({ ambassadorList }: AmbassadorsListProps) => {
  return (
    <ul className='mt-10 grid grid-cols-1 gap-8 px-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3'>
      {ambassadorList.contents.map((link) => (
        <li
          key={link.title}
          className='flex flex-col items-center text-center p-5 bg-white dark:bg-gray-800 rounded-lg shadow-lg transform transition hover:scale-105'
          data-testid='Ambassadors-list'
        >
          <img
            src={link.icon}
            alt={link.title}
            className='w-[150px] h-auto object-contain mb-5'
          />
          <h2 className='text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-3'>
            {link.title}
          </h2>
          <p className='text-sm md:text-base text-gray-700 dark:text-slate-100 leading-relaxed'>
            {link.details}
          </p>
        </li>
      ))}
    </ul>
  );
};

export default AmbassadorList;
