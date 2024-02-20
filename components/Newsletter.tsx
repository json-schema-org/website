import React, { useState } from 'react'
import classnames from 'classnames'

interface NewsletterFormProps {
  wrapperClassName?: string
  className?: string
}
const NewsletterForm: React.FC<NewsletterFormProps> = ({ wrapperClassName = '', className = '' }) => { 
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')

  // const handleSubmit = (e: any) => {
  //   e.preventDefault()
  //   // Handle form submission here, such as sending a request to subscribe the user
  // }

  // const handleFileChange = (e: any) => {
    
  // }

  return (
    <section
      className={classnames('w-[100vw]  mx-auto flex items-center justify-center bg-[#090A11]', wrapperClassName)}>
      <div className={classnames('w-full max-w-[900px] text-center px-5 py-9  bg-[#090A11] relative', className)}>
        
        <h3 className=' font-bold tracking-heading mb-4 text-h3 px-5'>
            Subscribe to our newsletter to receive news about Json Schema.
        </h3>
        <p
          className='text-lg  mb-8'
        >
            We respect your inbox. No spam, promise ✌️
        </p>
        <form className='flex flex-col md:flex-row gap-4'>
          <input
            type='text'
            name='username'
            placeholder='Your Name'
            className='form-input block w-full py-3 text-lg sm:text-lg sm:leading-5  md:flex-1 rounded-md px-5 bg-gray-200'
            value={username}
            onChange={(e: any) => setUsername(e.target.value)}
          />
          <input
            type='email'
            name='email'
            placeholder='Your Email'
            className='form-input block w-full py-3 text-lg sm:text-lg sm:leading-5  md:flex-1 rounded-md px-5 bg-gray-200'
            value={email}
            onChange={(e: any) => setEmail(e.target.value)}
          />
          <button
            type='submit'
            className='bg-primary-500 hover:bg-primary-400 text-white bg-[#445cf4] transition-all duration-500 ease-in-out rounded-md px-4 py-3 text-md font-semibold tracking-heading w-full md:mt-0 md:flex-1'
          >
            <span className='inline-block'>Subscribe</span>
          </button>
        </form>
      </div>

    </section>
  )
}

export default NewsletterForm
