import React from 'react';
import Link from 'next/link';
import TextTruncate from 'react-text-truncate';
export interface CardProps {
  title: string;
  body: string;
  icon?: string;
  link?: string;
  image?: string;
  extended?: boolean;
  headerSize?: 'small' | 'medium' | 'large';
  bodyTextSize?: 'small' | 'medium' | 'large';
}

const CardBody = ({
  title,
  body,
  icon,
  link,
  image,
  extended,
  headerSize,
  bodyTextSize,
}: CardProps) => {
  const headerSizeClasses: Record<string, string> = {
    small: 'text-[0.9rem]',
    medium: 'text-[1.3rem]',
    large: 'text-[2rem]',
  };
  const bodyTextSizeClasses: Record<string, string> = {
    small: 'text-[0.85rem]',
    medium: 'text-[1rem]',
    large: 'text-[1.5rem]',
  };
  return (
    <div className='group relative h-full w-full rounded-lg border border-gray-200 bg-white p-6 px-12 shadow-3xl dark:shadow-2xl dark:shadow-slate-900 transition-colors ease-in-out hover:bg-slate-100 dark:bg-slate-800 hover:dark:bg-slate-900/30'>
      <div className='flex justify-center '>
        {image && (
          <img
            src={image}
            className='h-32 p-2 object-contain'
            data-test='card-image'
          />
        )}
      </div>
      <div className='flex flex-row items-start mb-6'>
        {icon && (
          <span className='mr-6 flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-lg border bg-blue-200 px-3 text-gray-900 dark:text-white'>
            <img
              src={icon}
              alt={title}
              className='h-full w-full'
              data-test='card-icon'
            />
          </span>
        )}
        <p
          className={`mb-1 mt-1 items-center font-bold text-gray-900 dark:text-white ${headerSizeClasses[headerSize || 'medium']}`}
          data-test='card-title'
        >
          {title}
        </p>
      </div>
      <hr className='mb-4 mt-3.5 h-px border-0 bg-gray-400' />
      <p
        className={`mb-8 text-black mt-5 dark:text-white  ${bodyTextSizeClasses[bodyTextSize || 'medium']} `}
        data-test='card-body'
      >
        {extended && <span dangerouslySetInnerHTML={{ __html: body }} />}
        {!extended && <TextTruncate element='span' line={3} text={body} />}
      </p>
      {link && (
        <p
          className='absolute bottom-3 right-5 font-medium opacity-0 transition-opacity delay-150 ease-in-out group-hover:opacity-100 text-black dark:text-white'
          data-test='card-read-more'
        >
          Read More
        </p>
      )}
    </div>
  );
};

const Card: React.FC<CardProps> = ({
  title,
  body,
  icon,
  link,
  image,
  extended,
  headerSize,
  bodyTextSize,
}) => {
  return (
    <>
      {link ? (
        <Link href={link} data-test='card-link'>
          <CardBody
            {...{
              title,
              body,
              icon,
              link,
              image,
              extended,
              headerSize,
              bodyTextSize,
            }}
          />
        </Link>
      ) : (
        <CardBody
          {...{
            title,
            body,
            icon,
            link,
            image,
            extended,
            headerSize,
            bodyTextSize,
          }}
        />
      )}
    </>
  );
};

export default Card;
