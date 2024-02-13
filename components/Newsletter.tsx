import React, { useState } from 'react'

const NewsletterForm = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle form submission here, such as sending a request to subscribe the user
  }

  return (
    <div className='bg-gray-100 min-h-screen flex items-center justify-center'>
      <div className='w-full max-w-sm'>
        <img src='logo.png' alt='AsyncAPI' className='mx-auto w-24 mb-6' />
        <form onSubmit={handleSubmit}>
          <div className='md:flex md:items-center mb-6'>
            <div className='md:w-1/3'>
              <label htmlFor='name' className='block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4'>
                Your name
              </label>
            </div>
            <div className='md:w-2/3'>
              <input
                className='bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500'
                id='name'
                type='text'
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>
          <div className='md:flex md:items-center mb-6'>
            <div className='md:w-1/3'>
              <label htmlFor='email' className='block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4'>
                Your email
              </label>
            </div>
            <div className='md:w-2/3'>
              <input
                className='bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500'
                id='email'
                type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
          <div className='md:flex md:items-center'>
            <div className='md:w-1/3'></div>
            <div className='md:w-2/3'>
              <button className='shadow bg-purple-500 hover:bg-purple-400 focus:shadow-outline-purple focus:outline-none text-white font-bold py-2 px-4 rounded' type='submit'>
                Subscribe
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default NewsletterForm