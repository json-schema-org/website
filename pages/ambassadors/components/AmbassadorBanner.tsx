import Link from 'next/link';
import React from 'react';

const AmbassadorBanner: React.FC = () => {
  return (
    <div className='flex justify-center mx-4 md:mx-10 my-8 w-full'>
      <div className='group relative h-auto md:w-5/6 lg:w-1/2 xl:w-1/2 rounded-lg border border-gray-200 bg-white p-6 px-12 shadow-3xl dark:shadow-2xl dark:shadow-slate-900 transition-colors ease-in-out hover:bg-slate-100 dark:bg-slate-800 hover:dark:bg-slate-900/30'>
        <h3 className='text-2xl font-bold mb-2 text-gray-800 dark:text-slate-100 text-center'>
          Become a JSON Schema Ambassador
        </h3>
        <p className='text-gray-600 dark:text-slate-100 mb-6 text-center'>
          The JSON Schema Ambassador program is now open for applications! If
          you're selected, you'll join JSON Schema's mission of helping
          community members all over the world build the future of JSON Schema.
        </p>
        <div className='w-full lg:w-full grid grid-cols-2 sm:grid-cols-2 gap-6 my-[10px] mx-auto mt-8 '>
          <Link
            href='https://github.com/json-schema-org/community/tree/main/programs/ambassadors#become-an-json-schema-ambassador'
            className='inline-block px-6 py-3 bg-blue-600 text-white font-semibold text-center rounded hover:bg-blue-700 transition duration-300'
          >
            Become Ambassador
          </Link>
          <Link
            href='https://github.com/json-schema-org/community/tree/main/programs/ambassadors'
            className='inline-block bg-gray-300 dark:bg-gray-700 text-gray-700 text-center dark:text-slate-300 px-6 py-3 rounded-md shadow hover:bg-gray-400 dark:hover:bg-gray-600 transition'
          >
            Learn More
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AmbassadorBanner;
