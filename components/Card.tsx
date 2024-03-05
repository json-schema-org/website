import React from 'react';
import Link from 'next/link';

interface CardProps {
  title: string;
  body: string;
  icon?: string;
  link?: string;
}

const Card: React.FC<CardProps> = ({ title, body, icon, link }) => {
  return (
    <div className='w-full max-w-md rounded-lg border border-gray-200 bg-white p-6 shadow-3xl'>
      <div className='flex flex-row items-center'>
        {icon && (
          <span className='mb-6 mr-4 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg border bg-blue-200 text-gray-900'>
            <img src={icon} alt={title} className='h-full w-full' />
          </span>
        )}
        <h3 className='text-2xl mb-5 pt-5 text-h4 font-bold text-gray-900'>
          {title}
        </h3>
      </div>

      <p className='mb-5'>{body}</p>

      {link && (
        <Link href={link} className='text-sm italic text-gray-500'>
          {link}
        </Link>
      )}
    </div>
  );
};

export default Card;
