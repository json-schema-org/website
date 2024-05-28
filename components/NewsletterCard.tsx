import Link from 'next/link';
import React from 'react';

type NewsletterProps = {
  url: string;
  title: string;
  date: string;
};

const NewsletterCard = ({
  newsletterData,
}: {
  newsletterData: NewsletterProps[];
}) => {
  const sortedNewsletterData = [...newsletterData].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  return (
    <div className='grid grid-cols-1 p-4 sm:grid-cols-2 md:grid-cols-3 gap-4'>
      {sortedNewsletterData.map((newsletter, index) => (
        <div
          key={index}
          className='p-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:shadow-lg'
        >
          <Link href={newsletter.url} className='block'>
            <h3 className='text-lg font-semibold mb-2 truncate'>
              {newsletter.title}
            </h3>
          </Link>
          <p className='text-gray-600 dark:text-white mb-2'>
            {newsletter.date}
          </p>
        </div>
      ))}
    </div>
  );
};

export default NewsletterCard;
