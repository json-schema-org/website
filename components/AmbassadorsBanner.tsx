import Link from 'next/link';
import React from 'react';

const AmbassadorBanner: React.FC = () => {
  return (
    <div className='flex justify-center mx-4 sm:mx-6 md:mx-10 my-8 w-full'>
      <div className='group relative h-auto w-full sm:w-5/6 md:w-4/5 lg:w-2/3 xl:w-1/2 rounded-lg border border-gray-200 bg-white p-6 sm:p-8 shadow-3xl dark:shadow-2xl dark:shadow-slate-900 transition-colors ease-in-out hover:bg-slate-100 dark:bg-slate-800 hover:dark:bg-slate-900/30'>
        <h3 className='text-xl sm:text-2xl md:text-3xl font-bold mb-4 text-gray-800 dark:text-slate-100 text-center'>
          Become a JSON Schema Ambassador
        </h3>
        <p className='text-sm sm:text-base md:text-lg text-gray-600 dark:text-slate-100 mb-6 text-center'>
          The JSON Schema Ambassador program is now open for applications! If
          you're selected, you'll join JSON Schema's mission of helping
          community members all over the world build the future of JSON Schema.
        </p>
        <div className='w-full grid grid-cols-1 sm:grid-cols-2 gap-4 my-4 mx-auto'>
          <Link
            href='https://github.com/json-schema-org/community/tree/main/programs/ambassadors#become-an-json-schema-ambassador'
            className='inline-block px-6 py-3 bg-blue-600 text-white font-semibold text-center rounded hover:bg-blue-700 transition duration-300'
          >
            Become Ambassador
          </Link>
          <Link
            href='https://github.com/json-schema-org/community/tree/main/programs/ambassadors'
            className='inline-block bg-gray-300 text-slate-700 text-center px-6 py-3 rounded-md shadow hover:bg-gray-400 transition'
          >
            Learn More
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AmbassadorBanner;
