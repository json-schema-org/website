import React from 'react'
import Navbar from '~/components/Molecules/navbarComponents/navbar'
import NewsletterForm from '~/components/Newsletter'
import Footer from '~/components/Molecules/footer'

const index = () => {
  return (
    <>
      <Navbar />
      <NewsletterForm className='pt-[100px]' wrapperClassName='h-[calc(100vh-340px)]' />
      <Footer />
    </>
  )
}

export default index