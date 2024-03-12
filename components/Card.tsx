import React from 'react';
import Link from 'next/link';

interface CardProps {
  title: string;
  body: string;
  icon?: string;
  link?: string;
  image?: string;
}

const CardBody = ({ title, body, icon, link, image }: CardProps) => {
  return (
    <div className='group relative h-full w-full max-w-lg rounded-lg border border-gray-200 bg-white p-6 px-12 shadow-3xl transition-colors delay-[150ms] ease-in-out hover:bg-slate-100'>
      <div className='flex justify-center'>
        {image && <img src={image} className='h-32 w-36 p-2' />}
      </div>
      <div className='flex flex-row items-start'>
        {icon && (
          <span className='mr-6 flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-lg border bg-blue-200 px-3 text-gray-900'>
            <img src={icon} alt={title} className='h-full w-full' />
          </span>
        )}
        <h3 className='mb-5 mt-1 items-center text-[2rem] font-bold text-gray-900'>
          {title}
        </h3>
      </div>
      <hr className='mb-4 mt-3.5 h-px border-0 bg-gray-400' />
      <p className='text-lg mb-8 mt-5'>{body}</p>
      {link && (
        <p className='absolute bottom-3 right-5 font-medium opacity-0 transition-opacity delay-150 ease-in-out group-hover:opacity-100'>
          Read More
        </p>
      )}
    </div>
  );
};

const Card: React.FC<CardProps> = ({ title, body, icon, link, image }) => {
  return (
    <>
      {link ? (
        <Link href={link}>
          <CardBody {...{ title, body, icon, link, image }} />
        </Link>
      ) : (
        <CardBody {...{ title, body, icon, link, image }} />
      )}
    </>
  );
};

export default Card;