import Link from 'next/link';
import React from 'react';

const AmbassadorBanner: React.FC = () => {
  return (
    <div className='flex justify-center mx-4 md:mx-10 my-8 w-full'>
      <div className='group relative h-auto w-full md:w-5/6 lg:w-2/3 xl:w-1/2 rounded-lg border border-gray-200 bg-white p-6 px-12 shadow-3xl dark:shadow-2xl dark:shadow-slate-900 transition-colors ease-in-out hover:bg-slate-100 dark:bg-slate-800 hover:dark:bg-slate-900/30'>
        <h3 className='text-2xl font-bold mb-2 text-gray-800 dark:text-slate-100'>
          Become a JSON Schema Ambassador
        </h3>
        <p className='text-gray-600 dark:text-slate-100 mb-6'>
          The JSON Schema Ambassador program is now open for applications! If
          you're selected, you'll join JSON Schema's mission of helping
          community members all over the world build the future of JSON Schema.
        </p>
        <div className='flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-5'>
          <Link
            href='https://github.com/json-schema-org/community/tree/main/programs/ambassadors#become-an-json-schema-ambassador'
            className='bg-blue-700 dark:bg-blue-600 text-white px-6 py-3 rounded-md shadow hover:bg-blue-500 dark:hover:bg-blue-400 transition'
          >
            Become Ambassador
          </Link>
          <Link
            href='https://github.com/json-schema-org/community/tree/main/programs/ambassadors'
            className='bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-white px-6 py-3 rounded-md shadow hover:bg-gray-400 dark:hover:bg-gray-600 transition'
          >
            Learn More
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AmbassadorBanner;
