import Link from 'next/link';
import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const AmbassadorBanner: React.FC = () => {
  return (
    <div className='flex justify-center mx-4 sm:mx-6 md:mx-10 my-8 w-full'>
      <Card className='group relative h-auto w-full sm:w-5/6 md:w-4/5 lg:w-2/3 xl:w-1/2 rounded-lg border border-gray-200 bg-white p-6 sm:p-8 shadow-3xl dark:shadow-2xl dark:shadow-slate-900 transition-colors ease-in-out hover:bg-slate-100 dark:bg-slate-800 hover:dark:bg-slate-900/30'>
        <CardHeader className='p-0 mb-4'>
          <CardTitle className='text-xl sm:text-2xl md:text-3xl font-bold mb-4 text-gray-800 dark:text-slate-100 text-center'>
            Become a JSON Schema Ambassador
          </CardTitle>
          <CardDescription className='text-sm sm:text-base md:text-lg text-gray-600 dark:text-slate-100 mb-6 text-center'>
            The JSON Schema Ambassador program is now open for applications! If
            you're selected, you'll join JSON Schema's mission of helping
            community members all over the world build the future of JSON
            Schema.
          </CardDescription>
        </CardHeader>
        <CardContent className='p-0'>
          <div className='w-full grid grid-cols-1 sm:grid-cols-2 gap-4 my-4 mx-auto'>
            <Button
              asChild
              className='px-6 py-3 bg-blue-600 hover:bg-blue-700 transition duration-300 text-white'
            >
              <Link href='https://github.com/json-schema-org/community/tree/main/programs/ambassadors#become-a-json-schema-ambassador'>
                Become Ambassador
              </Link>
            </Button>
            <Button
              asChild
              variant='secondary'
              className='px-6 py-3 bg-gray-300 text-slate-700 hover:bg-gray-400 transition'
            >
              <Link href='https://github.com/json-schema-org/community/tree/main/programs/ambassadors'>
                Learn More
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AmbassadorBanner;
