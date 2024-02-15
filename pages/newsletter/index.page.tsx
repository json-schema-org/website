import React from 'react'
import NewsletterForm from '~/components/Newsletter'
import Layout from '~/components/Layout'

const index = () => {
  return (
    <>
      <Layout>
        <NewsletterForm className='pt-[100px]' wrapperClassName='h-[calc(100vh-340px)]' />
      </Layout>
    
    </>
  )
}

export default index