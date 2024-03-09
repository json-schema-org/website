import React from 'react';
import NewsletterForm from '~/components/Newsletter';
import Layout from '~/components/Layout';

const index = () => {
  return (
    <>
      <Layout>
        <NewsletterForm
          className='pt-[100px] bg-white text-black'
          wrapperClassName='h-full sm:h-[calc(100vh-100px)]  bg-white py-[50px] sm:py-0  px-5 sm:px-10 lg:w-full'
        />
      </Layout>
    </>
  );
};

export default index;
