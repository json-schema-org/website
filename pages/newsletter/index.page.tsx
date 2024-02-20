import React from 'react'
import NewsletterForm from '~/components/Newsletter'
import Layout from '~/components/Layout'

const index = () => {
  return (
    <>
      <Layout>
        <NewsletterForm className='pt-[100px] bg-white text-black' wrapperClassName='h-[calc(100vh-340px)] bg-white' />
      </Layout>
    
    </>
  )
}

export default index