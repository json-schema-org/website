import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';

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
          className='flex flex-col items-center text-center'
          data-testid='Ambassadors-list'
        >
          <Card className='dark:border-gray-700 w-full h-full p-5 bg-white dark:bg-gray-800 rounded-lg shadow-lg transform transition hover:scale-105'>
            <CardContent className='p-0'>
              <img
                src={link.icon}
                alt={link.title}
                className='w-[150px] h-auto object-contain mb-5 mx-auto'
              />
              <CardHeader className='p-0 mb-3'>
                <CardTitle className='text-lg md:text-xl font-semibold text-gray-900 dark:text-white'>
                  {link.title}
                </CardTitle>
              </CardHeader>
              <CardDescription className='text-sm md:text-base text-gray-700 dark:text-slate-100 leading-relaxed'>
                {link.details}
              </CardDescription>
            </CardContent>
          </Card>
        </li>
      ))}
    </ul>
  );
};

export default AmbassadorList;
